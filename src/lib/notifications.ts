// プッシュ通知システム
// Web Push API を使用したプッシュ通知の管理

export interface NotificationSettings {
  enabled: boolean;
  memoryReminder: boolean;      // 思い出リマインダー
  streakReminder: boolean;      // ストリーク維持リマインダー
  achievementAlert: boolean;    // 実績・レベルアップ通知
  weeklySummary: boolean;       // 週次サマリー
  motivationReminder: boolean;  // モチベーション通知
  reminderTime: string;         // リマインダーの時間 (HH:MM)
}

export const defaultNotificationSettings: NotificationSettings = {
  enabled: false,
  memoryReminder: true,
  streakReminder: true,
  achievementAlert: true,
  weeklySummary: true,
  motivationReminder: true,
  reminderTime: '21:00', // 効果的な時間帯（21:00）に固定
};

// 通知タイプの定義
export type NotificationType =
  | 'memory'           // 思い出リマインダー
  | 'streak'           // ストリーク維持
  | 'achievement'      // 実績解除
  | 'levelup'          // レベルアップ
  | 'badge'            // バッジ獲得
  | 'weekly'           // 週次サマリー
  | 'motivation';      // モチベーション

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

// ========================================
// 通知設定の保存・読み込み
// ========================================

const SETTINGS_KEY = 'monocollector_notification_settings';

export function getNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return defaultNotificationSettings;

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const settings = { ...defaultNotificationSettings, ...JSON.parse(stored) };
      // 時間帯を効果的な21:00に固定（ユーザーによる変更を無効化）
      settings.reminderTime = '21:00';
      return settings;
    }
  } catch (error) {
    console.error('Failed to load notification settings:', error);
  }

  return defaultNotificationSettings;
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save notification settings:', error);
  }
}

// ========================================
// 通知の許可とサポート確認
// ========================================

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  return await Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  return Notification.permission;
}

// ========================================
// ローカル通知の表示
// ========================================

export async function showNotification(payload: NotificationPayload): Promise<void> {
  const permission = getNotificationPermission();

  if (permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  const settings = getNotificationSettings();

  // 設定に基づいて通知をフィルタリング
  if (!settings.enabled) return;

  switch (payload.type) {
    case 'memory':
      if (!settings.memoryReminder) return;
      break;
    case 'streak':
      if (!settings.streakReminder) return;
      break;
    case 'achievement':
    case 'levelup':
    case 'badge':
      if (!settings.achievementAlert) return;
      break;
    case 'weekly':
      if (!settings.weeklySummary) return;
      break;
    case 'motivation':
      if (!settings.motivationReminder) return;
      break;
  }

  // Service Workerを使った通知を試行
  if ('serviceWorker' in navigator) {
    try {
      // 登録済みのService Workerを取得（タイムアウト付き）
      const registration = await Promise.race([
        navigator.serviceWorker.getRegistration(),
        new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), 1000)),
      ]);

      if (registration) {
        await registration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/icons/icon-192x192.png',
          badge: payload.badge || '/icons/icon-72x72.png',
          tag: payload.tag || payload.type,
          data: {
            type: payload.type,
            url: '/',
            ...payload.data,
          },
          requireInteraction: payload.type === 'achievement' || payload.type === 'badge' || payload.type === 'levelup',
        });
        return;
      }
    } catch (error) {
      console.warn('Service Worker notification failed, falling back to browser notification:', error);
    }
  }

  // Service Workerが利用できない場合はブラウザ通知を使用
  try {
    new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      tag: payload.tag || payload.type,
    });
  } catch (error) {
    console.error('Browser notification failed:', error);
  }
}

// ========================================
// 通知メッセージのテンプレート
// ========================================

export function createMemoryNotification(itemName: string, period: string): NotificationPayload {
  return {
    type: 'memory',
    title: '思い出を振り返ろう',
    body: `${period}に「${itemName}」を記録しました`,
    icon: '/icons/icon-192x192.png',
    data: { itemName, period },
  };
}

