// 無限コレクションシステム - ゲーミフィケーション要素
// 実績、レア度、バッジを管理

import { Item, Category } from './db';

// ========================================
// 実績システム（無限に拡張可能）
// ========================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  threshold: number;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary';
  category: 'items' | 'streak' | 'category' | 'special';
}

// アイテム数の実績（無限に拡張）
function generateItemAchievements(): Achievement[] {
  const tiers: { tier: Achievement['tier']; color: string }[] = [
    { tier: 'bronze', color: '🥉' },
    { tier: 'silver', color: '🥈' },
    { tier: 'gold', color: '🥇' },
    { tier: 'platinum', color: '💎' },
    { tier: 'diamond', color: '💠' },
    { tier: 'legendary', color: '🌟' },
  ];

  const milestones = [
    { threshold: 1, name: '初めての一歩', icon: '🌱' },
    { threshold: 10, name: 'コレクター見習い', icon: '🎯' },
    { threshold: 25, name: '熱心なコレクター', icon: '📋' },
    { threshold: 50, name: '整理整頓マスター', icon: '📦' },
    { threshold: 100, name: 'モノの魔術師', icon: '✨' },
    { threshold: 250, name: 'コレクター王', icon: '👑' },
    { threshold: 500, name: '伝説のコレクター', icon: '🏆' },
    { threshold: 1000, name: 'グランドマスター', icon: '🎖️' },
    { threshold: 2500, name: '究極のコレクター', icon: '🌠' },
    { threshold: 5000, name: '神話のコレクター', icon: '⭐' },
    { threshold: 10000, name: '∞コレクター', icon: '♾️' },
  ];

  return milestones.map((m, index) => ({
    id: `items-${m.threshold}`,
    name: m.name,
    description: `${m.threshold}アイテム達成`,
    threshold: m.threshold,
    icon: m.icon,
    tier: tiers[Math.min(Math.floor(index / 2), tiers.length - 1)].tier,
    category: 'items' as const,
  }));
}

// 連続日数の実績
function generateStreakAchievements(): Achievement[] {
  const milestones = [
    { threshold: 3, name: '3日坊主じゃない', icon: '🔥' },
    { threshold: 7, name: '1週間継続', icon: '📅' },
    { threshold: 14, name: '2週間の習慣', icon: '💪' },
    { threshold: 30, name: '1ヶ月マラソン', icon: '🏃' },
    { threshold: 60, name: '2ヶ月の執念', icon: '🎯' },
    { threshold: 100, name: '100日達成', icon: '💯' },
    { threshold: 365, name: '1年間のコミット', icon: '🎊' },
  ];

  return milestones.map((m, index) => ({
    id: `streak-${m.threshold}`,
    name: m.name,
    description: `${m.threshold}日連続でアイテム追加`,
    threshold: m.threshold,
    icon: m.icon,
    tier: (['bronze', 'bronze', 'silver', 'silver', 'gold', 'platinum', 'diamond'] as const)[index],
    category: 'streak' as const,
  }));
}

// カテゴリコンプリート実績
function generateCategoryAchievements(): Achievement[] {
  const milestones = [
    { threshold: 3, name: '多様性の始まり', icon: '🎨' },
    { threshold: 5, name: 'カテゴリマスター', icon: '📊' },
    { threshold: 10, name: 'オールラウンダー', icon: '🌈' },
    { threshold: 13, name: 'フルコンプリート', icon: '🎯' },
  ];

  return milestones.map((m, index) => ({
    id: `category-${m.threshold}`,
    name: m.name,
    description: `${m.threshold}カテゴリ以上でアイテム登録`,
    threshold: m.threshold,
    icon: m.icon,
    tier: (['bronze', 'silver', 'gold', 'platinum'] as const)[index],
    category: 'category' as const,
  }));
}

// 特殊実績
const specialAchievements: Achievement[] = [
  {
    id: 'special-first-week',
    name: '新人研修完了',
    description: '初週に10アイテム登録',
    threshold: 10,
    icon: '🎓',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-speed-collector',
    name: 'スピードコレクター',
    description: '1日に20アイテム登録',
    threshold: 20,
    icon: '⚡',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-night-owl',
    name: 'ナイトオウル',
    description: '深夜(0-4時)にアイテム登録',
    threshold: 1,
    icon: '🦉',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-early-bird',
    name: 'アーリーバード',
    description: '早朝(5-7時)にアイテム登録',
    threshold: 1,
    icon: '🐦',
    tier: 'bronze',
    category: 'special',
  },
];

