// サーバーサイド: イベント発生時にプッシュ通知を送信するユーティリティ
// アイテム追加時のバッジ/実績/レベルアップ検出 + プッシュ通知送信

import { prisma } from '@/lib/prisma';
import { sendPushNotification, PushPayload } from '@/lib/web-push';

// ========================================
// 実績マイルストーン定義（サーバーサイド用の軽量版）
// ========================================

interface Milestone {
  id: string;
  threshold: number;
  name: string;
  icon: string;
}

const itemMilestones: Milestone[] = [
  { id: 'items-1', threshold: 1, name: '初めての一歩', icon: '🌱' },
  { id: 'items-10', threshold: 10, name: 'コレクター見習い', icon: '🎯' },
  { id: 'items-25', threshold: 25, name: '熱心なコレクター', icon: '📋' },
  { id: 'items-50', threshold: 50, name: '整理整頓マスター', icon: '📦' },
  { id: 'items-100', threshold: 100, name: 'モノの魔術師', icon: '✨' },
  { id: 'items-250', threshold: 250, name: 'コレクター王', icon: '👑' },
  { id: 'items-500', threshold: 500, name: '伝説のコレクター', icon: '🏆' },
  { id: 'items-1000', threshold: 1000, name: 'グランドマスター', icon: '🎖️' },
];

const streakMilestones: Milestone[] = [
  { id: 'streak-3', threshold: 3, name: '3日坊主じゃない', icon: '🔥' },
  { id: 'streak-7', threshold: 7, name: '1週間継続', icon: '📅' },
  { id: 'streak-14', threshold: 14, name: '2週間の習慣', icon: '💪' },
  { id: 'streak-30', threshold: 30, name: '1ヶ月マラソン', icon: '🏃' },
  { id: 'streak-60', threshold: 60, name: '2ヶ月の執念', icon: '🌟' },
  { id: 'streak-100', threshold: 100, name: '100日達成', icon: '💯' },
  { id: 'streak-365', threshold: 365, name: '1年間のコミット', icon: '🎊' },
];

// レベル計算（collection-systemと同じロジック）
function calculateLevel(totalItems: number, streak: number): { level: number; title: string } {
  const baseExp = totalItems * 10 + streak * 5;
  const levels = [
    { level: 1, exp: 0, title: '新米コレクター' },
    { level: 2, exp: 20, title: '見習いコレクター' },
    { level: 3, exp: 50, title: '初級コレクター' },
    { level: 4, exp: 100, title: '中級コレクター' },
    { level: 5, exp: 200, title: '上級コレクター' },
    { level: 6, exp: 350, title: 'エキスパート' },
    { level: 7, exp: 550, title: 'マスター' },
    { level: 8, exp: 800, title: 'グランドマスター' },
    { level: 9, exp: 1100, title: 'レジェンド' },
    { level: 10, exp: 1500, title: '∞コレクター' },
  ];

  let current = levels[0];
  for (const l of levels) {
    if (baseExp >= l.exp) {
      current = l;
    }
  }
  return current;
}

