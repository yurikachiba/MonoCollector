'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Tag, Clock, Sparkles } from 'lucide-react';
import { useItems } from '@/hooks/useItems';

// コレクション価値のナラティブを生成
function generateNarrative(stats: {
  totalItems: number;
  uniqueLocations: number;
  uniqueTags: number;
  uniqueCategories: number;
  daysSinceFirst: number;
  streakDays: number;
}): string {
  const { totalItems, uniqueLocations, daysSinceFirst } = stats;

  if (totalItems >= 20) {
    return `${daysSinceFirst}日間で${totalItems}の思い出。${uniqueLocations}つの場所を巡るあなただけの物語です`;
  }
  if (totalItems >= 10) {
    return `${uniqueLocations}つの場所から${totalItems}の思い出を集めました。素敵なコレクションが育っています`;
  }
  if (totalItems >= 5) {
    return `あなたのコレクションが形になってきました。続ければ続けるほど、振り返りが楽しくなります`;
  }
  return `コレクションを始めて${daysSinceFirst > 0 ? daysSinceFirst + '日' : '今日'}。ここからが楽しくなります`;
}

export default function CollectionValueCard() {
  const { data: items = [], isFetched } = useItems();

  const stats = useMemo(() => {
    if (items.length === 0) return null;

    const locations = new Set(items.filter((i) => i.location).map((i) => i.location));
    const tags = new Set(items.flatMap((i) => i.tags));
    const categories = new Set(items.map((i) => i.category));

    const sorted = [...items].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const firstDate = new Date(sorted[0].createdAt);
    const now = new Date();
    const daysSinceFirst = Math.max(
      0,
      Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    // ストリーク計算
    const today = now;
    let streakDays = 0;
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toDateString();
      if (items.some((item) => new Date(item.createdAt).toDateString() === dateStr)) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      totalItems: items.length,
      uniqueLocations: locations.size,
      uniqueTags: tags.size,
      uniqueCategories: categories.size,
      daysSinceFirst,
      streakDays,
    };
  }, [items]);

  // 5件以上で表示
  if (!isFetched || !stats || items.length < 5) return null;

  const narrative = generateNarrative(stats);

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 mb-3"
    >
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden shadow-lg">
        {/* 背景パターン */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 w-20 h-20 border border-white rounded-full" />
          <div className="absolute bottom-3 right-8 w-14 h-14 border border-white rounded-full" />
          <div className="absolute top-8 right-4 w-8 h-8 border border-white rounded-full" />
        </div>

        <div className="relative px-5 py-4">
          {/* ナラティブ */}
          <div className="flex items-start gap-3 mb-4">
            <div className="p-1.5 bg-white/20 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              {narrative}
            </p>
          </div>

          {/* 統計グリッド */}
          <div className="grid grid-cols-4 gap-2">
            <ValueStat
              icon={<Heart className="w-3.5 h-3.5" />}
              value={stats.totalItems}
              label="思い出"
            />
            <ValueStat
              icon={<MapPin className="w-3.5 h-3.5" />}
              value={stats.uniqueLocations}
              label="場所"
            />
            <ValueStat
              icon={<Tag className="w-3.5 h-3.5" />}
              value={stats.uniqueTags}
              label="タグ"
            />
            <ValueStat
              icon={<Clock className="w-3.5 h-3.5" />}
              value={stats.daysSinceFirst}
              label="日間"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ValueStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="text-center bg-white/10 rounded-xl py-2 px-1">
      <div className="flex justify-center text-white/70 mb-0.5">{icon}</div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] text-white/60">{label}</p>
    </div>
  );
}
