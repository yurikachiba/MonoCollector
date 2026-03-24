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
// slot=morning (UTC 0:00 = JST 9:00): モチベーション + 思い出リマインダー
// slot=evening (UTC 12:00 = JST 21:00): ストリーク + 週次サマリー
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

  const url = new URL(request.url);
  const slot = url.searchParams.get('slot') || 'evening'; // デフォルトは夜
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const slotKey = `${todayStr}-${slot}`; // 朝と夜で別々に送信管理
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
      // このスロットで既に通知済みならスキップ
      if (sub.lastNotifiedDate === slotKey) {
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

      let notification = null;

      if (slot === 'morning') {
        // === 朝の通知（JST 9:00）===

        // 思い出リマインダー（該当があれば優先）
        if (sub.memoryReminder) {
          const memoryPeriods = [
            { days: 365, period: '1年前の今日' },
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
                url: '/collection',
                type: 'memory',
                requireInteraction: true,
              };
              break;
            }
          }
        }

        // おはよう挨拶（必ず届くフォールバック）
        if (!notification) {
          const morningMessages = streak > 0
            ? [
                `おはよう！${streak}日連続記録中、今日もいい一日に`,
                `おはよう！連続${streak}日目、今日も楽しもう`,
                `おはよう！${streak}日続いてるよ、すごい`,
              ]
            : [
                'おはよう！今日はどんなモノに出会えるかな',
                'おはよう！新しい一日のはじまり',
                'おはよう！今日も気軽に記録してみよう',
              ];
          notification = {
            title: 'モノコレクター',
            body: morningMessages[Math.floor(Math.random() * morningMessages.length)],
            icon: '/icons/icon-192x192.png',
            tag: 'morning-greeting',
            url: '/collection',
            type: 'motivation',
            requireInteraction: true,
          };
        }
      } else {
        // === 夜の通知（JST 21:00）===

        // ストリーク危機（今日まだ記録してない＆連続中）
        if (sub.streakReminder && streak > 0 && !hasAddedToday) {
          notification = {
            title: '連続記録が途切れそう！',
            body: `現在${streak}日連続！今日もモノを記録して記録を伸ばそう`,
            icon: '/icons/icon-192x192.png',
            tag: 'streak',
            url: '/collection',
            type: 'streak',
            requireInteraction: true,
          };
        }

        // 週次サマリー（日曜日）
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
              url: '/collection',
              type: 'weekly',
              requireInteraction: true,
            };
          }
        }

        // おつかれさま挨拶（必ず届くフォールバック）
        if (!notification) {
          const eveningMessages = hasAddedToday
            ? [
                'おつかれさま！今日も記録できたね',
                'おつかれさま！今日のコレクション、いい感じ',
                'おつかれさま！今日も一日おつかれ',
              ]
            : [
                'おつかれさま！今日はゆっくり休もう',
                'おつかれさま！また明日、気軽に記録しよう',
                'おつかれさま！いい一日だった？',
              ];
          notification = {
            title: 'モノコレクター',
            body: eveningMessages[Math.floor(Math.random() * eveningMessages.length)],
            icon: '/icons/icon-192x192.png',
            tag: 'evening-greeting',
            url: '/collection',
            type: 'motivation',
            requireInteraction: true,
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
        // 送信スロットを更新（朝と夜で別々に管理）
        await prisma.pushSubscription.update({
          where: { id: sub.id },
          data: { lastNotifiedDate: slotKey },
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
      slot,
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
