import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// 現在のユーザーがレビューを書いているかどうかを確認
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { hasReview: false, review: null },
        { status: 200 }
      );
    }

    const review = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        rating: true,
        title: true,
        content: true,
        userName: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      hasReview: !!review,
      review,
    });
  } catch (error) {
    console.error('Failed to check user review:', error);
    return NextResponse.json(
      { error: 'レビューの確認に失敗しました' },
      { status: 500 }
    );
  }
}
