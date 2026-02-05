'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Sparkles, ArrowRight } from 'lucide-react';

// ============================================
// 型定義
// ============================================

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: 'fab';
  position: 'top' | 'center';
}

interface OnboardingState {
  isActive: boolean;
  currentStep: number;
  hasCompleted: boolean;
  hasShownHints: boolean;
}

interface OnboardingActions {
  start: () => void;
  nextStep: () => void;
  complete: () => void;
  skip: () => void;
  dismissHints: () => void;
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
  },
  {
    id: 'fab',
    title: 'まずはここをタップ',
    description: '「＋」ボタンで新しいアイテムを追加できます。',
    target: 'fab',
    position: 'top',
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

      // Actions
      start: () => set({ isActive: true, currentStep: 0 }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < STEPS.length - 1) {
          set({ currentStep: currentStep + 1 });
        } else {
          get().complete();
        }
      },

      complete: () => set({ isActive: false, hasCompleted: true }),

      skip: () => set({ isActive: false, hasCompleted: true }),

      dismissHints: () => set({ hasShownHints: true }),
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
      <div
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full"
        style={{
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          background: 'transparent',
        }}
      />
      <motion.div
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full border-4 border-white pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
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
}: {
  step: OnboardingStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  const isWelcome = step.id === 'welcome';
  const isFabStep = step.target === 'fab';

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
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
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
            {isWelcome ? (
              <Sparkles className="w-8 h-8 text-white" />
            ) : (
              <Camera className="w-8 h-8 text-white" />
            )}
          </motion.div>

          <h2 className="text-xl font-bold text-white">{step.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {step.description}
          </p>

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
          <div className="flex gap-3 mt-6">
            <button
              onClick={onSkip}
              className="flex-1 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors"
            >
              スキップ
            </button>
            {isWelcome && (
              <button
                onClick={onNext}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all"
              >
                はじめる
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
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
        <div className="absolute inset-0 bg-black/60" />
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
