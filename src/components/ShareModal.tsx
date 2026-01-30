'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { Item, Category } from '@/lib/db';
import GlassCard from './GlassCard';
import clsx from 'clsx';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  category?: Category;
}

export default function ShareModal({ isOpen, onClose, item, category }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const shareText = `${item.icon} ${item.name}
カテゴリ: ${category?.name || '未分類'}
場所: ${item.location || '未設定'}
数量: ${item.quantity}個
${item.tags.length > 0 ? `タグ: ${item.tags.join(', ')}` : ''}
${item.notes ? `メモ: ${item.notes}` : ''}

モノコレクターで管理中`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLineShare = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://line.me/R/msg/text/?${encodedText}`, '_blank');
  };

  const handleTwitterShare = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <GlassCard className="!bg-white/90 dark:!bg-gray-900/90">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  共有する
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category?.color}20` }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {category?.name} • {item.location || '場所未設定'}
                    </p>
                  </div>
                </div>
                <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans">
                  {shareText}
                </pre>
              </div>

              {/* Share Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* LINE */}
                <button
                  onClick={handleLineShare}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#00B900]/10 hover:bg-[#00B900]/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#00B900] flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[#00B900]">LINE</span>
                </button>

                {/* Twitter/X */}
                <button
                  onClick={handleTwitterShare}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-black dark:bg-white flex items-center justify-center">
                    <span className="text-white dark:text-black font-bold text-lg">𝕏</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    X
                  </span>
                </button>

                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className={clsx(
                    'flex flex-col items-center gap-2 p-4 rounded-xl transition-colors',
                    copied
                      ? 'bg-green-500/10'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  <div
                    className={clsx(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                      copied ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'
                    )}
                  >
                    {copied ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Copy className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <span
                    className={clsx(
                      'text-sm font-medium',
                      copied ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {copied ? 'コピー完了' : 'コピー'}
                  </span>
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
