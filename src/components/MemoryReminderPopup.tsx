'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { useMemories, type Memory } from '@/hooks/useMemories';

// 表示条件をチェック
function shouldShowReminder(): boolean {
  if (typeof window === 'undefined') return false;

  // 永久に非表示にした場合
  if (localStorage.getItem('memoryReminderDismissed') === 'true') {
    return false;
  }

  // 今日既に表示した場合
  const lastShown = sessionStorage.getItem('memoryReminderLastShown');
  const today = new Date().toDateString();
  if (lastShown === today) {
    return false;
  }

  return true;
}

export default function MemoryReminderPopup() {
  // 初期状態で表示条件をチェック
  const shouldFetch = useMemo(() => shouldShowReminder(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [hasShownOnce, setHasShownOnce] = useState(false);

  // TanStack Queryでデータ取得
  const { data, isLoading } = useMemories(shouldFetch);

  // データがロードされたら表示（一度だけ）
  const displayMemory = useMemo(() => {
    if (!isLoading && data?.memories?.length && !hasShownOnce) {
      return data.memories[0];
    }
    return selectedMemory;
  }, [data, isLoading, hasShownOnce, selectedMemory]);

  // 表示タイミングの制御
  if (!isLoading && data?.memories?.length && !hasShownOnce && !isOpen) {
    // 少し遅延してから表示
    setTimeout(() => {
      setSelectedMemory(data.memories[0]);
      setIsOpen(true);
      setHasShownOnce(true);
    }, 2000);
  }

  const handleClose = () => {
    setIsOpen(false);
    // 今日の表示済みフラグを設定
    sessionStorage.setItem('memoryReminderLastShown', new Date().toDateString());
  };

  const handleDismissForever = () => {
    setIsOpen(false);
    // より長期間非表示
    localStorage.setItem('memoryReminderDismissed', 'true');
    sessionStorage.setItem('memoryReminderLastShown', new Date().toDateString());
  };

  const currentMemory = displayMemory || selectedMemory;

  if (!data || !currentMemory) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    思い出を振り返ろう
                  </h2>
                  <p className="text-white/80 text-sm">
                    {currentMemory.period}に登録したモノ
                  </p>
                </div>
              </div>
            </div>

            {/* Period Tabs */}
            {data.memories.length > 1 && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-zinc-700 overflow-x-auto">
                <div className="flex gap-2">
                  {data.memories.map((memory) => (
                    <button
                      key={memory.days}
                      onClick={() => setSelectedMemory(memory)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        currentMemory.days === memory.days
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {memory.period}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Items */}
            <div className="px-6 py-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {currentMemory.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-2xl shadow-sm overflow-hidden">
                      {item.generatedIcon ? (
                        <img
                          src={item.generatedIcon}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 space-y-3">
              <button
                onClick={handleClose}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-colors"
              >
                コレクションを見る
              </button>
              <button
                onClick={handleDismissForever}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                この通知を表示しない
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
