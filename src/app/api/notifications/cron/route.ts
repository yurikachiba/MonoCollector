import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPushNotification, isWebPushConfigured } from '@/lib/web-push';

// Cron認証（Vercel Cron or CRON_SECRET header）
function verifyCronAuth(request: NextRequest): boolean {
  // Vercel Cron Jobs は CRON_SECRET を Authorization ヘッダーで送る
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true;
  }

  // カスタムヘッダーでも認証可能
  const cronSecret = request.headers.get('x-cron-secret');
  if (cronSecret && cronSecret === process.env.CRON_SECRET) {
    return true;
  }

  // CRON_SECRET が未設定の場合はVercel Cronのみ許可
  if (!process.env.CRON_SECRET) {
    // Vercel Cron Jobsからの呼び出しかチェック
    return request.headers.get('user-agent')?.includes('vercel-cron') ?? false;
  }

  return false;
}

// ストリーク計算
function calculateStreak(items: { createdAt: Date }[]): number {
  const today = new Date();
  let streak = 0;
  const sortedItems = [...items].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toDateString();

    const hasItem = sortedItems.some(
      (item) => item.createdAt.toDateString() === dateStr
    );

    if (hasItem) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

// POST /api/notifications/cron - 定期通知の送信
export async function POST(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await isWebPushConfigured())) {
    return NextResponse.json(
      { error: 'Web Push not configured' },
      { status: 503 }
    );
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const isSunday = today.getDay() === 0;

  try {
    // 全サブスクリプションを取得（ユーザーのアイテム情報付き）
    const subscriptions = await prisma.pushSubscription.findMany({
      include: {
        user: {
          include: {
            items: {
              select: {
                id: true,
                name: true,
                createdAt: true,
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    let sent = 0;
    let skipped = 0;
    let failed = 0;
    const expiredEndpoints: string[] = [];

    for (const sub of subscriptions) {
      // 今日既に通知済みならスキップ
      if (sub.lastNotifiedDate === todayStr) {
        skipped++;
        continue;
      }

      const items = sub.user.items;
      if (items.length === 0) {
        skipped++;
        continue;
      }

      const streak = calculateStreak(items);
      const hasAddedToday = items.some(
        (item) => item.createdAt.toDateString() === today.toDateString()
      );

      // 最後にアイテムを追加してからの日数
      const lastItemDate = items[0].createdAt;
      const daysSinceLastItem = Math.floor(
        (today.getTime() - lastItemDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      let notification = null;

      // 優先度順に通知を選択（1日1通知）

      // 1. ストリークリマインダー
      if (sub.streakReminder && streak > 0 && !hasAddedToday) {
        notification = {
          title: '連続記録が途切れそう！',
          body: `現在${streak}日連続！今日もモノを記録して記録を伸ばそう`,
          icon: '/icons/icon-192x192.png',
          tag: 'streak',
          url: '/',
          type: 'streak',
        };
      }

      // 2. 思い出リマインダー（1年前、1ヶ月前、1週間前）
      if (!notification && sub.memoryReminder) {
        const memoryPeriods = [
          { days: 365, period: '1年前' },
          { days: 30, period: '1ヶ月前' },
          { days: 7, period: '1週間前' },
        ];

        for (const { days, period } of memoryPeriods) {
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() - days);
          const targetDateStr = targetDate.toDateString();

          const memoryItem = items.find(
            (item) => item.createdAt.toDateString() === targetDateStr
          );

          if (memoryItem) {
            notification = {
              title: '思い出を振り返ろう',
              body: `${period}に「${memoryItem.name}」を記録しました`,
              icon: '/icons/icon-192x192.png',
              tag: 'memory',
              url: '/',
              type: 'memory',
            };
            break;
          }
        }
      }

      // 3. モチベーションリマインダー（3日以上記録なし）
      if (!notification && sub.motivationReminder && daysSinceLastItem >= 3) {
        const messages = [
          '最近記録していないみたい。何か新しいモノ見つけた？',
          'コレクションに新しい思い出を追加しませんか？',
          '今日の大切なモノ、記録しておこう！',
          'あなたのコレクションが待っています',
          '小さな思い出も、大切なコレクションに',
        ];
        notification = {
          title: 'モノコレクター',
          body: messages[Math.floor(Math.random() * messages.length)],
          icon: '/icons/icon-192x192.png',
          tag: 'motivation',
          url: '/',
          type: 'motivation',
        };
      }

      // 4. 週次サマリー（日曜日）
      if (!notification && sub.weeklySummary && isSunday) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const weeklyItems = items.filter(
          (item) => item.createdAt >= weekAgo
        );

        if (weeklyItems.length > 0) {
          notification = {
            title: '今週のコレクション',
            body: `今週は${weeklyItems.length}個のモノを記録しました！連続${streak}日記録中`,
            icon: '/icons/icon-192x192.png',
            tag: 'weekly',
            url: '/',
            type: 'weekly',
          };
        }
      }

      if (!notification) {
        skipped++;
        continue;
      }

      // Push通知を送信
      const success = await sendPushNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        notification
      );

      if (success) {
        sent++;
        // 送信日を更新
        await prisma.pushSubscription.update({
          where: { id: sub.id },
          data: { lastNotifiedDate: todayStr },
        });
      } else {
        failed++;
        // 410/404の場合は無効なサブスクリプションとしてマーク
        expiredEndpoints.push(sub.endpoint);
      }
    }

    // 無効なサブスクリプションを削除
    if (expiredEndpoints.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: { in: expiredEndpoints } },
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: subscriptions.length,
        sent,
        skipped,
        failed,
        expired: expiredEndpoints.length,
      },
    });
  } catch (error) {
    console.error('Cron notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET も対応（Vercel Cronのデフォルトメソッド）
export async function GET(request: NextRequest) {
  return POST(request);
}
