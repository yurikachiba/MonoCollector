// サーバーサイド Web Push通知ユーティリティ
// VAPID鍵は環境変数 or DBから自動生成・永続化される
import webpush from 'web-push';
import { prisma } from '@/lib/prisma';

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  type?: string;
  requireInteraction?: boolean;
  data?: Record<string, unknown>;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// VAPID鍵のキャッシュ（プロセス内で再利用）
let cachedVapidKeys: { publicKey: string; privateKey: string } | null = null;
let vapidInitialized = false;

function getVapidSubject(): string {
  return process.env.NEXT_PUBLIC_APP_URL
    ? `mailto:noreply@${new URL(process.env.NEXT_PUBLIC_APP_URL).hostname}`
    : 'mailto:noreply@monocollector.com';
}

/**
 * VAPID鍵を取得（環境変数 → DB → 自動生成の優先順）
 */
async function getOrCreateVapidKeys(): Promise<{ publicKey: string; privateKey: string }> {
  // キャッシュがあればそれを使う
  if (cachedVapidKeys) return cachedVapidKeys;

  // 1. 環境変数から取得
  const envPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const envPrivate = process.env.VAPID_PRIVATE_KEY;
  if (envPublic && envPrivate) {
    cachedVapidKeys = { publicKey: envPublic, privateKey: envPrivate };
    return cachedVapidKeys;
  }

  // 2. DBから取得
  try {
    const [pubRecord, privRecord] = await Promise.all([
      prisma.appConfig.findUnique({ where: { key: 'vapid_public_key' } }),
      prisma.appConfig.findUnique({ where: { key: 'vapid_private_key' } }),
    ]);

    if (pubRecord && privRecord) {
      cachedVapidKeys = { publicKey: pubRecord.value, privateKey: privRecord.value };
      return cachedVapidKeys;
    }
  } catch (error) {
    console.warn('Failed to read VAPID keys from DB, generating new ones:', error);
  }

  // 3. 自動生成してDBに保存
  const keys = webpush.generateVAPIDKeys();
  cachedVapidKeys = { publicKey: keys.publicKey, privateKey: keys.privateKey };

  try {
    await Promise.all([
      prisma.appConfig.upsert({
        where: { key: 'vapid_public_key' },
        update: { value: keys.publicKey },
        create: { key: 'vapid_public_key', value: keys.publicKey },
      }),
      prisma.appConfig.upsert({
        where: { key: 'vapid_private_key' },
        update: { value: keys.privateKey },
        create: { key: 'vapid_private_key', value: keys.privateKey },
      }),
    ]);
    console.log('[WebPush] VAPID keys auto-generated and saved to database');
  } catch (error) {
    console.error('Failed to save VAPID keys to DB:', error);
  }

  return cachedVapidKeys;
}

/**
 * webpushライブラリを初期化（遅延初期化）
 */
async function ensureInitialized(): Promise<boolean> {
  if (vapidInitialized) return true;

  const keys = await getOrCreateVapidKeys();
  if (!keys.publicKey || !keys.privateKey) return false;

  webpush.setVapidDetails(getVapidSubject(), keys.publicKey, keys.privateKey);
  vapidInitialized = true;
  return true;
}

/**
 * VAPID公開鍵を取得（クライアントに渡す用）
 */
export async function getVapidPublicKey(): Promise<string | null> {
  const keys = await getOrCreateVapidKeys();
  return keys.publicKey || null;
}

/**
 * Push通知を送信
 */
export async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: PushPayload
): Promise<boolean> {
  const ready = await ensureInitialized();
  if (!ready) {
    console.warn('Web Push not initialized, skipping notification');
    return false;
  }

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      JSON.stringify(payload),
      {
        TTL: 60 * 60, // 1 hour
        urgency: 'normal',
      }
    );
    return true;
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 410 || statusCode === 404) {
      console.log('Push subscription expired or unsubscribed:', subscription.endpoint);
      return false;
    }
    console.error('Failed to send push notification:', error);
    return false;
  }
}

/**
 * Web Pushが利用可能か確認
 */
export async function isWebPushConfigured(): Promise<boolean> {
  try {
    const keys = await getOrCreateVapidKeys();
    return !!(keys.publicKey && keys.privateKey);
  } catch {
    return false;
  }
}
