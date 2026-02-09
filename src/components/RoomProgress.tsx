'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight, Plus, Home, Check } from 'lucide-react';
import { useItems } from '@/hooks/useItems';

// 代表的な場所のデフォルト情報
const ROOM_META: Record<string, { icon: string; minItems: number }> = {
  'キッチン': { icon: '🍳', minItems: 5 },
  'リビング': { icon: '🛋️', minItems: 5 },
  '子供部屋': { icon: '🧸', minItems: 3 },
  'デスク': { icon: '🖥️', minItems: 3 },
  '洗面所': { icon: '🪥', minItems: 3 },
  '寝室': { icon: '🛏️', minItems: 3 },
  '玄関': { icon: '🚪', minItems: 2 },
  'クローゼット': { icon: '👗', minItems: 3 },
};

// 場所の充実度に応じたステータス
function getRoomStatus(count: number, target: number): { label: string; color: string; bgColor: string } {
  const ratio = count / target;
  if (ratio >= 1) return { label: '充実', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-800/30' };
  if (ratio >= 0.6) return { label: 'いい感じ', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-800/30' };
  if (ratio >= 0.2) return { label: 'もう少し', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-800/30' };
  return { label: 'スタート', color: 'text-gray-500 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800' };
}

interface RoomProgressProps {
  onAddItem: () => void;
}

export default function RoomProgress({ onAddItem }: RoomProgressProps) {
  const { data: items = [], isFetched } = useItems();
  const [isExpanded, setIsExpanded] = useState(false);

  // 場所別のアイテム集計
  const roomData = useMemo(() => {
    if (items.length === 0) return [];

    const roomCounts: Record<string, number> = {};
    items.forEach((item) => {
      const loc = item.location || '未分類';
      roomCounts[loc] = (roomCounts[loc] || 0) + 1;
    });

    return Object.entries(roomCounts)
      .filter(([loc]) => loc !== '未分類' && loc !== '')
      .map(([location, count]) => {
        const meta = ROOM_META[location] || { icon: '📍', minItems: 3 };
        const target = meta.minItems;
        const status = getRoomStatus(count, target);
        return { location, count, target, icon: meta.icon, status };
      })
      .sort((a, b) => b.count - a.count);
  }, [items]);

  // 場所の種類数
  const uniqueRooms = roomData.length;
  const completedRooms = roomData.filter((r) => r.count >= r.target).length;

  // 3件以上かつ2箇所以上登録している場合のみ表示
  if (!isFetched || items.length < 3 || uniqueRooms < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 mb-3"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* ヘッダー */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-800/30 rounded-lg">
              <Home className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                おうちマップ
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {uniqueRooms}ヶ所を記録中 ・ {completedRooms}ヶ所充実
              </p>
            </div>
          </div>

          {/* ミニ進捗 */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {roomData.slice(0, 4).map((room) => (
                <span
                  key={room.location}
                  className="w-6 h-6 flex items-center justify-center text-xs bg-gray-100 dark:bg-zinc-800 rounded-full ring-2 ring-white dark:ring-zinc-900"
                  title={room.location}
                >
                  {room.icon}
                </span>
              ))}
              {roomData.length > 4 && (
                <span className="w-6 h-6 flex items-center justify-center text-[10px] bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-400 rounded-full ring-2 ring-white dark:ring-zinc-900">
                  +{roomData.length - 4}
                </span>
              )}
            </div>
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </button>

        {/* 展開時の詳細 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-2 border-t border-gray-100 dark:border-gray-800 pt-3">
                {roomData.map((room, index) => {
                  const progress = Math.min((room.count / room.target) * 100, 100);
                  const isComplete = room.count >= room.target;

                  return (
                    <motion.div
                      key={room.location}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-lg w-7 text-center">{room.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                            {room.location}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {isComplete && (
                              <Check className="w-3 h-3 text-emerald-500" />
                            )}
                            <span className={`text-[10px] font-medium ${room.status.color}`}>
                              {room.count}件
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={`h-full rounded-full ${
                              isComplete
                                ? 'bg-emerald-400 dark:bg-emerald-500'
                                : 'bg-indigo-400 dark:bg-indigo-500'
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* まだ登録していない場所の提案 */}
                {uniqueRooms < Object.keys(ROOM_META).length && (
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={onAddItem}
                      className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>新しい場所のアイテムを登録する</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
