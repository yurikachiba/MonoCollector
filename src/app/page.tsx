'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Sparkles, Camera, Trophy, ArrowRight, Infinity, Palette, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const { data: session } = useSession();

  const features = [
    {
      icon: Camera,
      title: '撮るだけでOK',
      description: '写真を撮るだけでAIが自動認識。面倒な入力は一切不要です。',
    },
    {
      icon: Palette,
      title: 'アイコンに変身',
      description: 'どんなものも可愛いアイコンに自動変換。あなただけのコレクションが完成。',
    },
    {
      icon: Infinity,
      title: '無限にコレクション',
      description: '好きなものを好きなだけ集めましょう。制限なく、永遠にコレクション。',
    },
    {
      icon: Trophy,
      title: '実績・バッジを獲得',
      description: '集めれば集めるほどレベルアップ。レア度やバッジで楽しさ倍増。',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
          <Link
            href={session ? '/collection' : '/login'}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            {session ? 'コレクションへ' : 'はじめる'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full mb-8 border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              AIで自動アイコン生成
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 leading-tight">
            どんなものも
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              アイコンにして無限コレクション
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
            写真を撮るだけで、あなたの持ち物が可愛いアイコンに変身。
            <br className="hidden md:block" />
            好きなものを好きなだけ集めて、自分だけのコレクションを作ろう。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={session ? '/collection' : '/login'}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all"
            >
              <Zap className="w-5 h-5" />
              {session ? 'コレクションへ' : '無料ではじめる'}
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl font-semibold text-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              もっと詳しく
            </a>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto mt-16 px-4"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-orange-900/20 p-8 md:p-12">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                  className="aspect-square rounded-2xl bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center"
                >
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-xl ${
                      [
                        'bg-gradient-to-br from-red-400 to-pink-500',
                        'bg-gradient-to-br from-blue-400 to-cyan-500',
                        'bg-gradient-to-br from-green-400 to-emerald-500',
                        'bg-gradient-to-br from-yellow-400 to-orange-500',
                        'bg-gradient-to-br from-purple-400 to-violet-500',
                        'bg-gradient-to-br from-pink-400 to-rose-500',
                        'bg-gradient-to-br from-indigo-400 to-blue-500',
                        'bg-gradient-to-br from-teal-400 to-green-500',
                        'bg-gradient-to-br from-amber-400 to-yellow-500',
                        'bg-gradient-to-br from-fuchsia-400 to-purple-500',
                        'bg-gradient-to-br from-cyan-400 to-teal-500',
                        'bg-gradient-to-br from-rose-400 to-red-500',
                      ][i]
                    }`}
                  />
                </motion.div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white/50 dark:from-zinc-900/50 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              コレクションがもっと楽しくなる
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              モノコレクターの特徴をご紹介
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              かんたん3ステップ
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              すぐに始められます
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: '写真を撮る',
                description: 'コレクションしたいものをカメラで撮影',
              },
              {
                step: '2',
                title: 'AIが自動認識',
                description: '名前やカテゴリを自動で入力',
              },
              {
                step: '3',
                title: 'アイコン化して保存',
                description: 'かわいいアイコンに変換されてコレクション完了',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-6 p-6 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            今すぐコレクションを始めよう
          </h2>
          <p className="text-white/90 text-lg mb-8">
            無料で始められます。Googleアカウントですぐにスタート。
          </p>
          <Link
            href={session ? '/collection' : '/login'}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            {session ? 'コレクションへ' : '無料ではじめる'}
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
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
          <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-500">
            <Link
              href="/terms"
              className="hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
