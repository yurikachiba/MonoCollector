'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronRight, X, BookOpen, TrendingUp } from 'lucide-react';
import { useItems } from '@/hooks/useItems';

// 週の最初の日を取得
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

// 今週のサマリーを表示するか判定
function shouldShowDigest(): boolean {
  if (typeof window === 'undefined') return false;
  const lastShown = localStorage.getItem('weeklyDigestLastShown');
  if (!lastShown) return true;

  // 今週のはじめ以降にまだ表示していなければ表示
  const weekStart = getWeekStart(new Date());
  return new Date(lastShown) < weekStart;
}

export default function WeeklyDigestBanner() {
  const { data: items = [], isFetched } = useItems();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // 今週と先週のアイテム集計
  const digest = useMemo(() => {
    if (items.length === 0) return null;

    const now = new Date();
    const thisWeekStart = getWeekStart(now);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisWeekItems = items.filter(
      (item) => new Date(item.createdAt) >= thisWeekStart
    );
    const lastWeekItems = items.filter(
      (item) => {
        const d = new Date(item.createdAt);
        return d >= lastWeekStart && d < thisWeekStart;
      }
    );

    // 今週の新しいカテゴリ
    const thisWeekCategories = new Set(thisWeekItems.map((i) => i.category));
    // 今週の新しい場所
    const thisWeekLocations = new Set(
      thisWeekItems.filter((i) => i.location).map((i) => i.location)
    );

    // 成長率
    const growth = lastWeekItems.length > 0
      ? Math.round(((thisWeekItems.length - lastWeekItems.length) / lastWeekItems.length) * 100)
      : thisWeekItems.length > 0 ? 100 : 0;

    return {
      thisWeek: thisWeekItems.length,
      lastWeek: lastWeekItems.length,
      growth,
      categories: thisWeekCategories.size,
      locations: thisWeekLocations.size,
      total: items.length,
      recentItems: thisWeekItems
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    };
  }, [items]);

  // 表示判定
  const canShow = useMemo(() => shouldShowDigest(), []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('weeklyDigestLastShown', new Date().toISOString());
  };

  // 5件以上かつ表示対象かつ今週に何か活動があった場合のみ
  if (!isFetched || !canShow || isDismissed || !digest || items.length < 5) return null;
  // 先週も今週も0件なら表示しない
  if (digest.thisWeek === 0 && digest.lastWeek === 0) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 mb-3"
      >
        <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20 rounded-2xl border border-violet-200/60 dark:border-violet-800/30 overflow-hidden">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-violet-100 dark:bg-violet-800/30 rounded-lg">
                  <Calendar className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    今週のまとめ
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {digest.thisWeek > 0 ? (
                      <>
                        <span className="font-medium text-violet-600 dark:text-violet-400">{digest.thisWeek}件</span>
                        {' '}登録
                        {digest.growth > 0 && (
                          <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                            (+{digest.growth}%)
                          </span>
                        )}
                      </>
                    ) : (
                      '今週はまだ登録がありません'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowDetail(true)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-800/30 rounded-lg transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>詳しく見る</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 詳細モーダル */}
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => { setShowDetail(false); handleDismiss(); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ヘッダー */}
              <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500">
                <button
                  onClick={() => { setShowDetail(false); handleDismiss(); }}
                  className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex p-3 bg-white/20 rounded-2xl mb-4"
                  >
                    <BookOpen className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    今週の振り返り
                  </h2>
                  <p className="text-white/80 text-sm">
                    あなたのコレクションの成長
                  </p>
                </div>
              </div>

              {/* 統計グリッド */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                      {digest.thisWeek}
                    </p>
                    <p className="text-xs text-gray-500">今週の登録</p>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {digest.total}
                    </p>
                    <p className="text-xs text-gray-500">総コレクション</p>
                  </div>
                  <div className="text-center p-3 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl">
                    <p className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
                      {digest.locations}
                    </p>
                    <p className="text-xs text-gray-500">場所</p>
                  </div>
                </div>

                {/* 先週比較 */}
                {digest.lastWeek > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl flex items-center gap-3">
                    <TrendingUp className={`w-5 h-5 ${digest.growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        先週比{' '}
                        <span className={`font-bold ${digest.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {digest.growth >= 0 ? '+' : ''}{digest.growth}%
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        先週: {digest.lastWeek}件 → 今週: {digest.thisWeek}件
                      </p>
                    </div>
                  </div>
                )}

                {/* 最近のアイテム */}
                {digest.recentItems.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      今週の記録
                    </p>
                    <div className="space-y-2">
                      {digest.recentItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                            {item.generatedIcon ? (
                              <img src={item.generatedIcon} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm">{item.icon}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                              {item.name}
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* フッター */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => { setShowDetail(false); handleDismiss(); }}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 transition-colors"
                >
                  コレクションを続ける
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
