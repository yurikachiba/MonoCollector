import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST /api/auth/link-guest - ゲストユーザーのデータを現在のアカウントに引き継ぐ
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ゲストユーザーはこのAPIを使えない（Googleアカウントでログインしている必要がある）
    if (session.user.isGuest) {
      return NextResponse.json(
        { error: 'ゲストユーザーはデータを引き継げません。Googleアカウントでログインしてください。' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { guestId } = body;

    if (!guestId || typeof guestId !== 'string') {
      return NextResponse.json(
        { error: 'ゲストIDが必要です' },
        { status: 400 }
      );
    }

    // ゲストユーザーが存在するか確認
    const guestUser = await prisma.user.findUnique({
      where: { id: guestId, isGuest: true },
      include: { items: true },
    });

    if (!guestUser) {
      return NextResponse.json(
        { error: '指定されたゲストユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // ゲストユーザーのアイテムを現在のユーザーに移行
    const itemCount = guestUser.items.length;

    if (itemCount > 0) {
      await prisma.item.updateMany({
        where: { userId: guestId },
        data: { userId: session.user.id },
      });
      console.log(`[LinkGuest] Migrated ${itemCount} items from guest ${guestId} to user ${session.user.id}`);
    }

    // ゲストユーザーを削除（アイテムは既に移行済みなのでCascadeで削除されない）
    await prisma.user.delete({
      where: { id: guestId },
    });
    console.log(`[LinkGuest] Deleted guest user ${guestId}`);

    return NextResponse.json({
      success: true,
      message: `${itemCount}個のアイテムを引き継ぎました`,
      migratedItems: itemCount,
    });
  } catch (error) {
    console.error('[LinkGuest] Failed to link guest account:', error);
    return NextResponse.json(
      { error: 'データの引き継ぎに失敗しました' },
      { status: 500 }
    );
  }
}

// GET /api/auth/link-guest - ゲストユーザーのデータ数を確認
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const guestId = url.searchParams.get('guestId');

    if (!guestId) {
      return NextResponse.json(
        { error: 'ゲストIDが必要です' },
        { status: 400 }
      );
    }

    // ゲストユーザーが存在するか確認
    const guestUser = await prisma.user.findUnique({
      where: { id: guestId, isGuest: true },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    if (!guestUser) {
      return NextResponse.json({
        exists: false,
        itemCount: 0,
      });
    }

    return NextResponse.json({
      exists: true,
      guestName: guestUser.name,
      itemCount: guestUser._count.items,
      createdAt: guestUser.createdAt,
    });
  } catch (error) {
    console.error('[LinkGuest] Failed to check guest account:', error);
    return NextResponse.json(
      { error: 'ゲストデータの確認に失敗しました' },
      { status: 500 }
    );
  }
}
