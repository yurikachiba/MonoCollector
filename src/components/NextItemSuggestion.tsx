'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, ChevronRight, Lightbulb, X } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { useOnboardingStore } from './OnboardingTutorial';

// 場所ごとの提案メッセージ
const LOCATION_SUGGESTIONS: Record<string, { prompt: string; examples: string[] }> = {
  'キッチン': {
    prompt: 'キッチンには他にも大切なモノがありそう',
    examples: ['お気に入りのマグカップ', '思い出の食器', 'いつもの調理器具'],
  },
  'リビング': {
    prompt: 'リビングをもう少し記録してみませんか？',
    examples: ['いつものクッション', 'お気に入りの雑貨', 'リモコンの定位置'],
  },
  '子供部屋': {
    prompt: '子供部屋の宝物をもっと記録しよう',
    examples: ['お気に入りのおもちゃ', '手作り作品', '絵本'],
  },
  'デスク': {
    prompt: 'デスク周りにも記録したいモノは？',
    examples: ['お気に入りのペン', 'デスクグッズ', '仕事の相棒'],
  },
  '洗面所': {
    prompt: '洗面所のお気に入りも残しておこう',
    examples: ['愛用のスキンケア', 'タオル', '歯ブラシスタンド'],
  },
};

// カテゴリごとの提案
const CATEGORY_SUGGESTIONS: Record<string, { prompt: string; examples: string[] }> = {
  'food': {
    prompt: '他にもお気に入りの食品は？',
    examples: ['定番の調味料', '好きなお菓子', 'リピート食材'],
  },
  'kitchen': {
    prompt: 'キッチン用品をもっと記録しよう',
    examples: ['鍋やフライパン', 'お気に入りの食器', '便利なキッチンツール'],
  },
  'toys': {
    prompt: 'おもちゃ・ホビー、他にもあるかも',
    examples: ['コレクションのフィギュア', 'ぬいぐるみ', 'ゲーム'],
  },
  'electronics': {
    prompt: 'ガジェット好きですね！他にも記録を',
    examples: ['充電器', 'イヤホン', 'スマートデバイス'],
  },
  'clothes': {
    prompt: 'お気に入りの服をもっと記録',
    examples: ['定番の一着', 'アクセサリー', 'バッグ'],
  },
};

// 汎用的な提案メッセージ
const GENERIC_SUGGESTIONS = [
  {
    prompt: '近くにもう1つ、大切なモノがありませんか？',
    examples: ['いつも使うもの', '思い出の品', 'お気に入りのアイテム'],
  },
  {
    prompt: '「ついでにもう1つ」が、後から見返す楽しさになります',
    examples: ['身の回りのもの', '今日使ったもの', '目の前にあるもの'],
  },
];

interface NextItemSuggestionProps {
  onAddItem: () => void;
}

export default function NextItemSuggestion({ onAddItem }: NextItemSuggestionProps) {
  const { data: items = [], isFetched } = useItems();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { isActive: isOnboarding, waitingForRegistration } = useOnboardingStore();

  // 直近のアイテムから場所・カテゴリを取得して提案を生成
  const suggestion = useMemo(() => {
    if (items.length === 0) return null;

    const latestItem = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    // まず場所ベースの提案
    if (latestItem.location) {
      const locationSuggestion = LOCATION_SUGGESTIONS[latestItem.location];
      if (locationSuggestion) {
        return {
          type: 'location' as const,
          label: latestItem.location,
          ...locationSuggestion,
        };
      }
    }

    // 次にカテゴリベースの提案
    const categorySuggestion = CATEGORY_SUGGESTIONS[latestItem.category];
    if (categorySuggestion) {
      return {
        type: 'category' as const,
        label: latestItem.category,
        ...categorySuggestion,
      };
    }

    // 汎用提案
    const generic = GENERIC_SUGGESTIONS[Math.floor(Math.random() * GENERIC_SUGGESTIONS.length)];
    return {
      type: 'generic' as const,
      label: '',
      ...generic,
    };
  }, [items]);

  useEffect(() => {
    if (!isFetched) return;
    // 1〜4件の間だけ表示（5件以降はマイルストーンで十分カバー）
    if (items.length < 1 || items.length > 4) return;

    // セッション内で閉じた場合はスキップ
    const sessionKey = `nextItemSuggestion_dismissed_${items.length}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [items.length, isFetched]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    const sessionKey = `nextItemSuggestion_dismissed_${items.length}`;
    sessionStorage.setItem(sessionKey, 'true');
  };

  const handleAddItem = () => {
    handleDismiss();
    onAddItem();
  };

  if (isOnboarding || waitingForRegistration) return null;
  if (isDismissed || !isVisible || !suggestion) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="px-4 mb-3"
      >
        <div className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-amber-200/60 dark:border-amber-800/30 overflow-hidden">
          {/* 閉じるボタン */}
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 p-1.5 text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 rounded-lg hover:bg-amber-100/50 dark:hover:bg-amber-800/30 transition-colors z-10"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="px-4 py-3">
            {/* メインメッセージ */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-amber-100 dark:bg-amber-800/30 rounded-lg shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {suggestion.prompt}
                </p>
                {suggestion.type === 'location' && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      {suggestion.label}で登録
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 例の表示 */}
            <div className="flex flex-wrap gap-1.5 mt-2 ml-9">
              {suggestion.examples.map((example) => (
                <span
                  key={example}
                  className="text-xs px-2 py-0.5 bg-amber-100/60 dark:bg-amber-800/20 text-amber-700 dark:text-amber-300 rounded-full"
                >
                  {example}
                </span>
              ))}
            </div>

            {/* アクションボタン */}
            <button
              onClick={handleAddItem}
              className="mt-3 ml-9 flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors group"
            >
              <Plus className="w-4 h-4" />
              <span>もう1つ登録する</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
