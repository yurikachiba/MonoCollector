'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, ExternalLink, Key, Trash2, Check } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey, removeStoredApiKey } from '@/lib/groq-vision';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

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
                  AIで自動読み取り機能を使うには、Groq APIキーが必要です。
                </p>

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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
