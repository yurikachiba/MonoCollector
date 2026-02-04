'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, PartyPopper, Boxes } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useItems } from '@/hooks/useItems';

const STORAGE_KEY = 'firstItemCelebrationShown';

// localStorageの値を取得するヘルパー（SSR対応）
function getStorageValue(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

// 紙吹雪エフェクト
function triggerConfetti() {
  if (typeof confetti === 'function') {
    // 左から
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
    });

    // 右から
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
    });
  }
}

// キラキラエフェクトの固定位置
const sparklePositions = [
  { x: 40, y: 20 },
  { x: 180, y: 60 },
  { x: 100, y: 120 },
  { x: 260, y: 160 },
  { x: 20, y: 200 },
  { x: 160, y: 80 },
];

interface FirstItemCelebrationProps {
  onAddAnother: () => void;
}

export default function FirstItemCelebration({
  onAddAnother,
}: FirstItemCelebrationProps) {
  const { data: items = [], isFetched } = useItems();
  const [isOpen, setIsOpen] = useState(false);

  // localStorageから取得した値を元に表示判定
  const alreadyShown = getStorageValue();

  useEffect(() => {
    // データ取得前、または既に表示済みの場合はスキップ
    if (!isFetched || alreadyShown) return;

    // 1件目が登録されたら表示
    if (items.length === 1) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        triggerConfetti();
      }, 500);
      return () => clearTimeout(timer);
    }

    // 2件以上の場合はフラグを立てる
    if (items.length >= 2) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }, [items.length, isFetched, alreadyShown]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleAddAnother = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    onAddAnother();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 overflow-hidden">
              {/* 閉じるボタン */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* キラキラエフェクト */}
              <div className="absolute inset-0 overflow-hidden">
                {sparklePositions.map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    initial={{
                      x: pos.x,
                      y: pos.y,
                      scale: 0,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>

              <div className="relative text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 10,
                    stiffness: 200,
                    delay: 0.2,
                  }}
                  className="inline-flex p-4 bg-white/20 rounded-full mb-4 backdrop-blur-sm"
                >
                  <PartyPopper className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  いいですね!
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 leading-relaxed"
                >
                  最初のアイテムを登録しました
                </motion.p>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800/30 rounded-xl shrink-0">
                  <Boxes className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                    もう1つ登録すると、あなたの
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      &quot;コレクション&quot;
                    </span>
                    が見えてきます
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    どんなモノを持っているか、一覧で確認できるようになります
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 space-y-3">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleAddAnother}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
              >
                <Plus className="w-5 h-5" />
                <span>もう1つ登録する</span>
                <Sparkles className="w-4 h-4" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={handleClose}
                className="w-full py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                あとで
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
