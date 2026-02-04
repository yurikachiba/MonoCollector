'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Boxes, TrendingUp, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useItems } from '@/hooks/useItems';
import { LucideIcon } from 'lucide-react';

// マイルストーン設定
interface MilestoneConfig {
  count: number;
  storageKey: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  message: string;
  submessage: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  buttonGradientFrom: string;
  buttonGradientTo: string;
  bgFrom: string;
  bgTo: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
}

const MILESTONES: MilestoneConfig[] = [
  {
    count: 2,
    storageKey: 'secondItemCelebrationShown',
    icon: Boxes,
    title: 'いいスタートです',
    subtitle: '2つ目を登録しました',
    message: '比べて見返せるようになりました',
    submessage: '続けると、あなたの思い出がコレクションになります',
    gradientFrom: 'from-blue-400',
    gradientVia: 'via-blue-500',
    gradientTo: 'to-indigo-500',
    buttonGradientFrom: 'from-blue-500',
    buttonGradientTo: 'to-indigo-500',
    bgFrom: 'from-blue-50',
    bgTo: 'to-indigo-50',
    borderColor: 'border-blue-100 dark:border-blue-800/30',
    iconBg: 'bg-blue-100 dark:bg-blue-800/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    accentColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    count: 5,
    storageKey: 'fifthItemCelebrationShown',
    icon: TrendingUp,
    title: 'コレクションが育っています！',
    subtitle: '5つの思い出を登録しました',
    message: 'あなただけのコレクションができてきました',
    submessage: 'タグを使うと、あとからこの時期をまとめて見返せます',
    gradientFrom: 'from-amber-500',
    gradientVia: 'via-orange-500',
    gradientTo: 'to-red-500',
    buttonGradientFrom: 'from-amber-500',
    buttonGradientTo: 'to-orange-500',
    bgFrom: 'from-amber-50',
    bgTo: 'to-orange-50',
    borderColor: 'border-amber-100 dark:border-amber-800/30',
    iconBg: 'bg-amber-100 dark:bg-amber-800/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    accentColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    count: 10,
    storageKey: 'tenthItemCelebrationShown',
    icon: Crown,
    title: '素敵なコレクターです！',
    subtitle: '10の思い出を登録しました',
    message: '未来のあなたが振り返れる宝物です',
    submessage: '何年後かに見返したとき、きっと懐かしく感じるはず',
    gradientFrom: 'from-purple-500',
    gradientVia: 'via-pink-500',
    gradientTo: 'to-rose-500',
    buttonGradientFrom: 'from-purple-500',
    buttonGradientTo: 'to-pink-500',
    bgFrom: 'from-purple-50',
    bgTo: 'to-pink-50',
    borderColor: 'border-purple-100 dark:border-purple-800/30',
    iconBg: 'bg-purple-100 dark:bg-purple-800/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    accentColor: 'text-purple-600 dark:text-purple-400',
  },
];

// localStorageの値を取得するヘルパー（SSR対応）
function getStorageValue(key: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(key) === 'true';
}

// 紙吹雪エフェクト
function triggerConfetti(colors: string[]) {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
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

interface MilestoneCelebrationProps {
  onAddAnother: () => void;
}

export default function MilestoneCelebration({
  onAddAnother,
}: MilestoneCelebrationProps) {
  const { data: items = [], isFetched } = useItems();
  const [currentMilestone, setCurrentMilestone] = useState<MilestoneConfig | null>(null);

  useEffect(() => {
    if (!isFetched) return;

    // 各マイルストーンをチェック
    for (const milestone of MILESTONES) {
      const alreadyShown = getStorageValue(milestone.storageKey);
      if (alreadyShown) continue;

      // ぴったりそのカウントの時に表示
      if (items.length === milestone.count) {
        const timer = setTimeout(() => {
          setCurrentMilestone(milestone);
          // 2件目は控えめに（紙吹雪なし）、5件目以上で紙吹雪
          if (milestone.count >= 5) {
            const colors = milestone.count === 5
              ? ['#f59e0b', '#f97316', '#ef4444']
              : ['#a855f7', '#ec4899', '#f43f5e'];
            triggerConfetti(colors);
          }
        }, 500);
        return () => clearTimeout(timer);
      }

      // カウントを超えたらフラグを立てる
      if (items.length > milestone.count) {
        localStorage.setItem(milestone.storageKey, 'true');
      }
    }
  }, [items.length, isFetched]);

  const handleClose = () => {
    if (currentMilestone) {
      localStorage.setItem(currentMilestone.storageKey, 'true');
    }
    setCurrentMilestone(null);
  };

  const handleAddAnother = () => {
    if (currentMilestone) {
      localStorage.setItem(currentMilestone.storageKey, 'true');
    }
    setCurrentMilestone(null);
    onAddAnother();
  };

  if (!currentMilestone) return null;

  const Icon = currentMilestone.icon;

  return (
    <AnimatePresence>
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
          <div className={`relative px-6 pt-8 pb-6 bg-gradient-to-br ${currentMilestone.gradientFrom} ${currentMilestone.gradientVia} ${currentMilestone.gradientTo} overflow-hidden`}>
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
                <Icon className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {currentMilestone.title}
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 leading-relaxed"
              >
                {currentMilestone.subtitle}
              </motion.p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`flex items-start gap-4 p-4 bg-gradient-to-r ${currentMilestone.bgFrom} ${currentMilestone.bgTo} dark:from-zinc-800/50 dark:to-zinc-800/30 rounded-2xl border ${currentMilestone.borderColor}`}
            >
              <div className={`p-2 ${currentMilestone.iconBg} rounded-xl shrink-0`}>
                <Sparkles className={`w-6 h-6 ${currentMilestone.iconColor}`} />
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                  {currentMilestone.message}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {currentMilestone.submessage}
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
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r ${currentMilestone.buttonGradientFrom} ${currentMilestone.buttonGradientTo} text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg active:scale-[0.98]`}
            >
              <Plus className="w-5 h-5" />
              <span>もっと登録する</span>
              <Sparkles className="w-4 h-4" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={handleClose}
              className="w-full py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              閉じる
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
