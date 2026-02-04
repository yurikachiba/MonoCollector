'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useMyReview, reviewKeys } from '@/hooks/useReviews';
import { useQueryClient } from '@tanstack/react-query';
import ReviewModal from '@/components/ReviewModal';

export default function ReviewPrompt() {
  const { data: session, status: sessionStatus } = useSession();
  const { data: myReviewData, isLoading } = useMyReview();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

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

  const handleClose = () => {
    setIsOpen(false);
    // 投稿後のキャッシュ更新
    queryClient.invalidateQueries({ queryKey: reviewKeys.my() });
  };

  // 未ログイン、読み込み中、または既にレビュー済みの場合は何も表示しない
  if (sessionStatus === 'loading' || isLoading || !session?.user || myReviewData?.hasReview) {
    return null;
  }

  return <ReviewModal isOpen={isOpen} onClose={handleClose} />;
}
