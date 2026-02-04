'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useMyReview, useCreateReview, reviewKeys } from '@/hooks/useReviews';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, CheckCircle, AlertCircle, MessageSquarePlus } from 'lucide-react';

export default function ReviewPrompt() {
  const { data: session, status: sessionStatus } = useSession();
  const { data: myReviewData, isLoading } = useMyReview();
  const { mutate: createReview, isPending } = useCreateReview();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // セッション読み込み中またはレビュー情報読み込み中はスキップ
    if (sessionStatus === 'loading' || isLoading) return;

    // 未ログインの場合はスキップ
    if (!session?.user) return;

    // 既にレビューを書いている場合はスキップ
    if (myReviewData?.hasReview) return;

    // レビュー未投稿なら表示
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [session, sessionStatus, myReviewData, isLoading]);

  // ユーザー名をセッションから初期化
  useEffect(() => {
    if (session?.user?.name && !userName) {
      setUserName(session.user.name);
    }
  }, [session, userName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('評価を選択してください');
      return;
    }

    createReview(
      { rating, title, content, userName },
      {
        onSuccess: () => {
          setIsSubmitted(true);
          // 自分のレビューのキャッシュを更新
          queryClient.invalidateQueries({ queryKey: reviewKeys.my() });
          setTimeout(() => {
            setIsOpen(false);
          }, 2000);
        },
        onError: (err) => {
          setError(err.message);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setIsOpen(false);
      setError(null);
    }
  };

  // 未ログイン、読み込み中、または既にレビュー済みの場合は何も表示しない
  if (sessionStatus === 'loading' || isLoading || !session?.user || myReviewData?.hasReview) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500">
              <button
                onClick={handleClose}
                disabled={isPending}
                className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex p-3 bg-white/20 rounded-2xl mb-3"
                >
                  <MessageSquarePlus className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-white mb-1">
                  MonoCollector はいかがですか？
                </h2>
                <p className="text-white/90 text-sm">
                  ご感想をお聞かせください
                </p>
              </div>
            </div>

            {/* コンテンツ */}
            <div className="p-6">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    ありがとうございます!
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    レビューを投稿しました
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* 評価 */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      評価 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-1 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-10 h-10 transition-colors ${
                              star <= (hoveredRating || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-zinc-300 dark:text-zinc-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 表示名 */}
                  <div>
                    <label
                      htmlFor="reviewUserName"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      表示名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="reviewUserName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="ニックネームを入力"
                      maxLength={50}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* タイトル */}
                  <div>
                    <label
                      htmlFor="reviewTitle"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="reviewTitle"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="レビューのタイトル"
                      maxLength={100}
                      minLength={2}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  {/* 本文 */}
                  <div>
                    <label
                      htmlFor="reviewContent"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      レビュー内容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="reviewContent"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="使ってみた感想を教えてください"
                      rows={3}
                      maxLength={1000}
                      minLength={10}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                    />
                    <p className="text-xs text-zinc-500 mt-1 text-right">
                      {content.length}/1000
                    </p>
                  </div>

                  {/* エラー表示 */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {/* 送信ボタン */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        送信中...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        レビューを投稿
                      </>
                    )}
                  </button>

                  {/* スキップボタン */}
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isPending}
                    className="w-full py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 text-sm transition-colors disabled:opacity-50"
                  >
                    今はスキップ
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
