import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sendTestNotification } from '@/lib/push-notify-on-event';

// POST /api/notifications/test - テスト通知を送信
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sendTestNotification(session.user.id);

    if (result.total === 0) {
      return NextResponse.json(
        { error: 'プッシュ通知が登録されていません。設定から通知をオンにしてください。' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${result.sent}/${result.total}件の端末にテスト通知を送信しました`,
      ...result,
    });
  } catch (error) {
    console.error('Failed to send test notification:', error);
    return NextResponse.json(
      { error: 'テスト通知の送信に失敗しました' },
      { status: 500 }
    );
  }
}
