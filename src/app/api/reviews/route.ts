import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// 公開レビューを取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    const reviews = await prisma.review.findMany({
      where: {
        isPublic: true,
        ...(featured && { featured: true }),
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        rating: true,
        title: true,
        content: true,
        userName: true,
        userImage: true,
        featured: true,
        createdAt: true,
      },
    });

    // 統計情報を計算
    const stats = await prisma.review.aggregate({
      where: { isPublic: true },
      _avg: { rating: true },
      _count: { id: true },
    });

    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { isPublic: true },
      _count: { id: true },
    });

    return NextResponse.json({
      reviews,
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.id,
        ratingDistribution: ratingDistribution.reduce((acc, item) => {
          acc[item.rating] = item._count.id;
          return acc;
        }, {} as Record<number, number>),
      },
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { error: 'レビューの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 新しいレビューを投稿
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    const body = await request.json();
    const { rating, title, content, userName } = body;

    // バリデーション
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '評価は1〜5の範囲で入力してください' },
        { status: 400 }
      );
    }

    if (!title || title.length < 2 || title.length > 100) {
      return NextResponse.json(
        { error: 'タイトルは2〜100文字で入力してください' },
        { status: 400 }
      );
    }

    if (!content || content.length < 10 || content.length > 1000) {
      return NextResponse.json(
        { error: 'レビュー内容は10〜1000文字で入力してください' },
        { status: 400 }
      );
    }

    if (!userName || userName.length < 1 || userName.length > 50) {
      return NextResponse.json(
        { error: '表示名は1〜50文字で入力してください' },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating,
        title,
        content,
        userName,
        userImage: session?.user?.image || null,
        userId: session?.user?.id || null,
        isPublic: true,
        featured: false,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json(
      { error: 'レビューの投稿に失敗しました' },
      { status: 500 }
    );
  }
}