export function createStreakNotification(currentStreak: number): NotificationPayload {
  return {
    type: 'streak',
    title: '連続記録が途切れそう！',
    body: `現在${currentStreak}日連続！今日もモノを記録して記録を伸ばそう`,
    icon: '/icons/icon-192x192.png',
    data: { currentStreak },
  };
}

export function createAchievementNotification(achievementName: string, achievementIcon: string): NotificationPayload {
  return {
    type: 'achievement',
    title: '実績を解除！',
    body: `${achievementIcon} ${achievementName}を達成しました！`,
    icon: '/icons/icon-192x192.png',
    data: { achievementName, achievementIcon },
  };
}

export function createLevelUpNotification(newLevel: number, title: string): NotificationPayload {
  return {
    type: 'levelup',
    title: 'レベルアップ！',
    body: `レベル${newLevel}「${title}」になりました！`,
    icon: '/icons/icon-192x192.png',
    data: { newLevel, title },
  };
}

export function createBadgeNotification(badgeName: string, badgeIcon: string): NotificationPayload {
  return {
    type: 'badge',
    title: 'バッジを獲得！',
    body: `${badgeIcon} ${badgeName}を獲得しました！`,
    icon: '/icons/icon-192x192.png',
    data: { badgeName, badgeIcon },
  };
}

export function createWeeklySummaryNotification(itemCount: number, streak: number): NotificationPayload {
  return {
    type: 'weekly',
    title: '今週のコレクション',
    body: `今週は${itemCount}個のモノを記録しました！連続${streak}日記録中`,
    icon: '/icons/icon-192x192.png',
    data: { itemCount, streak },
  };
}

export function createMotivationNotification(): NotificationPayload {
  const messages = [
    '最近記録していないみたい。何か新しいモノ見つけた？',
    'コレクションに新しい思い出を追加しませんか？',
    '今日の大切なモノ、記録しておこう！',
    'あなたのコレクションが待っています',
    '小さな思い出も、大切なコレクションに',
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return {
    type: 'motivation',
    title: 'モノコレクター',
    body: randomMessage,
    icon: '/icons/icon-192x192.png',
  };
}

// ========================================
// スケジュール通知のチェック（ローカル）
// ========================================

const LAST_STREAK_CHECK_KEY = 'monocollector_last_streak_check';
const LAST_MOTIVATION_CHECK_KEY = 'monocollector_last_motivation_check';

export function shouldShowStreakReminder(hasAddedToday: boolean, streak: number): boolean {
  if (typeof window === 'undefined') return false;
  if (hasAddedToday) return false;
  if (streak === 0) return false;

  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.streakReminder) return false;

  // 今日既にチェックしたか
  const lastCheck = localStorage.getItem(LAST_STREAK_CHECK_KEY);
  const today = new Date().toDateString();
  if (lastCheck === today) return false;

  // リマインダー時間をチェック
  const now = new Date();
  const [hours, minutes] = settings.reminderTime.split(':').map(Number);
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);

  if (now >= reminderTime) {
    localStorage.setItem(LAST_STREAK_CHECK_KEY, today);
    return true;
  }

  return false;
}

export function shouldShowMotivationReminder(daysSinceLastItem: number): boolean {
  if (typeof window === 'undefined') return false;
  if (daysSinceLastItem < 3) return false; // 3日以上記録がない場合のみ

  const settings = getNotificationSettings();
  if (!settings.enabled || !settings.motivationReminder) return false;

  // 最後のチェックから3日経過しているか
  const lastCheck = localStorage.getItem(LAST_MOTIVATION_CHECK_KEY);
  if (lastCheck) {
    const lastCheckDate = new Date(lastCheck);
    const daysSinceCheck = Math.floor((Date.now() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceCheck < 3) return false;
  }

  localStorage.setItem(LAST_MOTIVATION_CHECK_KEY, new Date().toISOString());
  return true;
}
