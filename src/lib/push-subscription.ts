// クライアントサイド Web Push サブスクリプション管理
// VAPID公開鍵はサーバーAPIから自動取得される

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// VAPID公開鍵のキャッシュ
let cachedVapidPublicKey: string | null = null;

/**
 * VAPID公開鍵をサーバーから取得（自動生成済み）
 */
async function getVapidPublicKey(): Promise<string | null> {
  if (cachedVapidPublicKey) return cachedVapidPublicKey;

  try {
    const response = await fetch('/api/notifications/vapid-public-key');
    if (!response.ok) return null;

    const data = await response.json();
    cachedVapidPublicKey = data.publicKey;
    return cachedVapidPublicKey;
  } catch (error) {
    console.error('Failed to fetch VAPID public key:', error);
    return null;
  }
}

/**
 * Service Workerの登録を取得
 */
async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.ready;
    return registration;
  } catch {
    return null;
  }
}

/**
 * Web Pushサブスクリプションを作成してサーバーに登録
 */
export async function subscribeToPush(): Promise<boolean> {
  const vapidPublicKey = await getVapidPublicKey();
  if (!vapidPublicKey) {
    console.warn('VAPID public key not available');
    return false;
  }

  const registration = await getServiceWorkerRegistration();
  if (!registration) {
    console.warn('Service Worker not registered');
    return false;
  }

  try {
    // 既存のサブスクリプションを確認
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // 新しいサブスクリプションを作成
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });
    }

    // サーバーにサブスクリプションを送信
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
      }),
    });

    if (!response.ok) {
      console.error('Failed to register push subscription on server');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return false;
  }
}

/**
 * Web Pushサブスクリプションを解除
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  const registration = await getServiceWorkerRegistration();
  if (!registration) return true;

  try {
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return true;

    // サーバーからサブスクリプションを削除
    await fetch('/api/notifications/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    // ブラウザのサブスクリプションを解除
    await subscription.unsubscribe();
    return true;
  } catch (error) {
    console.error('Failed to unsubscribe from push:', error);
    return false;
  }
}

/**
 * サーバーに通知設定を同期
 */
export async function syncNotificationSettings(settings: {
  memoryReminder: boolean;
  streakReminder: boolean;
  achievementAlert: boolean;
  weeklySummary: boolean;
  motivationReminder: boolean;
}): Promise<void> {
  const registration = await getServiceWorkerRegistration();
  if (!registration) return;

  try {
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;

    await fetch('/api/notifications/subscribe', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        settings,
      }),
    });
  } catch (error) {
    console.error('Failed to sync notification settings:', error);
  }
}

/**
 * 現在のPushサブスクリプションが有効か確認
 */
export async function isPushSubscribed(): Promise<boolean> {
  const registration = await getServiceWorkerRegistration();
  if (!registration) return false;

  try {
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch {
    return false;
  }
}
