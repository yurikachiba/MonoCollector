import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  userName: string;
  userImage: string | null;
  featured: boolean;
  createdAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
}

export interface CreateReviewInput {
  rating: number;
  title: string;
  content: string;
  userName: string;
}

async function fetchReviews(featured?: boolean, limit?: number): Promise<ReviewsResponse> {
  const params = new URLSearchParams();
  if (featured) params.set('featured', 'true');
  if (limit) params.set('limit', limit.toString());

  const response = await fetch(`/api/reviews?${params.toString()}`);
  if (!response.ok) {
    throw new Error('レビューの取得に失敗しました');
  }
  return response.json();
}

async function createReview(input: CreateReviewInput): Promise<Review> {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'レビューの投稿に失敗しました');
  }
  return response.json();
}

export interface MyReviewResponse {
  hasReview: boolean;
  review: Review | null;
}

async function fetchMyReview(): Promise<MyReviewResponse> {
  const response = await fetch('/api/reviews/my');
  if (!response.ok) {
    throw new Error('自分のレビューの取得に失敗しました');
  }
  return response.json();
}

export const reviewKeys = {
  all: ['reviews'] as const,
  list: (featured?: boolean, limit?: number) => [...reviewKeys.all, 'list', { featured, limit }] as const,
  featured: () => [...reviewKeys.all, 'featured'] as const,
  my: () => [...reviewKeys.all, 'my'] as const,
};

export function useReviews(featured?: boolean, limit?: number) {
  return useQuery({
    queryKey: reviewKeys.list(featured, limit),
    queryFn: () => fetchReviews(featured, limit),
  });
}

export function useFeaturedReviews(limit: number = 6) {
  return useQuery({
    queryKey: reviewKeys.featured(),
    queryFn: () => fetchReviews(true, limit),
  });
}

export function useMyReview() {
  return useQuery({
    queryKey: reviewKeys.my(),
    queryFn: fetchMyReview,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}
