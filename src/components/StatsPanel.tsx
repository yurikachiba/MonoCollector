'use client';

import { motion } from 'framer-motion';
import { Trophy, Flame, TrendingUp, Package } from 'lucide-react';
import { useStore } from '@/lib/store';
import GlassCard from './GlassCard';

// Collection achievements
const achievements = [
  { id: 1, name: '初めての一歩', description: '最初のアイテムを登録', threshold: 1, icon: '🌱' },
  { id: 2, name: 'コレクター見習い', description: '10アイテム達成', threshold: 10, icon: '🎯' },
  { id: 3, name: '整理整頓マスター', description: '50アイテム達成', threshold: 50, icon: '📦' },
  { id: 4, name: 'モノの魔術師', description: '100アイテム達成', threshold: 100, icon: '✨' },
  { id: 5, name: 'コレクター王', description: '500アイテム達成', threshold: 500, icon: '👑' },
];

export default function StatsPanel() {
  const { stats, items } = useStore();

  if (!stats) return null;

  const totalItems = stats.totalItems;
  const currentAchievement = achievements.filter((a) => totalItems >= a.threshold).pop();
  const nextAchievement = achievements.find((a) => totalItems < a.threshold);
  const progress = nextAchievement
    ? (totalItems / nextAchievement.threshold) * 100
    : 100;

  // Calculate collection streak (days with items added)
  const getStreak = () => {
    const today = new Date();
    let streak = 0;
    const sortedItems = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (let i = 0; i < 30; i++) {
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
  };

  const streak = getStreak();

  return (
    <div className="px-4 py-2">
      <GlassCard>
        <div className="space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex justify-center mb-1">
                <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-pink-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totalItems}
              </p>
              <p className="text-xs text-gray-500">アイテム</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-1">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {streak}
              </p>
              <p className="text-xs text-gray-500">日連続</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-1">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.categoryBreakdown.length}
              </p>
              <p className="text-xs text-gray-500">カテゴリ</p>
            </div>
          </div>

          {/* Achievement Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentAchievement?.icon || '🎯'}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {currentAchievement?.name || '始めよう'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentAchievement?.description || 'アイテムを登録しよう'}
                  </p>
                </div>
              </div>
              {nextAchievement && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">次の目標</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {nextAchievement.icon} {nextAchievement.threshold}
                  </p>
                </div>
              )}
            </div>

            {nextAchievement && (
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
                />
              </div>
            )}
          </div>

          {/* Category Breakdown Mini */}
          {stats.categoryBreakdown.length > 0 && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 mb-2">カテゴリ別</p>
              <div className="flex flex-wrap gap-2">
                {stats.categoryBreakdown.slice(0, 5).map((cat, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/40 dark:bg-white/10 rounded-full text-xs"
                  >
                    {cat.category}
                    <span className="font-medium text-pink-600">{cat.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