// 全ての実績
export const allAchievements: Achievement[] = [
  ...generateItemAchievements(),
  ...generateStreakAchievements(),
  ...generateCategoryAchievements(),
  ...specialAchievements,
];

// ========================================
// レア度システム
// ========================================

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface RarityInfo {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  sparkle: boolean;
  probability: number;
}

export const rarityConfig: Record<Rarity, RarityInfo> = {
  common: {
    name: 'コモン',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    sparkle: false,
    probability: 0.6,
  },
  uncommon: {
    name: 'アンコモン',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    sparkle: false,
    probability: 0.25,
  },
  rare: {
    name: 'レア',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    sparkle: false,
    probability: 0.1,
  },
  epic: {
    name: 'エピック',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    sparkle: true,
    probability: 0.04,
  },
  legendary: {
    name: 'レジェンダリー',
    color: 'text-amber-500',
    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
    borderColor: 'border-amber-500',
    sparkle: true,
    probability: 0.01,
  },
};

// アイテム名からレア度を決定（ハッシュベース）
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function determineRarity(itemName: string, createdAt?: Date): Rarity {
  const hash = hashString(itemName);
  const dateBonus = createdAt ? (createdAt.getDate() % 7 === 0 ? 0.05 : 0) : 0; // 週末ボーナス
  const roll = (hash % 1000) / 1000 + dateBonus;

  if (roll >= 0.99) return 'legendary';
  if (roll >= 0.95) return 'epic';
  if (roll >= 0.85) return 'rare';
  if (roll >= 0.60) return 'uncommon';
  return 'common';
}

// ========================================
// コレクションバッジ
// ========================================

export interface CollectionBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (items: Item[], categories: Category[], streak: number) => boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

export const collectionBadges: CollectionBadge[] = [
  {
    id: 'badge-starter',
    name: 'スターター',
    description: 'コレクションを開始',
    icon: '🚀',
    condition: (items) => items.length >= 1,
    tier: 'bronze',
  },
  {
    id: 'badge-organizer',
    name: 'オーガナイザー',
    description: '5つのカテゴリを使用',
    icon: '📁',
    condition: (items) => new Set(items.map(i => i.category)).size >= 5,
    tier: 'silver',
  },
  {
    id: 'badge-photographer',
    name: 'フォトグラファー',
    description: '全アイテムに画像を登録',
    icon: '📸',
    condition: (items) => items.length >= 10 && items.every(i => i.image),
    tier: 'gold',
  },
  {
    id: 'badge-detailer',
    name: 'ディテーラー',
    description: '全アイテムにメモを追加',
    icon: '📝',
    condition: (items) => items.length >= 10 && items.every(i => i.notes && i.notes.length > 0),
    tier: 'gold',
  },
  {
    id: 'badge-location-master',
    name: 'ロケーションマスター',
    description: '10種類以上の保管場所を使用',
    icon: '📍',
    condition: (items) => new Set(items.filter(i => i.location).map(i => i.location)).size >= 10,
    tier: 'gold',
  },
  {
    id: 'badge-dedicated',
    name: '献身的コレクター',
    description: '7日連続でアイテム追加',
    icon: '🔥',
    condition: (_, __, streak) => streak >= 7,
    tier: 'silver',
  },
  {
    id: 'badge-monthly-warrior',
    name: '月間ウォリアー',
    description: '30日連続でアイテム追加',
    icon: '⚔️',
    condition: (_, __, streak) => streak >= 30,
    tier: 'platinum',
  },
  {
    id: 'badge-century',
    name: 'センチュリー',
    description: '100アイテム達成',
    icon: '💯',
    condition: (items) => items.length >= 100,
    tier: 'gold',
  },
  {
    id: 'badge-millennium',
    name: 'ミレニアム',
    description: '1000アイテム達成',
    icon: '🌟',
    condition: (items) => items.length >= 1000,
    tier: 'diamond',
  },
  {
    id: 'badge-perfectionist',
    name: 'パーフェクショニスト',
    description: '全カテゴリにアイテム登録',
    icon: '✅',
    condition: (items, categories) => {
      const usedCategories = new Set(items.map(i => i.category));
      return categories.every(c => usedCategories.has(c.id));
    },
    tier: 'platinum',
  },
];

// ========================================
// レベルシステム
// ========================================

