# CLAUDE.md

## プッシュ通知

- 全通知はロック画面に表示される設定になっている（`requireInteraction: true`）
- Web Push の urgency は `high` に設定し、Dozeモード中のデバイスでも通知を配信する
- Service Worker (`public/push-sw.js`) で全通知に `requireInteraction: true` を強制適用
- サーバー送信通知（cron・実績・テスト）にも `requireInteraction: true` を付与すること

### 通知関連ファイル

- `public/push-sw.js` - Service Worker のプッシュ通知ハンドラー
- `src/lib/notifications.ts` - クライアント側の通知設定・表示
- `src/lib/web-push.ts` - サーバー側の Web Push 送信
- `src/lib/push-notify-on-event.ts` - 実績達成時のプッシュ通知
- `src/lib/push-subscription.ts` - クライアント側のサブスクリプション管理
- `src/app/api/notifications/cron/route.ts` - 定期通知（朝・夜）
- `src/app/api/notifications/subscribe/route.ts` - サブスクリプション登録API
- `src/app/api/notifications/test/route.ts` - テスト通知API

## 参考プロジェクト

- PiyocoTodo (https://piyocotodo.com/) - 通知のロック画面表示の参考にしたアプリ

## CI/CD・PR作成について

- この環境ではGitHub APIへの認証がないため、Claude CodeからPRを作成できない
- ブランチをpushした後、手動でGitHub上からPRを作成すること
- PR作成URL例: `https://github.com/yurikachiba/MonoCollector/pull/new/<ブランチ名>`
