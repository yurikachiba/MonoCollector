'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Flame, Package, Trophy, Star, ChevronRight, Sparkles, Palette } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { Item } from '@/lib/db';
import { useStats } from '@/hooks/useStats';
import { useCategories } from '@/hooks/useCategories';
import GlassCard from './GlassCard';
import { RarityBreakdown } from './RarityBadge';
import {
  calculateCollectionStats,
  CollectionStats,
  Achievement,
} from '@/lib/collection-system';

export default function CollectionPanel() {
  const { data: stats } = useStats();
  const { data: items = [] } = useItems();
  const { data: categories = [] } = useCategories();
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'badges' | 'rarity' | 'icons'>('overview');

  // 生成アイコンを持つアイテムを抽出
  const itemsWithIcons = useMemo(() => {
    return items.filter((item) => item.generatedIcon);
  }, [items]);

  // 連続日数を計算
  const getStreak = useMemo(() => {
    const today = new Date();
    let streak = 0;
    const sortedItems = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toDateString();

      const hasItem = sortedItems.some(
        (item) => new Date(item.createdAt).toDateString() === dateStr
      );

      if (hasItem) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  }, [items]);

  // コレクション統計を計算
  const collectionStats = useMemo(() => {
    return calculateCollectionStats(items, categories, getStreak);
  }, [items, categories, getStreak]);

  if (!stats) return null;

  const { level, unlockedAchievements, unlockedBadges, nextAchievements } = collectionStats;
  const expProgress = ((collectionStats.totalExp - level.minExp) / (level.maxExp - level.minExp)) * 100;

  return (
    <div className="px-4 py-2 space-y-3">
      {/* メインカード */}
      <GlassCard>
        <div className="space-y-4">
          {/* レベル表示 */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-2xl">{level.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Lv.{level.level}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {level.title}
                </span>
              </div>
              <div className="mt-1">
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${expProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {collectionStats.totalExp.toLocaleString()} / {level.maxExp.toLocaleString()} EXP
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-2">
            <StatItem
              icon={<Package className="w-4 h-4" />}
              value={stats.totalItems}
              label="アイテム"
            />
            <StatItem
              icon={<Flame className="w-4 h-4" />}
              value={getStreak}
              label="連続日"
              highlight={getStreak >= 7}
            />
            <StatItem
              icon={<Trophy className="w-4 h-4" />}
              value={unlockedAchievements.length}
              label="実績"
            />
            <StatItem
              icon={<Star className="w-4 h-4" />}
              value={unlockedBadges.length}
              label="バッジ"
            />
            <StatItem
              icon={<Palette className="w-4 h-4" />}
              value={itemsWithIcons.length}
              label="アイコン"
              highlight={itemsWithIcons.length > 0}
            />
          </div>

          {/* 次の目標 */}
          {nextAchievements.length > 0 && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 mb-2">次の目標</p>
              <div className="space-y-2">
                {nextAchievements.slice(0, 2).map((achievement) => (
                  <NextAchievementItem
                    key={achievement.id}
                    achievement={achievement}
                    currentValue={getCurrentValue(achievement, items.length, getStreak, categories.length)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 詳細を見るボタン */}
          <button
            onClick={() => setShowDetails(true)}
            className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
          >
            コレクション詳細を見る
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

      {/* 詳細モーダル */}
      <AnimatePresence>
        {showDetails && (
          <CollectionDetailModal
            stats={collectionStats}
            itemsWithIcons={itemsWithIcons}
            onClose={() => setShowDetails(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 統計アイテムコンポーネント
function StatItem({
  icon,
  value,
  label,
  highlight = false,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <div className={`flex justify-center mb-1 ${highlight ? 'text-orange-500' : 'text-gray-500'}`}>
        {icon}
      </div>
      <p className={`text-xl font-bold ${highlight ? 'text-orange-500' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}

// 次の実績表示
function NextAchievementItem({
  achievement,
  currentValue,
}: {
  achievement: Achievement;
  currentValue: number;
}) {
  const progress = Math.min((currentValue / achievement.threshold) * 100, 100);

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{achievement.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
            {achievement.name}
          </p>
          <p className="text-[10px] text-gray-500">
            {currentValue}/{achievement.threshold}
          </p>
        </div>
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gray-800 dark:bg-white rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

// 現在の値を取得
function getCurrentValue(
  achievement: Achievement,
  itemCount: number,
  streak: number,
  categoryCount: number
): number {
  switch (achievement.category) {
    case 'items':
      return itemCount;
    case 'streak':
      return streak;
    case 'category':
      return categoryCount;
    default:
      return 0;
  }
}

// 詳細モーダル
function CollectionDetailModal({
  stats,
  itemsWithIcons,
  onClose,
  activeTab,
  setActiveTab,
}: {
  stats: CollectionStats;
  itemsWithIcons: Item[];
  onClose: () => void;
  activeTab: 'overview' | 'achievements' | 'badges' | 'rarity' | 'icons';
  setActiveTab: (tab: 'overview' | 'achievements' | 'badges' | 'rarity' | 'icons') => void;
}) {
  const tabs = [
    { id: 'overview', label: '概要', icon: '📊' },
    { id: 'achievements', label: '実績', icon: '🏆' },
    { id: 'badges', label: 'バッジ', icon: '⭐' },
    { id: 'rarity', label: 'レア度', icon: '✨' },
    { id: 'icons', label: 'アイコン', icon: '🎨' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-900 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              コレクション
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'achievements' && <AchievementsTab stats={stats} />}
          {activeTab === 'badges' && <BadgesTab stats={stats} />}
          {activeTab === 'rarity' && <RarityTab stats={stats} />}
          {activeTab === 'icons' && <IconsTab itemsWithIcons={itemsWithIcons} />}
        </div>
      </motion.div>
    </motion.div>
  );
}

// 概要タブ
function OverviewTab({ stats }: { stats: CollectionStats }) {
  return (
    <div className="space-y-4">
      {/* レベル詳細 */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{stats.level.icon}</span>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Level {stats.level.level}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stats.level.title}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          総経験値: {stats.totalExp.toLocaleString()} EXP
        </p>
      </div>

      {/* カテゴリ別 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          カテゴリ別アイテム
        </h3>
        <div className="space-y-2">
          {stats.categoryBreakdown.map((cat, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{cat.icon}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{cat.category}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 実績タブ
function AchievementsTab({ stats }: { stats: CollectionStats }) {
  const { unlockedAchievements, nextAchievements } = stats;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        解除済み: {unlockedAchievements.length}個
      </p>

      {/* 解除済み実績 */}
      <div className="space-y-2">
        {unlockedAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <span className="text-2xl">{achievement.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{achievement.name}</p>
              <p className="text-xs text-gray-500">{achievement.description}</p>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full capitalize">
              {achievement.tier}
            </span>
          </div>
        ))}
      </div>

      {/* 次の実績 */}
      {nextAchievements.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            次の実績
          </h3>
          <div className="space-y-2 opacity-60">
            {nextAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <span className="text-2xl grayscale">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{achievement.name}</p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// バッジタブ
function BadgesTab({ stats }: { stats: CollectionStats }) {
  const { unlockedBadges } = stats;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        獲得バッジ: {unlockedBadges.length}個
      </p>

      <div className="grid grid-cols-3 gap-3">
        {unlockedBadges.map((badge) => (
          <motion.div
            key={badge.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
          >
            <span className="text-3xl mb-1">{badge.icon}</span>
            <p className="text-xs font-medium text-gray-900 dark:text-white text-center">
              {badge.name}
            </p>
            <p className="text-[10px] text-gray-500 text-center mt-1">
              {badge.description}
            </p>
          </motion.div>
        ))}
      </div>

      {unlockedBadges.length === 0 && (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500">
            アイテムを追加してバッジを獲得しよう！
          </p>
        </div>
      )}
    </div>
  );
}

// レア度タブ
function RarityTab({ stats }: { stats: CollectionStats }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        アイテムのレア度分布
      </p>

      <RarityBreakdown breakdown={stats.rarityBreakdown} />

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          レア度について
        </h3>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• <span className="text-gray-600">コモン</span> - 一般的なアイテム</p>
          <p>• <span className="text-green-600">アンコモン</span> - やや珍しいアイテム</p>
          <p>• <span className="text-blue-600">レア</span> - 珍しいアイテム</p>
          <p>• <span className="text-purple-600">エピック</span> - とても珍しいアイテム</p>
          <p>• <span className="text-amber-500">レジェンダリー</span> - 伝説級のアイテム</p>
        </div>
      </div>
    </div>
  );
}

// アイコンギャラリータブ
function IconsTab({ itemsWithIcons }: { itemsWithIcons: Item[] }) {
  const styleLabels: Record<string, string> = {
    mosaic: 'モザイク',
    gradient: 'グラデーション',
    geometric: '幾何学',
    abstract: '抽象',
    pixel: 'ピクセル',
  };

  // スタイル別にグループ化
  const iconsByStyle = useMemo(() => {
    const grouped: Record<string, Item[]> = {};
    itemsWithIcons.forEach((item) => {
      const style = item.iconStyle || 'unknown';
      if (!grouped[style]) {
        grouped[style] = [];
      }
      grouped[style].push(item);
    });
    return grouped;
  }, [itemsWithIcons]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        生成したオリジナルアイコン: {itemsWithIcons.length}個
      </p>

      {itemsWithIcons.length === 0 ? (
        <div className="text-center py-8">
          <Palette className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500">
            写真を追加するとオリジナルアイコンが生成されます
          </p>
        </div>
      ) : (
        <>
          {/* 全アイコンギャラリー */}
          <div className="grid grid-cols-5 gap-2">
            {itemsWithIcons.map((item) => (
              <motion.div
                key={item.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md cursor-pointer group"
                title={item.name}
              >
                {item.generatedIcon && (
                  <Image
                    src={item.generatedIcon}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
                {/* ホバー時にアイテム名を表示 */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                  <p className="text-[8px] text-white text-center leading-tight truncate">
                    {item.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* スタイル別内訳 */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              スタイル別
            </h3>
            <div className="space-y-2">
              {Object.entries(iconsByStyle).map(([style, items]) => (
                <div key={style} className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {items.slice(0, 3).map((item, i) => (
                      <div
                        key={item.id}
                        className="w-6 h-6 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-900"
                        style={{ zIndex: 3 - i }}
                      >
                        {item.generatedIcon && (
                          <Image
                            src={item.generatedIcon}
                            alt=""
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {styleLabels[style] || style}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {items.length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
