'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, BellRing, Sparkles, Clock, Trophy, Calendar } from 'lucide-react';
import {
  isNotificationSupported,
  requestNotificationPermission,
  getNotificationPermission,
} from '@/lib/notifications';
import { useNotifications } from '@/contexts/NotificationContext';

const BENEFITS = [
  {
    icon: Clock,
    title: '思い出リマインダー',
    description: '過去に記録したモノを振り返るタイミングをお知らせ',
  },
  {
    icon: Trophy,
    title: '実績・レベルアップ通知',
    description: 'バッジ獲得やレベルアップを見逃さない',
  },
  {
    icon: Calendar,
    title: '連続記録リマインダー',
    description: 'ストリークが途切れる前にお知らせ',
  },
];

export default function PushNotificationPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const { updateSettings } = useNotifications();

  useEffect(() => {
    // 通知がサポートされていない場合はスキップ
    if (!isNotificationSupported()) return;

    // 既に通知が許可されている場合はスキップ
    if (getNotificationPermission() === 'granted') return;

    // 通知が明示的に拒否されている場合もスキップ
    if (getNotificationPermission() === 'denied') return;

    // 既にこのセッションで表示済みの場合はスキップ
    if (sessionStorage.getItem('pushNotificationPromptShown') === 'true') return;

    // 永久に非表示にした場合はスキップ
    if (localStorage.getItem('pushNotificationPromptDismissed') === 'true') return;

    // ページロード後に少し遅延してから表示
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('pushNotificationPromptShown', 'true');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDismissForever = () => {
    setIsOpen(false);
    localStorage.setItem('pushNotificationPromptDismissed', 'true');
  };

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const permission = await requestNotificationPermission();

      if (permission === 'granted') {
        // 通知設定を有効にする（Context経由で更新）
        updateSettings({ enabled: true });
        setIsOpen(false);
      } else {
        // 拒否された場合は閉じる
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
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
            <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500">
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
                  <BellRing className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  通知をオンにしよう
                </h2>
                <p className="text-white/90">
                  大切なお知らせを
                  <br />
                  <span className="font-semibold">見逃さずに受け取れます</span>
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
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <benefit.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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

            {/* Actions */}
            <div className="px-6 pt-4 pb-6 space-y-3">
              <button
                onClick={handleEnableNotifications}
                disabled={isRequesting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-70"
              >
                {isRequesting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    <span>通知をオンにする</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                あとで設定する
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
