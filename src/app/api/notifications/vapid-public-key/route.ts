import { NextResponse } from 'next/server';
import { getVapidPublicKey } from '@/lib/web-push';

// GET /api/notifications/vapid-public-key
// VAPID公開鍵を返す（クライアントがPushサブスクリプションに使用）
export async function GET() {
  try {
    const publicKey = await getVapidPublicKey();

    if (!publicKey) {
      return NextResponse.json(
        { error: 'VAPID keys not available' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { publicKey },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400', // 24時間キャッシュ
        },
      }
    );
  } catch (error) {
    console.error('Failed to get VAPID public key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
