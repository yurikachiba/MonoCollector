# AGENT.md

このドキュメントは、AIエージェントがMonoCollectorプロジェクトで作業する際のガイドラインです。

## プロジェクト概要

**MonoCollector（モノコレクター）** は、日常のモノを通じて思い出を収集・保存するWebアプリケーションです。

- ユーザーが所有するアイテムの写真を撮影
- AIが自動でスタイライズされたアイコンに変換（mosaic, gradient, geometric, abstract, pixel）
- コレクションとして整理し、実績バッジを獲得
- ゲストモードとGoogle OAuth認証の両方をサポート

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| 状態管理 | Zustand, TanStack React Query |
| DB | PostgreSQL + Prisma 7 |
| 認証 | NextAuth 5 (beta) |
| AI | Groq Vision API |
| PWA | next-pwa |

## ディレクトリ構造

```
src/
├── app/              # Next.js App Router (ページ & API)
│   ├── api/          # APIエンドポイント
│   ├── collection/   # コレクションページ
│   └── ...
├── components/       # Reactコンポーネント
├── lib/              # ユーティリティ・ビジネスロジック
├── hooks/            # カスタムフック
├── contexts/         # Reactコンテキスト
└── types/            # 型定義

prisma/
├── schema.prisma     # データベーススキーマ
└── migrations/       # マイグレーション履歴
```

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# リント
npm run lint

# 型チェック
npx tsc --noEmit

# データベース
npm run db:push       # スキーマ同期
npm run db:migrate    # マイグレーション作成
npm run db:studio     # Prisma Studio起動
```

## コーディング規約

### TypeScript
- 厳格モード（strict: true）
- パスエイリアス: `@/*` → `./src/*`
- 型定義は `src/types/` に配置

### React
- 関数コンポーネントとフックを使用
- サーバーコンポーネント（RSC）とクライアントコンポーネントを適切に分離
- `"use client"` ディレクティブを必要な場合のみ使用

### スタイリング
- Tailwind CSS を使用
- グローバルスタイルは `src/app/globals.css`
- ダークモード対応

### コメント
- コードベース内のコメントは日本語が多い
- 新規コメントも日本語で記述可能

## データベーススキーマ

主要モデル:
- **User**: ユーザー（ゲスト含む）
- **Item**: コレクションアイテム（画像、アイコン、タグ等）
- **Category**: カテゴリ
- **Review**: レビュー

## API設計

APIエンドポイントは `src/app/api/` 配下:
- `/api/items` - アイテムCRUD
- `/api/categories` - カテゴリ管理
- `/api/reviews` - レビュー
- `/api/stats` - 統計情報
- `/api/auth` - 認証

## 環境変数

必須:
- `DATABASE_URL` - PostgreSQL接続文字列
- `AUTH_SECRET` - NextAuth シークレット
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - OAuth

オプション:
- `NEXT_PUBLIC_APP_URL` - アプリURL
- `OPENAI_API_KEY` - OpenAI API（AI機能用）

## CI/CD

GitHub Actionsで以下を実行:
1. ESLint
2. TypeScript型チェック
3. プロダクションビルド
4. セキュリティ監査

## 作業時の注意事項

1. **変更前に必ず該当ファイルを読む** - 既存コードを理解してから修正
2. **型安全性を維持** - `any` の使用を避ける
3. **セキュリティ** - SQLインジェクション、XSS等に注意
4. **シンプルに保つ** - 不必要な抽象化や機能追加を避ける
5. **テスト** - ビルドとリントが通ることを確認

## よくある操作

### 新しいAPIエンドポイント追加
1. `src/app/api/[endpoint]/route.ts` を作成
2. 型定義を `src/types/` に追加
3. 必要に応じて Prisma スキーマを更新

### 新しいコンポーネント追加
1. `src/components/[ComponentName].tsx` を作成
2. クライアントコンポーネントの場合は `"use client"` を追加
3. 必要に応じて hooks や contexts を作成

### データベース変更
1. `prisma/schema.prisma` を編集
2. `npm run db:push` または `npm run db:migrate` を実行
3. Prisma Client を再生成（自動）
