'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Sparkles, ArrowRight } from 'lucide-react';

// オンボーディングの状態管理
const STORAGE_KEY = 'onboardingCompleted';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: 'fab' | 'upload' | 'ai-analyze' | 'save';
  position?: 'top' | 'bottom' | 'center';
}

const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'モノコレへようこそ！',
    description: '捨てられないモノを写真とアイコンで残せるアプリです。\n一緒に最初のアイテムを登録してみましょう。',
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

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: number;
  currentStepId: string | null;
  nextStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  startOnboarding: () => void;
  isStepActive: (stepId: string) => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

// SSR対応のlocalStorage取得
function getStorageValue(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // 初回訪問の検出
  useEffect(() => {
    const completed = getStorageValue();
    if (!completed) {
      // 少し遅延させて表示（ページ読み込み完了後）
      const timer = setTimeout(() => {
        setIsOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const skipOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const completeOnboarding = () => {
    setIsOnboarding(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const startOnboarding = () => {
    setCurrentStep(0);
    setIsOnboarding(true);
  };

  const isStepActive = (stepId: string) => {
    return isOnboarding && STEPS[currentStep]?.id === stepId;
  };

  const currentStepId = isOnboarding ? STEPS[currentStep]?.id ?? null : null;

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        currentStepId,
        nextStep,
        skipOnboarding,
        completeOnboarding,
        startOnboarding,
        isStepActive,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

// メインのオンボーディングオーバーレイ
export default function OnboardingTutorial() {
  const { isOnboarding, currentStep, nextStep, skipOnboarding } = useOnboarding();

  const step = STEPS[currentStep];
  const isWelcome = step?.id === 'welcome';
  const isFabStep = step?.target === 'fab';

  // ウェルカム画面とFABハイライト以外はオーバーレイを表示しない
  if (!isOnboarding || (!isWelcome && !isFabStep)) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOnboarding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100]"
        >
          {/* オーバーレイ背景 */}
          <div className="absolute inset-0 bg-black/60" />

          {/* FABのハイライト - FABステップの時だけ穴を開ける */}
          {isFabStep && (
            <>
              {/* FABボタンの位置に穴を開ける（右下固定） */}
              <div
                className="absolute bottom-6 right-6 w-16 h-16 rounded-full"
                style={{
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
                  background: 'transparent',
                }}
              />
              {/* パルスアニメーション */}
              <motion.div
                className="absolute bottom-6 right-6 w-16 h-16 rounded-full border-4 border-white pointer-events-none"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </>
          )}

          {/* ステップ内容 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className={`absolute left-4 right-4 ${
              isFabStep ? 'bottom-28' : 'top-1/2 -translate-y-1/2'
            }`}
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto">
              {/* ヘッダー */}
              <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <button
                  onClick={skipOnboarding}
                  className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* アイコン */}
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

              {/* コンテンツ */}
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {step.description}
                </p>

                {/* プログレスインジケーター */}
                <div className="flex items-center justify-center gap-1.5 mt-6">
                  {STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-purple-500 w-6'
                          : index < currentStep
                          ? 'bg-purple-300'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                {/* ボタン */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={skipOnboarding}
                    className="flex-1 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors"
                  >
                    スキップ
                  </button>
                  {isWelcome && (
                    <button
                      onClick={nextStep}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 初回ユーザー向けヒントバナー（AddItemModal内で使用）
const FIRST_TIME_HINTS_KEY = 'firstTimeHintsShown';

function getFirstTimeHintsShown(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(FIRST_TIME_HINTS_KEY) === 'true';
}

export function FirstTimeHintBanner() {
  const [isVisible, setIsVisible] = useState(() => !getFirstTimeHintsShown());

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(FIRST_TIME_HINTS_KEY, 'true');
  };

  if (!isVisible) return null;

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
          onClick={handleDismiss}
          className="p-1 text-indigo-400 hover:text-indigo-600 dark:text-indigo-500 dark:hover:text-indigo-300 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