export interface LevelInfo {
  level: number;
  title: string;
  minExp: number;
  maxExp: number;
  icon: string;
}

// 経験値計算
export function calculateExp(items: Item[], streak: number, badges: string[]): number {
  let exp = 0;

  // アイテム追加で経験値
  exp += items.length * 10;

  // レア度ボーナス
  items.forEach(item => {
    const rarity = determineRarity(item.name, item.createdAt);
    switch (rarity) {
      case 'uncommon': exp += 5; break;
      case 'rare': exp += 15; break;
      case 'epic': exp += 50; break;
      case 'legendary': exp += 200; break;
    }
  });

  // ストリークボーナス
  exp += streak * streak * 2;

  // バッジボーナス
  exp += badges.length * 100;

  return exp;
}

// レベルを計算（無限レベル対応）
export function calculateLevel(exp: number): LevelInfo {
  const titles = [
    { level: 1, title: 'ビギナー', icon: '🌱' },
    { level: 5, title: 'アマチュア', icon: '🌿' },
    { level: 10, title: 'コレクター', icon: '🎯' },
    { level: 20, title: 'ベテラン', icon: '⭐' },
    { level: 30, title: 'エキスパート', icon: '🌟' },
    { level: 50, title: 'マスター', icon: '💫' },
    { level: 75, title: 'グランドマスター', icon: '🏆' },
    { level: 100, title: 'レジェンド', icon: '👑' },
    { level: 150, title: 'ミシック', icon: '🔱' },
    { level: 200, title: '∞コレクター', icon: '♾️' },
  ];

  // レベル計算（経験値の平方根ベース）
  const level = Math.floor(Math.sqrt(exp / 50)) + 1;

  // 現在レベルの経験値範囲
  const minExp = Math.pow(level - 1, 2) * 50;
  const maxExp = Math.pow(level, 2) * 50;

  // タイトルを決定
  let currentTitle = titles[0];
  for (const t of titles) {
    if (level >= t.level) {
      currentTitle = t;
    } else {
      break;
    }
  }

  return {
    level,
    title: currentTitle.title,
    minExp,
    maxExp,
    icon: currentTitle.icon,
  };
}

// ========================================
// 統計・分析
// ========================================

export interface CollectionStats {
  totalItems: number;
  totalExp: number;
  level: LevelInfo;
  streak: number;
  rarityBreakdown: Record<Rarity, number>;
  categoryBreakdown: { category: string; count: number; icon: string }[];
  unlockedAchievements: Achievement[];
  unlockedBadges: CollectionBadge[];
  nextAchievements: Achievement[];
}

export function calculateCollectionStats(
  items: Item[],
  categories: Category[],
  streak: number
): CollectionStats {
  // レア度の内訳
  const rarityBreakdown: Record<Rarity, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  };

  items.forEach(item => {
    const rarity = determineRarity(item.name, item.createdAt);
    rarityBreakdown[rarity]++;
  });

  // カテゴリの内訳
  const categoryMap = new Map<string, number>();
  items.forEach(item => {
    categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
  });

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([catId, count]) => {
      const cat = categories.find(c => c.id === catId);
      return { category: cat?.name || catId, count, icon: cat?.icon || '📦' };
    })
    .sort((a, b) => b.count - a.count);

  // 解除済み実績
  const categoriesWithItems = new Set(items.map(i => i.category)).size;
  const unlockedAchievements = allAchievements.filter(a => {
    switch (a.category) {
      case 'items':
        return items.length >= a.threshold;
      case 'streak':
        return streak >= a.threshold;
      case 'category':
        return categoriesWithItems >= a.threshold;
      case 'special':
        // 特殊実績は個別判定が必要（簡易版）
        return false;
      default:
        return false;
    }
  });

  // 解除済みバッジ
  const unlockedBadges = collectionBadges.filter(b =>
    b.condition(items, categories, streak)
  );

  // 次の実績
  const nextAchievements = allAchievements
    .filter(a => !unlockedAchievements.includes(a))
    .slice(0, 3);

  // 経験値とレベル
  const badges = unlockedBadges.map(b => b.id);
  const totalExp = calculateExp(items, streak, badges);
  const level = calculateLevel(totalExp);

  return {
    totalItems: items.length,
    totalExp,
    level,
    streak,
    rarityBreakdown,
    categoryBreakdown,
    unlockedAchievements,
    unlockedBadges,
    nextAchievements,
  };
}
