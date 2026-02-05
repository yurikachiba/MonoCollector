'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Sparkles, ArrowRight, Key, PartyPopper, ExternalLink } from 'lucide-react';

// ============================================
// 型定義
// ============================================

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: 'fab' | 'settings';
  position: 'top' | 'center' | 'bottom';
  icon?: 'sparkles' | 'camera' | 'key' | 'party';
  action?: 'next' | 'settings' | 'groq';
}

interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  hasCompleted: boolean;
  hasShownHints: boolean;
  showCelebration: boolean;
  waitingForRegistration: boolean;
}

interface OnboardingActions {
  start: () => void;
  nextStep: () => void;
  complete: () => void;
  skip: () => void;
  dismissHints: () => void;
  showCompleteCelebration: () => void;
  dismissCelebration: () => void;
  setWaitingForRegistration: (waiting: boolean) => void;
}

// ============================================
// 定数
// ============================================

const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'モノコレへようこそ！',
    description:
      '捨てられないモノを写真とアイコンで残せるアプリです。\n一緒に最初のアイテムを登録してみましょう。',
    position: 'center',
    icon: 'sparkles',
    action: 'next',
  },
  {
    id: 'groq',
    title: 'AI機能を使おう',
    description:
      '写真からアイテム情報を自動入力したり、\nかわいいAIアイコンを生成できます。\n\n無料のGroq APIキーを取得すると使えます。',
    position: 'center',
    icon: 'key',
    action: 'groq',
  },
  {
    id: 'fab',
    title: 'ここをタップ！',
    description: '「＋」ボタンで新しいアイテムを追加できます。',
    target: 'fab',
    position: 'top',
    icon: 'camera',
  },
];

// ============================================
// Zustand Store
// ============================================

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      // State
      isActive: false,
      currentStep: 0,
      hasCompleted: false,
      hasShownHints: false,
      showCelebration: false,
      waitingForRegistration: false,

      // Actions
      start: () => set({ isActive: true, currentStep: 0 }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < STEPS.length - 1) {
          set({ currentStep: currentStep + 1 });
        } else {
          // FABステップの後は登録待ち状態にする
          set({ isActive: false, waitingForRegistration: true });
        }
      },

      complete: () => set({ isActive: false, hasCompleted: true, waitingForRegistration: false }),

      skip: () => set({ isActive: false, hasCompleted: true, waitingForRegistration: false }),

      dismissHints: () => set({ hasShownHints: true }),

      showCompleteCelebration: () => set({ showCelebration: true, waitingForRegistration: false }),

      dismissCelebration: () => set({ showCelebration: false, hasCompleted: true }),

      setWaitingForRegistration: (waiting: boolean) => set({ waitingForRegistration: waiting }),
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        hasCompleted: state.hasCompleted,
        hasShownHints: state.hasShownHints,
      }),
    }
  )
);

// ============================================
// Hooks
// ============================================

/** オンボーディングの自動開始（初回訪問時） */
export function useOnboardingAutoStart() {
  const { isActive, hasCompleted, start } = useOnboardingStore();

  useEffect(() => {
    if (hasCompleted || isActive) return;

    const timer = setTimeout(start, 1000);
    return () => clearTimeout(timer);
  }, [hasCompleted, isActive, start]);
}

/** 現在のステップ情報を取得 */
export function useCurrentStep() {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  return STEPS[currentStep] ?? null;
}

// ============================================
// Components
// ============================================

/** FABハイライト */
function FabHighlight() {
  return (
    <>
      {/* 穴あきオーバーレイ - 円の中は透明なまま */}
      <div
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full z-[101]"
        style={{
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)',
        }}
      />
      {/* 円の内側を明るく見せるための白い背景 */}
      <div
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full z-[100] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
      {/* アニメーション付きの白い枠線 */}
      <motion.div
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full border-4 border-white pointer-events-none z-[102]"
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </>
  );
}

