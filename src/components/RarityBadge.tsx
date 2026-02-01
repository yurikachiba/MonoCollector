'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Rarity, rarityConfig, determineRarity } from '@/lib/collection-system';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function RarityBadge({ rarity, size = 'sm', showLabel = false }: RarityBadgeProps) {
  const config = rarityConfig[rarity];

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${config.bgColor} ${config.color} border ${config.borderColor}
        ${sizeClasses[size]}
      `}
    >
      {config.sparkle && (
        <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      )}
      {showLabel ? config.name : rarity.charAt(0).toUpperCase()}
    </motion.span>
  );
}

// アイテム名からレア度バッジを表示
interface ItemRarityBadgeProps {
  itemName: string;
  createdAt?: Date;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ItemRarityBadge({ itemName, createdAt, size = 'sm', showLabel = false }: ItemRarityBadgeProps) {
  const rarity = determineRarity(itemName, createdAt);

  // コモンは表示しない（オプション）
  if (rarity === 'common' && !showLabel) {
    return null;
  }

  return <RarityBadge rarity={rarity} size={size} showLabel={showLabel} />;
}

// レア度の内訳表示
interface RarityBreakdownProps {
  breakdown: Record<Rarity, number>;
}

export function RarityBreakdown({ breakdown }: RarityBreakdownProps) {
  const rarities: Rarity[] = ['legendary', 'epic', 'rare', 'uncommon', 'common'];

  return (
    <div className="space-y-2">
      {rarities.map(rarity => {
        const count = breakdown[rarity];
        if (count === 0) return null;

        const config = rarityConfig[rarity];
        const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={rarity} className="flex items-center gap-2">
            <RarityBadge rarity={rarity} size="md" showLabel />
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full ${config.bgColor}`}
                style={{
                  background: rarity === 'legendary'
                    ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                    : rarity === 'epic'
                    ? 'linear-gradient(90deg, #8b5cf6, #a855f7)'
                    : undefined,
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
