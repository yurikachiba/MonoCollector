// Web Push通知ハンドラー（Service Worker内で実行）
// next-pwaが生成するService Workerにimportされる

// 通知タイプ別のバイブレーションパターン
// [振動ms, 休止ms, 振動ms, ...]
var vibrationPatterns = {
  achievement: [200, 100, 200, 100, 400],   // 達成感のある長めのパターン
  levelup:     [100, 50, 100, 50, 100, 50, 400], // 連続ブブブ→長め
  badge:       [200, 100, 200, 100, 400],    // 実績と同じ
  streak:      [300, 100, 300],              // ダブルバイブ
  memory:      [200, 200, 200],              // 穏やかなリマインド
  motivation:  [200, 200, 200],              // 穏やかなリマインド
  weekly:      [150, 100, 150, 100, 150],    // 軽快なパターン
  default:     [200, 100, 200],              // デフォルト
};

// 通知タイプ別のアクションボタン
var actionsByType = {
  streak: [
    { action: 'open', title: '記録する', icon: '/icons/icon-72x72.png' },
    { action: 'dismiss', title: 'あとで' },
  ],
  memory: [
    { action: 'open', title: '振り返る', icon: '/icons/icon-72x72.png' },
    { action: 'dismiss', title: '閉じる' },
  ],
  achievement: [
    { action: 'open', title: '確認する', icon: '/icons/icon-72x72.png' },
  ],
  levelup: [
    { action: 'open', title: '確認する', icon: '/icons/icon-72x72.png' },
  ],
  badge: [
    { action: 'open', title: '確認する', icon: '/icons/icon-72x72.png' },
  ],
  motivation: [
    { action: 'open', title: '記録する', icon: '/icons/icon-72x72.png' },
    { action: 'dismiss', title: 'あとで' },
  ],
  weekly: [
    { action: 'open', title: '詳しく見る', icon: '/icons/icon-72x72.png' },
  ],
};

self.addEventListener('push', function (event) {
  if (!event.data) return;

  var data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'モノコレクター',
      body: event.data.text(),
    };
  }

  var notificationType = data.type || 'default';
  var vibrate = vibrationPatterns[notificationType] || vibrationPatterns.default;
  var actions = actionsByType[notificationType] || [];

  var options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-72x72.png',
    tag: data.tag || 'monocollector-' + Date.now(),
    data: {
      url: data.url || '/collection',
      type: notificationType,
      ...(data.data || {}),
    },
    requireInteraction: data.requireInteraction || false,
    vibrate: vibrate,
    actions: actions,
    renotify: true, // 同じtagでも再通知する
    silent: false,  // 必ず音とバイブレーションを鳴らす
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'モノコレクター',
      options
    )
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  var action = event.action;
  var notificationData = event.notification.data || {};

  // 「あとで」ボタンの場合は閉じるだけ
  if (action === 'dismiss') {
    return;
  }

  // 通知クリック or 「開く」アクション → アプリを開く
  var url = notificationData.url || '/collection';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        // 既存のウィンドウがあればフォーカス
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        // なければ新しいウィンドウを開く
        return clients.openWindow(url);
      })
  );
});
