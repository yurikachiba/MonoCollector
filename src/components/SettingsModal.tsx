'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, ExternalLink, Key, Trash2, Check, BarChart3, Bell, BellOff, Clock, Sparkles, Flame, Calendar, Heart } from 'lucide-react';
import Link from 'next/link';
import { getStoredApiKey, setStoredApiKey, removeStoredApiKey } from '@/lib/groq-vision';
import { useNotifications } from '@/contexts/NotificationContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notificationSaved, setNotificationSaved] = useState(false);

  const {
    settings: notificationSettings,
    updateSettings: updateNotificationSettings,
    permission,
    isSupported,
    requestPermission,
  } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      queueMicrotask(() => {
        const storedKey = getStoredApiKey();
        if (storedKey) {
          setApiKey(storedKey);
        }
      });
    }
  }, [isOpen]);

  const handleEnableNotifications = async () => {
    if (permission !== 'granted') {
      const result = await requestPermission();
      if (result === 'granted') {
        updateNotificationSettings({ enabled: true });
        setNotificationSaved(true);
        setTimeout(() => setNotificationSaved(false), 2000);
      }
    } else {
      updateNotificationSettings({ enabled: !notificationSettings.enabled });
      setNotificationSaved(true);
      setTimeout(() => setNotificationSaved(false), 2000);
    }
  };

  const handleToggleNotificationType = (key: keyof typeof notificationSettings) => {
    updateNotificationSettings({ [key]: !notificationSettings[key] });
  };

  const handleTimeChange = (time: string) => {
    updateNotificationSettings({ reminderTime: time });
  };

  const handleSave = () => {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = () => {
    removeStoredApiKey();
    setApiKey('');
  };

  const handleClose = () => {
    setShowApiKey(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-hidden"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                設定
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* API Key Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Groq API キー
                  </h3>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  写真から自動でアイテム情報を読み取るAI機能を使うには、Groq APIキーが必要です。
                </p>

                <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                  <p className="font-medium text-gray-700 dark:text-gray-300">取得方法（無料・1分で完了）:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>下のリンクからGroqのサイトにアクセス</li>
                    <li>Googleアカウントなどで無料登録</li>
                    <li>「Create API Key」をクリック</li>
                    <li>作成されたキー（gsk_...）をコピーして下に貼り付け</li>
                  </ol>
                </div>

                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="gsk_xxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-800
                             border border-gray-200 dark:border-gray-700 rounded-xl
                             text-gray-700 dark:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
                             transition-all font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5
                             text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                             transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={!apiKey.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                             bg-black dark:bg-white
                             text-white dark:text-black font-medium rounded-xl
                             hover:bg-gray-800 dark:hover:bg-gray-100
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all"
                  >
                    {saved ? (
                      <>
                        <Check className="w-4 h-4" />
                        保存しました
                      </>
                    ) : (
                      '保存'
                    )}
                  </button>
                  {apiKey && (
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                               rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Groq APIキーを取得する（無料）
                </a>
              </div>

              {/* Notification Settings Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    プッシュ通知
                  </h3>
                </div>

                {!isSupported ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    このブラウザはプッシュ通知に対応していません
                  </p>
                ) : (
                  <>
                    {/* 通知を有効化/無効化 */}
                    <button
                      onClick={handleEnableNotifications}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                        notificationSettings.enabled
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {notificationSettings.enabled ? (
                          <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <BellOff className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {notificationSettings.enabled ? '通知オン' : '通知オフ'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {permission === 'denied'
                              ? 'ブラウザの設定で許可してください'
                              : permission === 'granted'
                              ? '毎日21:00に通知をお届けします'
                              : 'タップして許可（21:00に送信）'}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          notificationSettings.enabled
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                            notificationSettings.enabled ? 'left-7' : 'left-1'
                          }`}
                        />
                      </div>
                    </button>

                    {notificationSettings.enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        {/* 通知タイプの設定 */}
                        <div className="space-y-2">
                          {/* 思い出リマインダー */}
                          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-indigo-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">思い出リマインダー</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings.memoryReminder}
                              onChange={() => handleToggleNotificationType('memoryReminder')}
                              className="w-4 h-4 accent-indigo-500"
                            />
                          </label>

                          {/* ストリーク維持 */}
                          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Flame className="w-4 h-4 text-orange-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">連続記録リマインダー</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings.streakReminder}
                              onChange={() => handleToggleNotificationType('streakReminder')}
                              className="w-4 h-4 accent-orange-500"
                            />
                          </label>

                          {/* 実績・レベルアップ */}
                          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">実績・レベルアップ</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings.achievementAlert}
                              onChange={() => handleToggleNotificationType('achievementAlert')}
                              className="w-4 h-4 accent-yellow-500"
                            />
                          </label>

                          {/* 週次サマリー */}
                          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">週次サマリー</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings.weeklySummary}
                              onChange={() => handleToggleNotificationType('weeklySummary')}
                              className="w-4 h-4 accent-blue-500"
                            />
                          </label>

                          {/* モチベーション */}
                          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-pink-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">モチベーション通知</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={notificationSettings.motivationReminder}
                              onChange={() => handleToggleNotificationType('motivationReminder')}
                              className="w-4 h-4 accent-pink-500"
                            />
                          </label>
                        </div>

                        {/* リマインダー時間は21:00に固定されているため、設定UIを非表示にしました */}
                      </motion.div>
                    )}

                    {notificationSaved && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        設定を保存しました
                      </motion.p>
                    )}
                  </>
                )}
              </div>

              {/* Admin Dashboard Link */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href="/admin"
                  onClick={handleClose}
                  className="flex items-center gap-3 p-3 rounded-xl
                           bg-gray-50 dark:bg-gray-800/50
                           hover:bg-gray-100 dark:hover:bg-gray-800
                           transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      管理ダッシュボード
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      統計情報を確認する
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
