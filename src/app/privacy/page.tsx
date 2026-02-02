import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "プライバシーポリシー | モノコレクター",
  description: "モノコレクターのプライバシーポリシー",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          戻る
        </Link>

        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <h1>プライバシーポリシー</h1>
          <p className="text-sm text-zinc-500">最終更新日: 2025年2月2日</p>

          <p>
            モノコレクター（以下「本サービス」）は、ユーザーのプライバシーを尊重し、
            個人情報の保護に努めています。本プライバシーポリシーでは、本サービスが
            収集する情報とその利用方法について説明します。
          </p>

          <h2>1. 収集する情報</h2>
          <p>本サービスは、以下の情報を収集します。</p>

          <h3>1.1 Googleアカウント情報</h3>
          <p>Googleアカウントでログインする場合、以下の情報を取得します：</p>
          <ul>
            <li>メールアドレス</li>
            <li>表示名</li>
            <li>プロフィール画像</li>
          </ul>

          <h3>1.2 ユーザーが登録するデータ</h3>
          <p>本サービスの利用において、ユーザーが登録する以下の情報：</p>
          <ul>
            <li>アイテム名</li>
            <li>カテゴリ情報</li>
            <li>アイテムの画像</li>
            <li>メモ・備考</li>
          </ul>

          <h3>1.3 自動的に収集される情報</h3>
          <p>サービス改善のため、以下の情報が自動的に収集される場合があります：</p>
          <ul>
            <li>アクセス日時</li>
            <li>ブラウザの種類</li>
            <li>デバイス情報</li>
          </ul>

          <h2>2. 情報の利用目的</h2>
          <p>収集した情報は、以下の目的で利用します：</p>
          <ul>
            <li>ユーザー認証とアカウント管理</li>
            <li>本サービスの機能提供</li>
            <li>サービスの改善と新機能の開発</li>
            <li>ユーザーサポートの提供</li>
          </ul>

          <h2>3. 情報の共有</h2>
          <p>
            本サービスは、以下の場合を除き、ユーザーの個人情報を第三者と共有しません：
          </p>
          <ul>
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく開示要請がある場合</li>
            <li>サービス提供に必要な外部サービス（認証プロバイダー等）との連携</li>
          </ul>

          <h2>4. データの保存と保護</h2>
          <p>
            ユーザーのデータは、適切なセキュリティ対策を施したサーバーに保存されます。
            データの暗号化やアクセス制御などの技術的措置を講じています。
          </p>

          <h2>5. ユーザーの権利</h2>
          <p>ユーザーは以下の権利を有します：</p>
          <ul>
            <li>自身のデータへのアクセス</li>
            <li>データの修正・削除の要求</li>
            <li>アカウントの削除</li>
          </ul>

          <h2>6. Cookieの使用</h2>
          <p>
            本サービスは、ログイン状態の維持やユーザー体験の向上のために
            Cookieを使用します。ブラウザの設定でCookieを無効にすることも
            可能ですが、一部の機能が制限される場合があります。
          </p>

          <h2>7. 外部サービス</h2>
          <p>本サービスは以下の外部サービスを利用しています：</p>
          <ul>
            <li>
              <strong>Google OAuth</strong>: ユーザー認証のため
            </li>
            <li>
              <strong>Vercel</strong>: ホスティングサービス
            </li>
          </ul>
          <p>
            これらのサービスは、それぞれのプライバシーポリシーに従って
            情報を処理します。
          </p>

          <h2>8. 子どものプライバシー</h2>
          <p>
            本サービスは、13歳未満の子どもからの個人情報を意図的に収集しません。
            13歳未満の方は、保護者の同意を得た上でご利用ください。
          </p>

          <h2>9. プライバシーポリシーの変更</h2>
          <p>
            本プライバシーポリシーは、必要に応じて変更されることがあります。
            重要な変更がある場合は、本サービス上で通知します。
          </p>

          <h2>10. お問い合わせ</h2>
          <p>
            プライバシーに関するご質問やご懸念がある場合は、
            本サービスの管理者までお問い合わせください。
          </p>
        </article>
      </div>
    </div>
  );
}
