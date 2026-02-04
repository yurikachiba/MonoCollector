'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, Sparkles, X } from 'lucide-react';

// カテゴリごとの絵文字
const CATEGORY_ICONS: Record<string, string> = {
  food: '🍎',
  kitchen: '🍳',
  clothes: '👕',
  electronics: '📱',
  books: '📚',
  cosmetics: '💄',
  stationery: '✏️',
  toys: '🎮',
  cleaning: '🧹',
  medicine: '💊',
  furniture: '🪑',
  sports: '⚽',
  other: '📦',
};

interface MemoryItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  generatedIcon: string | null;
  createdAt: string;
}

interface Memory {
  period: string;
  days: number;
  items: MemoryItem[];
}

interface MemoriesData {
  memories: Memory[];
  hasRecentActivity: boolean;
  totalItems: number;
}

export default function MemoriesSection() {
  const [data, setData] = useState<MemoriesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // 永久非表示チェック
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('memoriesSectionDismissed') === 'true';
      if (dismissed) {
        setIsDismissed(true);
        setIsLoading(false);
        return;
      }
    }

    // データ取得
    fetch('/api/items/memories')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch memories:', err);
        setIsLoading(false);
      });
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('memoriesSectionDismissed', 'true');
    setIsDismissed(true);
  };

  // 非表示、ローディング中、データなし、または3件未満の場合は何も表示しない
  // 初回ユーザー（3件未満）には非表示にして、コレクションが育ってから表示
  if (isDismissed || isLoading || !data?.memories?.length || (data?.totalItems ?? 0) < 3) {
    return null;
  }

  const currentMemory = data.memories[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-800/30 rounded-lg">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                思い出を振り返ろう
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentMemory.period}に登録したモノ
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-white/50 dark:hover:bg-zinc-800/50 transition-colors"
            title="非表示にする"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs - 複数の期間がある場合 */}
        {data.memories.length > 1 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {data.memories.map((memory, index) => (
              <button
                key={memory.days}
                onClick={() => setActiveTab(index)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                  activeTab === index
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/60 dark:bg-zinc-800/60 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-zinc-800'
                }`}
              >
                {memory.period}
              </button>
            ))}
          </div>
        )}

        {/* Items */}
        <div className="px-4 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {currentMemory.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 bg-white/70 dark:bg-zinc-800/70 rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition-colors group"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-800/30 dark:to-purple-800/30 flex items-center justify-center overflow-hidden shrink-0">
                    {item.generatedIcon ? (
                      <img
                        src={item.generatedIcon}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : item.icon ? (
                      <img
                        src={item.icon}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">
                        {CATEGORY_ICONS[item.category as keyof typeof CATEGORY_ICONS] || '📦'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
