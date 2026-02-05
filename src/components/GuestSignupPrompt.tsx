'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  X,
  Shield,
  Cloud,
  Smartphone,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { useOnboardingStore } from './OnboardingTutorial';

const BENEFITS = [
  {
    icon: Cloud,
    title: 'データを永久に保存',
    description: 'クラウドに安全に保存。端末が変わっても安心',
  },
  {
    icon: Smartphone,
    title: 'どこからでもアクセス',
    description: '複数デバイスで同期。いつでもコレクションを確認',
  },
  {
    icon: Shield,
    title: 'セキュアな管理',
    description: 'Googleアカウントで安全にログイン',
  },
];

export default function GuestSignupPrompt() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // オンボーディング中は非表示
  const { isActive: isOnboarding, waitingForRegistration } = useOnboardingStore();

  // TanStack Queryでアイテム取得
  const { data: items = [] } = useItems();
  const itemCount = items.length;

  useEffect(() => {
    // ゲストユーザーでない場合はスキップ
    if (status === 'loading') return;
    if (!session?.user?.isGuest) return;

    // 既に表示済みの場合はスキップ（1日1回まで）
    const lastShown = localStorage.getItem('guestSignupPromptLastShown');
    const today = new Date().toDateString();
    if (lastShown === today) return;

    // 永久に非表示にした場合はスキップ
    if (localStorage.getItem('guestSignupPromptDismissed') === 'true') return;

    // 3件以上登録したら表示
    if (itemCount >= 3) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // ページロード後3秒で表示
      return () => clearTimeout(timer);
    }
  }, [session, status, itemCount]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('guestSignupPromptLastShown', new Date().toDateString());
  };

  const handleDismissForever = () => {
    setIsOpen(false);
    localStorage.setItem('guestSignupPromptDismissed', 'true');
  };

  const handleSignup = async () => {
    setIsSigningIn(true);
    try {
      // ゲストセッションをサインアウトしてからGoogleログイン
      await signOut({ redirect: false });
      await signIn('google', { callbackUrl: '/collection' });
    } catch (error) {
      console.error('Sign in failed:', error);
      setIsSigningIn(false);
    }
  };

  // オンボーディング中は非表示
  if (isOnboarding || waitingForRegistration) {
    return null;
  }

  if (status === 'loading' || !session?.user?.isGuest) {
    return null;
  }

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
            <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
              <button
                onClick={handleClose}
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
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {itemCount}件のモノを登録中!
                </h2>
                <p className="text-white/90">
                  Googleアカウントで登録すると
                  <br />
                  <span className="font-semibold">大切なコレクションを永久に保存</span>できます
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="px-6 py-6 space-y-4">
              {BENEFITS.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <benefit.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Guest data migration note */}
            <div className="mx-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-amber-800 dark:text-amber-300">
                  今のデータはそのまま引き継がれます
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pt-4 pb-6 space-y-3">
              <button
                onClick={handleSignup}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-70"
              >
                {isSigningIn ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Googleで登録（無料）</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                あとで登録する
              </button>

              <button
                onClick={handleDismissForever}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                この提案を表示しない
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
