'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Plus, Zap, Trophy } from 'lucide-react';
import { useItems } from '@/hooks/useItems';

// ストリークに応じたメッセージ
function getStreakMessage(streak: number, hasAddedToday: boolean): { text: string; subtext: string; tone: 'encourage' | 'celebrate' | 'urgent' } {
  if (hasAddedToday) {
    if (streak >= 7) return { text: `${streak}日連続達成中`, subtext: 'すばらしい習慣です！', tone: 'celebrate' };
    if (streak >= 3) return { text: `${streak}日連続！`, subtext: 'いい調子です', tone: 'celebrate' };
    return { text: '今日も記録しました', subtext: '明日も続けよう', tone: 'celebrate' };
  }

  // 今日まだ登録していない場合
  if (streak >= 7) return { text: `${streak}日連続中...`, subtext: 'この記録を途切れさせないで！', tone: 'urgent' };
  if (streak >= 3) return { text: `${streak}日連続中`, subtext: '今日も1件で記録更新', tone: 'urgent' };
  if (streak >= 1) return { text: '連続記録スタート中', subtext: '今日も1件追加しよう', tone: 'encourage' };
  return { text: '今日から始めよう', subtext: '1件登録で連続記録スタート', tone: 'encourage' };
}

// ストリークに応じた次の目標
function getNextGoal(streak: number): { goal: number; label: string; icon: string } | null {
  const goals = [
    { goal: 3, label: '3日連続', icon: '🔥' },
    { goal: 7, label: '1週間連続', icon: '📅' },
    { goal: 14, label: '2週間連続', icon: '💪' },
    { goal: 30, label: '1ヶ月連続', icon: '🏃' },
    { goal: 60, label: '2ヶ月連続', icon: '🌟' },
    { goal: 100, label: '100日連続', icon: '💯' },
    { goal: 365, label: '1年連続', icon: '🎊' },
  ];
  return goals.find((g) => g.goal > streak) || null;
}

interface StreakBannerProps {
  onAddItem: () => void;
}

export default function StreakBanner({ onAddItem }: StreakBannerProps) {
  const { data: items = [], isFetched } = useItems();

  // ストリーク計算
  const { streak, hasAddedToday } = useMemo(() => {
    if (!items.length) return { streak: 0, hasAddedToday: false };

    const today = new Date();
    const todayStr = today.toDateString();
    const todayAdded = items.some(
      (item) => new Date(item.createdAt).toDateString() === todayStr
    );

    let consecutiveDays = 0;
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
        consecutiveDays++;
      } else if (i > 0) {
        break;
      }
    }

    return { streak: consecutiveDays, hasAddedToday: todayAdded };
  }, [items]);

  const message = useMemo(() => getStreakMessage(streak, hasAddedToday), [streak, hasAddedToday]);
  const nextGoal = useMemo(() => getNextGoal(streak), [streak]);

  // データ取得前、アイテムなし、または既に今日登録済みでストリークが短い場合は非表示
  if (!isFetched || items.length === 0) return null;
  // 今日登録済みでストリーク3日未満は非表示（喜ばしいが邪魔にならないように）
  if (hasAddedToday && streak < 3) return null;

  const progressToNext = nextGoal ? Math.min((streak / nextGoal.goal) * 100, 100) : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 mb-3"
    >
      <div className={`rounded-2xl border overflow-hidden ${
        message.tone === 'urgent'
          ? 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200/60 dark:border-orange-800/30'
          : message.tone === 'celebrate'
          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/60 dark:border-emerald-800/30'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/60 dark:border-blue-800/30'
      }`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* ストリーク情報 */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                message.tone === 'urgent'
                  ? 'bg-orange-100 dark:bg-orange-800/30'
                  : message.tone === 'celebrate'
                  ? 'bg-emerald-100 dark:bg-emerald-800/30'
                  : 'bg-blue-100 dark:bg-blue-800/30'
              }`}>
                {streak >= 7 ? (
                  <Trophy className={`w-5 h-5 ${
                    message.tone === 'urgent' ? 'text-orange-600 dark:text-orange-400' :
                    'text-emerald-600 dark:text-emerald-400'
                  }`} />
                ) : (
                  <Flame className={`w-5 h-5 ${
                    message.tone === 'urgent' ? 'text-orange-600 dark:text-orange-400' :
                    message.tone === 'celebrate' ? 'text-emerald-600 dark:text-emerald-400' :
                    'text-blue-600 dark:text-blue-400'
                  }`} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {message.text}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {message.subtext}
                </p>
              </div>
            </div>

            {/* アクション */}
            {!hasAddedToday && (
              <button
                onClick={onAddItem}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  message.tone === 'urgent'
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>記録する</span>
              </button>
            )}

            {hasAddedToday && streak >= 3 && (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">{streak}</span>
              </div>
            )}
          </div>

          {/* 次の目標のプログレスバー */}
          {nextGoal && streak > 0 && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>次の目標: {nextGoal.icon} {nextGoal.label}</span>
                <span>{streak}/{nextGoal.goal}日</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    message.tone === 'urgent'
                      ? 'bg-gradient-to-r from-orange-400 to-red-500'
                      : message.tone === 'celebrate'
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                  }`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
