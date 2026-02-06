'use client';

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsOfServicePage() {
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
      title: "第1条（適用）",
      content: "本規約は、ユーザーと本サービスの運営者との間の本サービスの利用に関わる一切の関係に適用されるものとします。",
    },
    {
      title: "第2条（利用登録）",
      content: null,
      orderedItems: [
        "本サービスの利用を希望する方は、本規約に同意の上、Googleアカウントまたはゲストログインにより利用登録を行うものとします。",
        "ゲストアカウントで登録されたデータは、ブラウザのセッション終了時にアクセスできなくなる場合があります。継続的なデータ保存にはGoogleアカウントでのログインを推奨します。",
      ],
    },
    {
      title: "第3条（禁止事項）",
      content: "ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。",
      items: [
        "法令または公序良俗に違反する行為",
        "犯罪行為に関連する行為",
        "本サービスのサーバーまたはネットワークの機能を破壊・妨害する行為",
        "本サービスの運営を妨害するおそれのある行為",
        "他のユーザーに関する個人情報等を収集・蓄積する行為",
        "他のユーザーに成りすます行為",
        "本サービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為",
        "不正アクセスまたはこれを試みる行為",
        "その他、運営者が不適切と判断する行為",
      ],
    },
    {
      title: "第4条（本サービスの提供の停止等）",
      content: "運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止・中断することができます。",
      items: [
        "本サービスにかかるシステムの保守点検または更新を行う場合",
        "地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合",
        "コンピュータまたは通信回線等が事故により停止した場合",
        "その他、運営者が本サービスの提供が困難と判断した場合",
      ],
    },
    {
      title: "第5条（利用制限および登録抹消）",
      content: "運営者は、ユーザーが本規約のいずれかの条項に違反した場合、事前の通知なく、ユーザーに対して本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができます。",
    },
    {
      title: "第6条（免責事項）",
      content: null,
      orderedItems: [
        "運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。",
        "運営者は、本サービスに起因してユーザーに生じたあらゆる損害について、運営者の故意または重大な過失による場合を除き、一切の責任を負いません。",
        "本サービスは無料で提供されており、データの永続的な保存を保証するものではありません。重要なデータはユーザー自身でバックアップを取ることを推奨します。",
      ],
    },
    {
      title: "第7条（サービス内容の変更等）",
      content: "運営者は、ユーザーへの事前の通知なく、本サービスの内容を変更したり、本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。",
    },
    {
      title: "第8条（利用規約の変更）",
      content: "運営者は、必要と判断した場合には、ユーザーに通知することなく、いつでも本規約を変更することができるものとします。変更後の利用規約は、本サービス上に掲載された時点から効力を生じるものとします。",
    },
    {
      title: "第9条（個人情報の取扱い）",
      content: "本サービスの利用によって取得するユーザーの個人情報については、本サービスのプライバシーポリシーに従い適切に取り扱うものとします。",
      link: {
        text: "プライバシーポリシーはこちら",
        href: "/privacy",
      },
    },
    {
      title: "第10条（外部サービスの利用）",
      content: null,
      orderedItems: [
        "本サービスは、ユーザー認証のためにGoogle OAuth 2.0を使用しています。Googleアカウントでログインすることにより、ユーザーはGoogleの利用規約およびプライバシーポリシーにも同意したものとします。",
        "本サービスにおけるGoogleユーザーデータの取り扱いは、Google API サービスのユーザーデータに関するポリシー（Limited Use（制限付き使用）の要件を含む）に準拠します。",
        "ユーザーは、Google アカウント設定から本サービスとのアカウント連携をいつでも解除することができます。",
      ],
    },
    {
      title: "第11条（通知または連絡）",
      content: "ユーザーと運営者との間の通知または連絡は、運営者の定める方法によって行うものとします。お問い合わせは monocollector.tofu@gmail.com までご連絡ください。",
    },
    {
      title: "第12条（権利義務の譲渡の禁止）",
      content: "ユーザーは、運営者の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。",
    },
    {
      title: "第13条（準拠法・裁判管轄）",
      content: "本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。",
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                利用規約
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
              この利用規約（以下「本規約」）は、モノコレクター（以下「本サービス」）の
              利用条件を定めるものです。ユーザーの皆様には、本規約に同意いただいた上で、
              本サービスをご利用いただきます。
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

                {section.content && (
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-3">
                    {section.content}
                  </p>
                )}

                {section.orderedItems && (
                  <ol className="space-y-3 mt-3">
                    {section.orderedItems.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-sm text-zinc-600 dark:text-zinc-400 flex gap-3"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {itemIndex + 1}
                        </span>
                        <span className="leading-relaxed pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {section.items && (
                  <ul className="space-y-2 mt-3">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.link && (
                  <Link
                    href={section.link.href}
                    className="inline-flex items-center gap-1 mt-3 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    {section.link.text}
                  </Link>
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
            <span className="text-purple-600 dark:text-purple-400 font-medium">
              利用規約
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <Link
              href="/privacy"
              className="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <Shield className="w-4 h-4" />
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
