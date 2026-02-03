'use client';

import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Trophy, Star, ArrowUp } from 'lucide-react';
import { useNotifications, BadgePopupData } from '@/contexts/NotificationContext';
import confetti from 'canvas-confetti';

// 紙吹雪エフェクト（canvas-confettiがない場合はスキップ）
function triggerConfetti() {
  if (typeof confetti === 'function') {
    // 左から
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
    });

    // 右から
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
    });
  }
}

// ティアに応じた色
const tierColors = {
  bronze: {
    bg: 'from-amber-700 to-amber-900',
    text: 'text-amber-100',
    glow: 'shadow-amber-500/50',
  },
  silver: {
    bg: 'from-gray-400 to-gray-600',
    text: 'text-gray-100',
    glow: 'shadow-gray-400/50',
  },
  gold: {
    bg: 'from-yellow-500 to-amber-600',
    text: 'text-yellow-50',
    glow: 'shadow-yellow-500/50',
  },
  platinum: {
    bg: 'from-cyan-400 to-blue-600',
    text: 'text-cyan-50',
    glow: 'shadow-cyan-400/50',
  },
  diamond: {
    bg: 'from-violet-400 to-purple-600',
    text: 'text-violet-50',
    glow: 'shadow-violet-400/50',
  },
  legendary: {
    bg: 'from-pink-500 via-purple-500 to-indigo-500',
    text: 'text-white',
    glow: 'shadow-pink-500/50',
  },
};

// キラキラエフェクトの固定位置（レンダリング時にMath.random()を避けるため）
const sparklePositions = [
  { x: 50, y: 30 },
  { x: 200, y: 80 },
  { x: 120, y: 150 },
  { x: 280, y: 200 },
  { x: 30, y: 250 },
  { x: 180, y: 100 },
];

interface PopupContentProps {
  data: BadgePopupData;
  onClose: () => void;
}

function PopupContent({ data, onClose }: PopupContentProps) {
  useEffect(() => {
    // ポップアップ表示時に紙吹雪を発射
    triggerConfetti();

    // 自動的に閉じる（10秒後）
    const timer = setTimeout(() => {
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (data.type === 'badge' && data.badge) {
    const colors = tierColors[data.badge.tier];

    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        className={`relative w-full rounded-3xl overflow-hidden shadow-2xl ${colors.glow}`}
      >
        {/* 背景グラデーション */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />

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

        {/* コンテンツ */}
        <div className="relative px-6 py-8 text-center">
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* タイトル */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Trophy className="w-6 h-6 text-white" />
            <span className={`text-lg font-bold ${colors.text}`}>バッジ獲得！</span>
            <Trophy className="w-6 h-6 text-white" />
          </motion.div>

          {/* バッジアイコン */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.3 }}
            className="w-24 h-24 mx-auto mb-4 flex items-center justify-center text-6xl bg-white/20 rounded-full backdrop-blur-sm"
          >
            {data.badge.icon}
          </motion.div>

          {/* バッジ名 */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-2xl font-bold ${colors.text} mb-2`}
          >
            {data.badge.name}
          </motion.h2>

          {/* 説明 */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-sm"
          >
            {data.badge.description}
          </motion.p>

          {/* ティア表示 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm text-white/90"
          >
            <Star className="w-4 h-4" />
            {data.badge.tier.toUpperCase()}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (data.type === 'achievement' && data.achievement) {
    const colors = tierColors[data.achievement.tier];

    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        className={`relative w-full rounded-3xl overflow-hidden shadow-2xl ${colors.glow}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`} />

        <div className="relative px-6 py-8 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="w-6 h-6 text-white" />
            <span className={`text-lg font-bold ${colors.text}`}>実績解除！</span>
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.3 }}
            className="w-24 h-24 mx-auto mb-4 flex items-center justify-center text-6xl bg-white/20 rounded-full backdrop-blur-sm"
          >
            {data.achievement.icon}
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-2xl font-bold ${colors.text} mb-2`}
          >
            {data.achievement.name}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-sm"
          >
            {data.achievement.description}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm text-white/90"
          >
            <Star className="w-4 h-4" />
            {data.achievement.tier.toUpperCase()}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (data.type === 'levelup' && data.levelInfo) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/50"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />

        {/* アニメーション背景 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        <div className="relative px-6 py-8 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <ArrowUp className="w-6 h-6 text-white" />
            <span className="text-lg font-bold text-white">レベルアップ！</span>
            <ArrowUp className="w-6 h-6 text-white" />
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.3 }}
            className="w-28 h-28 mx-auto mb-4 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="text-4xl mb-1">{data.levelInfo.icon}</div>
              <div className="text-3xl font-bold text-white">Lv.{data.levelInfo.level}</div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white mb-2"
          >
            {data.levelInfo.title}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 text-sm"
          >
            おめでとうございます！新しい称号を獲得しました
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return null;
}

export default function BadgePopup() {
  const { badgePopupData, closeBadgePopup } = useNotifications();

  // badgePopupDataの有無で表示を制御
  const isVisible = badgePopupData !== null;

  const handleClose = () => {
    closeBadgePopup();
  };

  return (
    <AnimatePresence>
      {isVisible && badgePopupData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
            <PopupContent data={badgePopupData} onClose={handleClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
