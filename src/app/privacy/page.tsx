'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const sections = [
    {
      title: "1. 収集する情報",
      content: "本サービスは、以下の情報を収集します。",
      subsections: [
        {
          title: "1.1 Googleアカウント情報",
          description: "Googleアカウントでログインする場合、Google OAuth 2.0を通じて以下の情報を取得します：",
          items: ["メールアドレス（アカウント識別・ログイン用）", "表示名（アプリ内でのユーザー名表示用）", "プロフィール画像（アプリ内でのアイコン表示用）"],
        },
        {
          title: "1.2 ユーザーが登録するデータ",
          description: "本サービスの利用において、ユーザーが登録する以下の情報：",
          items: ["アイテム名", "カテゴリ情報", "アイテムの画像", "メモ・備考"],
        },
        {
          title: "1.3 自動的に収集される情報",
          description: "サービス改善のため、以下の情報が自動的に収集される場合があります：",
          items: ["アクセス日時", "ブラウザの種類", "デバイス情報"],
        },
      ],
    },
    {
      title: "2. 情報の利用目的",
      content: "収集した情報は、以下の目的で利用します：",
      items: [
        "ユーザー認証とアカウント管理",
        "本サービスの機能提供（アイテムの保存・表示・管理）",
        "複数デバイス間でのデータ同期",
        "サービスの改善と新機能の開発",
        "ユーザーサポートの提供",
      ],
    },
    {
      title: "3. 情報の共有",
      content: "本サービスは、以下の場合を除き、ユーザーの個人情報を第三者と共有しません：",
      items: [
        "ユーザーの同意がある場合",
        "法令に基づく開示要請がある場合",
        "サービス提供に必要な外部サービス（認証プロバイダー等）との連携",
      ],
    },
    {
      title: "4. Google ユーザーデータの取り扱い",
      content: "本サービスは、Google OAuth 2.0 を使用してユーザー認証を行います。Googleから取得するユーザーデータの取り扱いについて、以下のとおり定めます。",
      subsections: [
        {
          title: "4.1 取得するGoogleユーザーデータ",
          description: "本サービスがGoogleから取得する情報は以下に限定されます：",
          items: [
            "メールアドレス（ユーザー識別用）",
            "表示名（アプリ内表示用）",
            "プロフィール画像URL（アプリ内表示用）",
          ],
        },
        {
          title: "4.2 Googleユーザーデータの利用制限",
          description: "本サービスのGoogleユーザーデータの使用は、Google API サービスのユーザーデータに関するポリシー（Google API Services User Data Policy）に準拠しています。具体的には：",
          items: [
            "Googleから取得したデータは、本プライバシーポリシーに記載された目的（ユーザー認証およびアプリ内表示）以外には使用しません",
            "Googleユーザーデータを第三者に販売することはありません",
            "Googleユーザーデータを広告配信の目的で使用することはありません",
            "Googleユーザーデータは、ユーザーにサービスを提供するために必要な範囲でのみ転送・使用されます",
            "ユーザーはいつでもアカウント削除を通じて、保存されたGoogleユーザーデータの削除を要求できます",
          ],
        },
        {
          title: "4.3 Limited Use（制限付き使用）の遵守",
          description: "本サービスにおけるGoogle APIから受信した情報の使用および他のアプリへの転送は、以下を含むGoogle API サービスのユーザーデータに関するポリシーの「Limited Use（制限付き使用）」の要件に準拠します：",
          items: [
            "ユーザーに対してアプリの機能を提供または改善するために必要な場合にのみ、データを使用します",
            "データをユーザーが合理的に期待する目的以外で使用しません",
            "セキュリティ上の目的、法令遵守、またはアプリの運営に必要な場合を除き、データを他者に転送しません",
            "人間がデータを読むことは、ユーザーの同意がある場合、セキュリティ上の目的、法令遵守、またはアプリの運営に必要な場合に限られます",
          ],
        },
      ],
    },
    {
      title: "5. データの保存と保護",
      content: "ユーザーのデータは、適切なセキュリティ対策を施したサーバーに保存されます。すべての通信はHTTPSで暗号化され、データベースへのアクセスは厳格に制御されています。",
    },
    {
      title: "6. ユーザーの権利",
      content: "ユーザーは以下の権利を有します：",
      items: [
        "自身のデータへのアクセス",
        "データの修正・削除の要求",
        "アカウントの削除（アカウント削除時に、関連するすべてのデータが削除されます）",
        "Googleアカウントとの連携解除（Google アカウント設定 > セキュリティ > サードパーティのアクセスからも解除可能です）",
      ],
    },
    {
      title: "7. Cookieの使用",
      content: "本サービスは、ログイン状態の維持やユーザー体験の向上のためにCookieを使用します。ブラウザの設定でCookieを無効にすることも可能ですが、一部の機能が制限される場合があります。",
    },
    {
      title: "8. 外部サービス",
      content: "本サービスは以下の外部サービスを利用しています。これらのサービスは、それぞれのプライバシーポリシーに従って情報を処理します。",
      items: [
        "Google OAuth 2.0 - ユーザー認証のため（Google プライバシーポリシー: https://policies.google.com/privacy）",
        "Vercel - ホスティングサービス（Vercel Privacy Policy: https://vercel.com/legal/privacy-policy）",
        "Groq - AI画像認識・アイコン生成のため",
      ],
    },
    {
      title: "9. 子どものプライバシー",
      content: "本サービスは、13歳未満の子どもからの個人情報を意図的に収集しません。13歳未満の方は、保護者の同意を得た上でご利用ください。13歳未満の子どもの情報が収集されていることが判明した場合、速やかに削除いたします。",
    },
    {
      title: "10. データの保持期間",
      content: "ユーザーデータは、アカウントが有効な間保持されます。ユーザーがアカウントを削除した場合、関連するすべてのデータ（アイテム情報、画像、アカウント情報など）は速やかに削除されます。ゲストアカウントのデータは、セッション終了後にアクセスできなくなる場合があります。",
    },
    {
      title: "11. プライバシーポリシーの変更",
      content: "本プライバシーポリシーは、必要に応じて変更されることがあります。重要な変更がある場合は、本サービス上で通知します。変更後のプライバシーポリシーは、本サービス上に掲載された時点から効力を生じるものとします。",
    },
    {
      title: "12. お問い合わせ",
      content: "プライバシーに関するご質問やご懸念がある場合は、以下の連絡先までお問い合わせください。",
      subsections: [
        {
          title: "連絡先",
          description: "運営者：豆腐小僧",
          items: [
            "メールアドレス：monocollector.tofu@gmail.com",
            "ウェブサイト：https://monocollector.com",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/icon.svg"
              alt="モノコレクター"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
              モノコレクター
            </span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6 shadow-lg shadow-purple-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                プライバシーポリシー
              </span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              最終更新日: 2026年2月6日
            </p>
          </motion.div>

          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 mb-8"
          >
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              モノコレクター（以下「本サービス」）は、ユーザーのプライバシーを尊重し、
              個人情報の保護に努めています。本プライバシーポリシーでは、本サービスが
              収集する情報とその利用方法について説明します。本サービスにおける
              Google APIから受信した情報の使用は、
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700 dark:hover:text-purple-300">Google API サービスのユーザーデータに関するポリシー</a>
              （Limited Use（制限付き使用）の要件を含む）に準拠しています。
            </p>
          </motion.div>

          {/* Sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
              >
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                  {section.title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
                  {section.content}
                </p>

                {section.subsections && (
                  <div className="space-y-4 mt-4">
                    {section.subsections.map((subsection, subIndex) => (
                      <div
                        key={subIndex}
                        className="pl-4 border-l-2 border-purple-200 dark:border-purple-800"
                      >
                        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                          {subsection.title}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">
                          {subsection.description}
                        </p>
                        <ul className="space-y-1">
                          {subsection.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {section.items && !section.subsections && (
                  <ul className="space-y-2 mt-3">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Image
              src="/icon.svg"
              alt="モノコレクター"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-sm">モノコレクター</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-500">
            <Link
              href="/terms"
              className="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <FileText className="w-4 h-4" />
              利用規約
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-purple-600 dark:text-purple-400 font-medium">
              プライバシーポリシー
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
