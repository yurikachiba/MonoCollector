'use client';

import Image from 'next/image';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Image
            src="/icon.svg"
            alt="モノコレクター"
            width={80}
            height={80}
            className="mx-auto rounded-2xl shadow-lg"
          />
        </div>

        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
          <WifiOff className="w-10 h-10 text-purple-500" />
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          オフラインです
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          インターネット接続を確認して、
          <br />
          もう一度お試しください。
        </p>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          再読み込み
        </button>

        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
          接続が回復すると自動的に復帰します
        </p>
      </div>
    </div>
  );
}
