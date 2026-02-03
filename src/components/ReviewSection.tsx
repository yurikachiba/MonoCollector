'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { useFeaturedReviews, Review, ReviewStats } from '@/hooks/useReviews';
import ReviewModal from './ReviewModal';

// 星評価表示コンポーネント
function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-zinc-300 dark:text-zinc-600'
          }`}
        />
      ))}
    </div>
  );
}

// 統計表示コンポーネント
function ReviewSummary({ stats }: { stats: ReviewStats }) {
  const { averageRating, totalReviews, ratingDistribution } = stats;
  const maxCount = Math.max(...Object.values(ratingDistribution), 1);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-12">
      {/* 平均評価 */}
      <div className="text-center">
        <div className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {averageRating.toFixed(1)}
        </div>
        <StarRating rating={Math.round(averageRating)} size="lg" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          {totalReviews}件のレビュー
        </p>
      </div>

      {/* 評価分布 */}
      <div className="w-full max-w-xs space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm text-zinc-600 dark:text-zinc-400 w-4">{rating}</span>
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: (5 - rating) * 0.1 }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                />
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 個別レビューカード
function ReviewCard({ review, index }: { review: Review; index: number }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
    >
      {/* 引用アイコン */}
      <Quote className="w-8 h-8 text-purple-400/30 mb-4" />

      {/* 評価 */}
      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={review.rating} size="sm" />
        {review.featured && (
          <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
            おすすめ
          </span>
        )}
      </div>

      {/* タイトル */}
      <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        {review.title}
      </h4>

      {/* 本文 */}
      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {review.content}
      </p>

      {/* ユーザー情報 */}
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-700">
        {review.userImage ? (
          <img
            src={review.userImage}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium">
            {review.userName.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
            {review.userName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatDate(review.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// サンプルレビューデータ（APIからデータが取得できない場合のフォールバック）
const sampleReviews: Review[] = [
  {
    id: '1',
    rating: 5,
    title: '思い出が蘇る素敵なアプリ',
    content: '日常の小さなモノたちが、こんなに大切な存在だったと気づかせてくれました。AIでアイコンになるのが楽しくて、毎日使っています。',
    userName: 'みゆき',
    userImage: null,
    featured: true,
    createdAt: '2024-12-15T10:30:00Z',
  },
  {
    id: '2',
    rating: 5,
    title: 'コレクションが増えるのが楽しい',
    content: 'バッジや実績システムがあるので、どんどん記録したくなります。暮らしの中のモノに目を向けるきっかけになりました。',
    userName: 'たける',
    userImage: null,
    featured: true,
    createdAt: '2024-12-10T14:20:00Z',
  },
  {
    id: '3',
    rating: 4,
    title: 'シンプルで使いやすい',
    content: '写真を撮るだけでOKなので、手軽に始められました。カテゴリ分けも自動でしてくれるので便利です。',
    userName: 'あやか',
    userImage: null,
    featured: true,
    createdAt: '2024-12-08T09:15:00Z',
  },
  {
    id: '4',
    rating: 5,
    title: '子供の思い出も残せる',
    content: '子供のおもちゃや作品を記録するのに使っています。成長とともに変わっていくコレクションを見返すのが楽しみです。',
    userName: 'ゆうこ',
    userImage: null,
    featured: true,
    createdAt: '2024-12-05T16:45:00Z',
  },
  {
    id: '5',
    rating: 5,
    title: 'デザインが美しい',
    content: 'アイコンに変換されたモノたちがギャラリーのように並ぶのが美しい。見ているだけで癒されます。',
    userName: 'けんた',
    userImage: null,
    featured: true,
    createdAt: '2024-12-01T11:00:00Z',
  },
  {
    id: '6',
    rating: 4,
    title: '断捨離の参考になる',
    content: '持っているモノを可視化することで、本当に必要なものが見えてきました。暮らしを見直すきっかけになっています。',
    userName: 'さとみ',
    userImage: null,
    featured: true,
    createdAt: '2024-11-28T13:30:00Z',
  },
];

const sampleStats: ReviewStats = {
  averageRating: 4.8,
  totalReviews: 150,
  ratingDistribution: {
    5: 120,
    4: 25,
    3: 3,
    2: 1,
    1: 1,
  },
};

export default function ReviewSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isLoading } = useFeaturedReviews(12);

  // APIデータまたはサンプルデータを使用
  const reviews = data?.reviews?.length ? data.reviews : sampleReviews;
  const stats = data?.stats?.totalReviews ? data.stats : sampleStats;

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50">
      <div className="max-w-6xl mx-auto">
        {/* セクションヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-full mb-4 border border-yellow-200 dark:border-yellow-800">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              ユーザーレビュー
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            みんなの声
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            モノコレクターを使っているユーザーの感想
          </p>
        </motion.div>

        {/* 統計サマリー */}
        {!isLoading && <ReviewSummary stats={stats} />}

        {/* レビューグリッド */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {currentReviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>

          {/* ナビゲーション */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={prevPage}
                className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                aria-label="前のレビュー"
              >
                <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentPage
                        ? 'bg-purple-500'
                        : 'bg-zinc-300 dark:bg-zinc-600'
                    }`}
                    aria-label={`ページ ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextPage}
                className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                aria-label="次のレビュー"
              >
                <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
          )}
        </div>

        {/* レビュー投稿ボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            レビューを書く
          </button>
        </motion.div>
      </div>

      {/* レビュー投稿モーダル */}
      <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