// ストリーク計算
function calculateStreak(items: { createdAt: Date }[]): number {
  const today = new Date();
  let streak = 0;
  const sorted = [...items].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toDateString();

    if (sorted.some((item) => item.createdAt.toDateString() === dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

/**
 * アイテム追加後に実績をチェックし、新しい実績があればプッシュ通知を送信
 * （非同期でバックグラウンド実行、レスポンスをブロックしない）
 */
export async function checkAndNotifyAchievements(userId: string): Promise<void> {
  try {
    // ユーザーのアイテムとプッシュサブスクリプションを取得
    const [items, subscriptions, previousStateRecord] = await Promise.all([
      prisma.item.findMany({
        where: { userId },
        select: { id: true, name: true, category: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.pushSubscription.findMany({
        where: { userId, achievementAlert: true },
      }),
      prisma.appConfig.findUnique({
        where: { key: `user_achievement_state_${userId}` },
      }),
    ]);

    // プッシュサブスクリプションがなければスキップ
    if (subscriptions.length === 0) return;

    const totalItems = items.length;
    const streak = calculateStreak(items);

    // 前回の状態を復元
    let previousState = {
      unlockedItemMilestones: [] as string[],
      unlockedStreakMilestones: [] as string[],
      level: 1,
    };
    if (previousStateRecord) {
      try {
        previousState = JSON.parse(previousStateRecord.value);
      } catch { /* ignore */ }
    }

    // 現在の実績を計算
    const currentItemMilestones = itemMilestones
      .filter((m) => totalItems >= m.threshold)
      .map((m) => m.id);
    const currentStreakMilestones = streakMilestones
      .filter((m) => streak >= m.threshold)
      .map((m) => m.id);
    const currentLevel = calculateLevel(totalItems, streak);

    // 新しい実績を検出
    const newItemMilestones = currentItemMilestones.filter(
      (id) => !previousState.unlockedItemMilestones.includes(id)
    );
    const newStreakMilestones = currentStreakMilestones.filter(
      (id) => !previousState.unlockedStreakMilestones.includes(id)
    );
    const hasLeveledUp = currentLevel.level > previousState.level && previousState.level > 0;

    // 通知ペイロードを作成
    const notifications: PushPayload[] = [];

    for (const milestoneId of newItemMilestones) {
      const milestone = itemMilestones.find((m) => m.id === milestoneId);
      if (milestone) {
        notifications.push({
          title: '実績を解除！',
          body: `${milestone.icon} ${milestone.name}を達成しました！（${milestone.threshold}アイテム）`,
          icon: '/icons/icon-192x192.png',
          tag: `achievement-${milestoneId}`,
          url: '/collection',
          type: 'achievement',
        });
      }
    }

    for (const milestoneId of newStreakMilestones) {
      const milestone = streakMilestones.find((m) => m.id === milestoneId);
      if (milestone) {
        notifications.push({
          title: '連続記録の実績！',
          body: `${milestone.icon} ${milestone.name}を達成！（${milestone.threshold}日連続）`,
          icon: '/icons/icon-192x192.png',
          tag: `achievement-${milestoneId}`,
          url: '/collection',
          type: 'achievement',
        });
      }
    }

    if (hasLeveledUp) {
      notifications.push({
        title: 'レベルアップ！',
        body: `レベル${currentLevel.level}「${currentLevel.title}」になりました！`,
        icon: '/icons/icon-192x192.png',
        tag: `levelup-${currentLevel.level}`,
        url: '/collection',
        type: 'levelup',
        requireInteraction: true,
      });
    }

    // 通知を送信
    for (const notification of notifications) {
      for (const sub of subscriptions) {
        await sendPushNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          notification
        ).catch((err) => {
          console.warn('Failed to send achievement push:', err);
        });
      }
    }

    // 状態を保存
    const newState = {
      unlockedItemMilestones: currentItemMilestones,
      unlockedStreakMilestones: currentStreakMilestones,
      level: currentLevel.level,
    };

    await prisma.appConfig.upsert({
      where: { key: `user_achievement_state_${userId}` },
      update: { value: JSON.stringify(newState) },
      create: { key: `user_achievement_state_${userId}`, value: JSON.stringify(newState) },
    });
  } catch (error) {
    console.error('Failed to check/notify achievements:', error);
  }
}

/**
 * 特定ユーザーにテスト通知を送信
 */
export async function sendTestNotification(userId: string): Promise<{ sent: number; total: number }> {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  let sent = 0;
  const payload: PushPayload = {
    title: 'テスト通知',
    body: 'プッシュ通知が正常に動作しています！スマホを閉じてもこの通知が届きます。',
    icon: '/icons/icon-192x192.png',
    tag: `test-${Date.now()}`,
    url: '/collection',
    type: 'achievement',
    requireInteraction: true,
  };

  for (const sub of subscriptions) {
    const success = await sendPushNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      payload
    );
    if (success) sent++;
  }

  return { sent, total: subscriptions.length };
}