/** ステップカード */
function StepCard({
  step,
  currentStep,
  totalSteps,
  onNext,
  onSkip,
  onOpenSettings,
}: {
  step: OnboardingStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
  onOpenSettings?: () => void;
}) {
  const isWelcome = step.id === 'welcome';
  const isGroq = step.id === 'groq';
  const isFabStep = step.target === 'fab';

  const getIcon = () => {
    switch (step.icon) {
      case 'key':
        return <Key className="w-8 h-8 text-white" />;
      case 'camera':
        return <Camera className="w-8 h-8 text-white" />;
      case 'party':
        return <PartyPopper className="w-8 h-8 text-white" />;
      default:
        return <Sparkles className="w-8 h-8 text-white" />;
    }
  };

  const getGradient = () => {
    if (isGroq) return 'from-amber-500 via-orange-500 to-red-500';
    return 'from-indigo-500 via-purple-500 to-pink-500';
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className={`absolute left-4 right-4 ${
        isFabStep ? 'bottom-28' : 'top-1/2 -translate-y-1/2'
      }`}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto">
        {/* Header */}
        <div className={`relative px-6 pt-6 pb-4 bg-gradient-to-r ${getGradient()}`}>
          <button
            onClick={onSkip}
            className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex p-3 bg-white/20 rounded-2xl mb-3 backdrop-blur-sm"
          >
            {getIcon()}
          </motion.div>

          <h2 className="text-xl font-bold text-white">{step.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {step.description}
          </p>

          {/* Groqステップの追加情報 */}
          {isGroq && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                あとで設定画面⚙️からも登録できます
              </p>
            </div>
          )}

          {/* Progress */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-colors ${
                  i === currentStep
                    ? 'bg-purple-500 w-6'
                    : i < currentStep
                      ? 'bg-purple-300 w-2'
                      : 'bg-gray-200 dark:bg-gray-700 w-2'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            {isWelcome && (
              <button
                onClick={onNext}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all"
              >
                はじめる
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {isGroq && (
              <>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  <Key className="w-4 h-4" />
                  Groqキーを取得（無料）
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={onNext}
                  className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  あとで設定する
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
            {!isWelcome && !isGroq && (
              <button
                onClick={onSkip}
                className="w-full py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors"
              >
                スキップ
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** 登録完了の「わーい」画面 */
export function OnboardingCelebration() {
  const { showCelebration, dismissCelebration } = useOnboardingStore();

  if (!showCelebration) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={dismissCelebration}
      >
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
              className="inline-flex p-4 bg-white/20 rounded-full mb-4 backdrop-blur-sm"
            >
              <PartyPopper className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white"
            >
              わーい！
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 mt-2"
            >
              最初のアイテムを登録しました！
            </motion.p>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              これからたくさんの思い出を
              <br />
              モノコレに残していきましょう
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={dismissCelebration}
              className="mt-6 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              はじめよう！
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** メインのオンボーディングオーバーレイ */
export default function OnboardingTutorial() {
  const { isActive, currentStep, nextStep, skip } = useOnboardingStore();
  const step = STEPS[currentStep];

  useOnboardingAutoStart();

  if (!isActive || !step) return null;

  const isFabStep = step.target === 'fab';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
      >
        {!isFabStep && <div className="absolute inset-0 bg-black/60" />}
        {isFabStep && <FabHighlight />}
        <StepCard
          step={step}
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onNext={nextStep}
          onSkip={skip}
        />
      </motion.div>
    </AnimatePresence>
  );
}

/** 初回ユーザー向けヒントバナー */
export function FirstTimeHintBanner() {
  const { hasShownHints, dismissHints } = useOnboardingStore();

  if (hasShownHints) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg shrink-0">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100 mb-1">
            はじめての登録ですね！
          </p>
          <ul className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
            <li className="flex items-center gap-1.5">
              <Camera className="w-3 h-3" />
              写真を撮影 or アルバムから選択
            </li>
            <li className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AIがオリジナルアイコンを自動生成
            </li>
            <li className="flex items-center gap-1.5">
              <ArrowRight className="w-3 h-3" />
              「追加」をタップして保存
            </li>
          </ul>
        </div>

        <button
          onClick={dismissHints}
          className="p-1 text-indigo-400 hover:text-indigo-600 dark:text-indigo-500 dark:hover:text-indigo-300 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
