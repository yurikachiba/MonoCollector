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
    { threshold: 2, name: '継続は力なり', icon: '✊', tier: 'bronze' as const },
    { threshold: 3, name: '3日坊主じゃない', icon: '🔥', tier: 'bronze' as const },
    { threshold: 5, name: '5日達成', icon: '🖐️', tier: 'bronze' as const },
    { threshold: 7, name: '1週間継続', icon: '📅', tier: 'bronze' as const },
    { threshold: 10, name: '10日連続', icon: '🔟', tier: 'silver' as const },
    { threshold: 14, name: '2週間の習慣', icon: '💪', tier: 'silver' as const },
    { threshold: 21, name: '3週間チャレンジ', icon: '🎯', tier: 'silver' as const },
    { threshold: 30, name: '1ヶ月マラソン', icon: '🏃', tier: 'gold' as const },
    { threshold: 45, name: '45日ストリーク', icon: '⭐', tier: 'gold' as const },
    { threshold: 60, name: '2ヶ月の執念', icon: '🌟', tier: 'gold' as const },
    { threshold: 90, name: '3ヶ月マスター', icon: '🏅', tier: 'platinum' as const },
    { threshold: 100, name: '100日達成', icon: '💯', tier: 'platinum' as const },
    { threshold: 150, name: '150日レジェンド', icon: '🎖️', tier: 'platinum' as const },
    { threshold: 180, name: '半年ストリーク', icon: '🌙', tier: 'diamond' as const },
    { threshold: 200, name: '200日神話', icon: '🔱', tier: 'diamond' as const },
    { threshold: 250, name: '250日伝説', icon: '⚡', tier: 'diamond' as const },
    { threshold: 300, name: '300日クエスト', icon: '🗡️', tier: 'diamond' as const },
    { threshold: 365, name: '1年間のコミット', icon: '🎊', tier: 'legendary' as const },
    { threshold: 500, name: '500日の偉業', icon: '🏆', tier: 'legendary' as const },
    { threshold: 730, name: '2年間の奇跡', icon: '👑', tier: 'legendary' as const },
    { threshold: 1000, name: '1000日の神話', icon: '♾️', tier: 'legendary' as const },
  ];

  return milestones.map((m) => ({
    id: `streak-${m.threshold}`,
    name: m.name,
    description: `${m.threshold}日連続でアイテム追加`,
    threshold: m.threshold,
    icon: m.icon,
    tier: m.tier,
    category: 'streak' as const,
  }));
}

// カテゴリコンプリート実績
function generateCategoryAchievements(): Achievement[] {
  const milestones = [
    { threshold: 2, name: 'デュアルコレクター', icon: '✌️', tier: 'bronze' as const },
    { threshold: 3, name: '多様性の始まり', icon: '🎨', tier: 'bronze' as const },
    { threshold: 4, name: 'クアッドカテゴリ', icon: '🍀', tier: 'bronze' as const },
    { threshold: 5, name: 'カテゴリマスター', icon: '📊', tier: 'silver' as const },
    { threshold: 6, name: 'ハーフウェイ', icon: '🎯', tier: 'silver' as const },
    { threshold: 7, name: 'セブンスター', icon: '⭐', tier: 'silver' as const },
    { threshold: 8, name: 'オクタゴン', icon: '🔷', tier: 'gold' as const },
    { threshold: 10, name: 'オールラウンダー', icon: '🌈', tier: 'gold' as const },
    { threshold: 12, name: 'ダズンコレクター', icon: '🎖️', tier: 'platinum' as const },
    { threshold: 13, name: 'フルコンプリート', icon: '👑', tier: 'diamond' as const },
  ];

  return milestones.map((m) => ({
    id: `category-${m.threshold}`,
    name: m.name,
    description: `${m.threshold}カテゴリ以上でアイテム登録`,
    threshold: m.threshold,
    icon: m.icon,
    tier: m.tier,
    category: 'category' as const,
  }));
}

// 特殊実績
const specialAchievements: Achievement[] = [
  // === 時間帯系 ===
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
  {
    id: 'special-lunch-time',
    name: 'ランチタイムコレクター',
    description: '昼休み(12-13時)にアイテム登録',
    threshold: 1,
    icon: '🍱',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-midnight',
    name: 'ミッドナイトコレクター',
    description: '深夜0時ちょうどにアイテム登録',
    threshold: 1,
    icon: '🌙',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-night-master',
    name: '夜行性マスター',
    description: '深夜に50アイテム登録',
    threshold: 50,
    icon: '🌃',
    tier: 'gold',
    category: 'special',
  },
  // === 季節・イベント系 ===
  {
    id: 'special-new-year',
    name: '新年の誓い',
    description: '1月1日にアイテム登録',
    threshold: 1,
    icon: '🎍',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-valentines',
    name: 'バレンタインコレクター',
    description: '2月14日にアイテム登録',
    threshold: 1,
    icon: '💝',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-white-day',
    name: 'ホワイトデーコレクター',
    description: '3月14日にアイテム登録',
    threshold: 1,
    icon: '🤍',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-cherry-blossom',
    name: '桜の季節',
    description: '4月にアイテム登録',
    threshold: 1,
    icon: '🌸',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-golden-week',
    name: 'ゴールデンウィーク',
    description: 'GW期間(5/3-5/5)にアイテム登録',
    threshold: 1,
    icon: '🎌',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-tanabata',
    name: '七夕コレクター',
    description: '7月7日にアイテム登録',
    threshold: 1,
    icon: '🎋',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-summer',
    name: 'サマーコレクター',
    description: '8月にアイテム登録',
    threshold: 1,
    icon: '🏖️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-halloween',
    name: 'ハロウィンコレクター',
    description: '10月31日にアイテム登録',
    threshold: 1,
    icon: '🎃',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-christmas-eve',
    name: 'クリスマスイブ',
    description: '12月24日にアイテム登録',
    threshold: 1,
    icon: '🎄',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-christmas',
    name: 'クリスマスコレクター',
    description: '12月25日にアイテム登録',
    threshold: 1,
    icon: '🎅',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-year-end',
    name: '大晦日コレクター',
    description: '12月31日にアイテム登録',
    threshold: 1,
    icon: '🔔',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-seasonal-master',
    name: 'シーズナルマスター',
    description: '全季節(春夏秋冬)にアイテム登録',
    threshold: 4,
    icon: '🍂',
    tier: 'gold',
    category: 'special',
  },
  // === スピード・ボリューム系 ===
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
    id: 'special-hyper-collector',
    name: 'ハイパーコレクター',
    description: '1日に50アイテム登録',
    threshold: 50,
    icon: '🚀',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-marathon-collector',
    name: 'マラソンコレクター',
    description: '1日に100アイテム登録',
    threshold: 100,
    icon: '🏃‍♂️',
    tier: 'diamond',
    category: 'special',
  },
  {
    id: 'special-burst-mode',
    name: 'バーストモード',
    description: '1時間に10アイテム登録',
    threshold: 10,
    icon: '💥',
    tier: 'silver',
    category: 'special',
  },
  // === 曜日系 ===
  {
    id: 'special-weekend-warrior',
    name: 'ウィークエンドウォリアー',
    description: '週末(土日)に10アイテム登録',
    threshold: 10,
    icon: '🗓️',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-monday-fighter',
    name: '月曜ファイター',
    description: '月曜日に10アイテム登録',
    threshold: 10,
    icon: '💪',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-friday-collector',
    name: 'フライデーコレクター',
    description: '金曜日に10アイテム登録',
    threshold: 10,
    icon: '🎉',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-weekday-master',
    name: '平日マスター',
    description: '全平日(月-金)にアイテム登録',
    threshold: 5,
    icon: '📊',
    tier: 'gold',
    category: 'special',
  },
  // === レア度系 ===
  {
    id: 'special-rare-finder',
    name: 'レアファインダー',
    description: 'レアアイテムを10個獲得',
    threshold: 10,
    icon: '🔍',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-epic-hunter',
    name: 'エピックハンター',
    description: 'エピックアイテムを5個獲得',
    threshold: 5,
    icon: '🎯',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-legendary-seeker',
    name: 'レジェンダリーシーカー',
    description: 'レジェンダリーアイテムを1個獲得',
    threshold: 1,
    icon: '⭐',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-legendary-collector',
    name: 'レジェンダリーコレクター',
    description: 'レジェンダリーアイテムを5個獲得',
    threshold: 5,
    icon: '🌟',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-legendary-master',
    name: 'レジェンダリーマスター',
    description: 'レジェンダリーアイテムを10個獲得',
    threshold: 10,
    icon: '👑',
    tier: 'diamond',
    category: 'special',
  },
  {
    id: 'special-rarity-rainbow',
    name: 'レアリティレインボー',
    description: '全レア度のアイテムを1個以上所持',
    threshold: 5,
    icon: '🌈',
    tier: 'gold',
    category: 'special',
  },
  // === データ充実系 ===
  {
    id: 'special-memo-writer',
    name: 'メモライター',
    description: 'メモ付きアイテム10個登録',
    threshold: 10,
    icon: '📝',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-memo-master',
    name: 'メモマスター',
    description: 'メモ付きアイテム50個登録',
    threshold: 50,
    icon: '📔',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-novelist',
    name: 'ノベリスト',
    description: '100文字以上のメモを10個作成',
    threshold: 10,
    icon: '📖',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-photographer-starter',
    name: 'フォトグラファー見習い',
    description: '画像付きアイテム10個登録',
    threshold: 10,
    icon: '📷',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-photographer-pro',
    name: 'プロフォトグラファー',
    description: '画像付きアイテム50個登録',
    threshold: 50,
    icon: '📸',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-photographer-legend',
    name: 'フォトレジェンド',
    description: '画像付きアイテム100個登録',
    threshold: 100,
    icon: '🎬',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-location-tracker',
    name: 'ロケーショントラッカー',
    description: '保管場所を5種類使用',
    threshold: 5,
    icon: '📍',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-location-expert',
    name: 'ロケーションエキスパート',
    description: '保管場所を20種類使用',
    threshold: 20,
    icon: '🗺️',
    tier: 'silver',
    category: 'special',
  },
  // === 特殊条件系 ===
  {
    id: 'special-palindrome',
    name: 'パリンドローム',
    description: '回文の名前のアイテムを登録',
    threshold: 1,
    icon: '🔄',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-long-name',
    name: 'ロングネーム',
    description: '20文字以上の名前のアイテムを登録',
    threshold: 1,
    icon: '📏',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-short-name',
    name: 'ミニマリスト',
    description: '1文字の名前のアイテムを登録',
    threshold: 1,
    icon: '✂️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-same-day',
    name: 'アニバーサリー',
    description: '登録開始日と同じ日付に1年後アイテム登録',
    threshold: 1,
    icon: '🎂',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-number-lover',
    name: 'ナンバーラバー',
    description: '数字のみの名前のアイテムを登録',
    threshold: 1,
    icon: '🔢',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-emoji-user',
    name: '絵文字マスター',
    description: '絵文字を含む名前のアイテムを登録',
    threshold: 1,
    icon: '😊',
    tier: 'bronze',
    category: 'special',
  },
  // === 長期継続系 ===
  {
    id: 'special-veteran',
    name: 'ベテランユーザー',
    description: '登録から3ヶ月継続',
    threshold: 90,
    icon: '🏅',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-loyal-user',
    name: 'ロイヤルユーザー',
    description: '登録から6ヶ月継続',
    threshold: 180,
    icon: '💎',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-anniversary',
    name: '1周年記念',
    description: '登録から1年継続',
    threshold: 365,
    icon: '🎊',
    tier: 'diamond',
    category: 'special',
  },
  {
    id: 'special-two-years',
    name: '2周年記念',
    description: '登録から2年継続',
    threshold: 730,
    icon: '🏆',
    tier: 'legendary',
    category: 'special',
  },
  // === タグ系実績 ===
  {
    id: 'special-tag-beginner',
    name: 'タグビギナー',
    description: 'タグ付きアイテムを5個登録',
    threshold: 5,
    icon: '🏷️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-tag-enthusiast',
    name: 'タグエンスージアスト',
    description: 'タグ付きアイテムを25個登録',
    threshold: 25,
    icon: '🔖',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-tag-pro',
    name: 'タグプロ',
    description: 'タグ付きアイテムを100個登録',
    threshold: 100,
    icon: '📑',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-tag-variety-10',
    name: 'タグバラエティ10',
    description: '10種類のユニークなタグを使用',
    threshold: 10,
    icon: '🎨',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-tag-variety-30',
    name: 'タグバラエティ30',
    description: '30種類のユニークなタグを使用',
    threshold: 30,
    icon: '🎭',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-tag-variety-50',
    name: 'タグマスター',
    description: '50種類のユニークなタグを使用',
    threshold: 50,
    icon: '🌈',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-multi-tag-master',
    name: 'マルチタグマスター',
    description: '5つ以上のタグを持つアイテムを10個登録',
    threshold: 10,
    icon: '🎴',
    tier: 'gold',
    category: 'special',
  },
  // === 時間帯系追加実績 ===
  {
    id: 'special-dawn-patrol',
    name: 'ドーンパトロール',
    description: '早朝(4-6時)にアイテム登録',
    threshold: 1,
    icon: '🌄',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-morning-person',
    name: 'モーニングパーソン',
    description: '朝(6-9時)に30アイテム登録',
    threshold: 30,
    icon: '☕',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-afternoon-pro',
    name: 'アフタヌーンプロ',
    description: '午後(12-17時)に50アイテム登録',
    threshold: 50,
    icon: '☀️',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-twilight-zone',
    name: 'トワイライトゾーン',
    description: '夕暮れ(17-19時)に20アイテム登録',
    threshold: 20,
    icon: '🌅',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-night-shift',
    name: 'ナイトシフト',
    description: '夜(21-24時)に50アイテム登録',
    threshold: 50,
    icon: '🌃',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-24h-collector',
    name: '24時間コレクター',
    description: '1日の全時間帯(朝昼夕夜深夜)でアイテム登録',
    threshold: 5,
    icon: '🕐',
    tier: 'platinum',
    category: 'special',
  },
  // === 曜日系追加実績 ===
  {
    id: 'special-tuesday-collector',
    name: 'チューズデーコレクター',
    description: '火曜日に10アイテム登録',
    threshold: 10,
    icon: '🔥',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-wednesday-collector',
    name: 'ウェンズデーコレクター',
    description: '水曜日に10アイテム登録',
    threshold: 10,
    icon: '💧',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-thursday-collector',
    name: 'サーズデーコレクター',
    description: '木曜日に10アイテム登録',
    threshold: 10,
    icon: '🌲',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-saturday-star',
    name: 'サタデースター',
    description: '土曜日に30アイテム登録',
    threshold: 30,
    icon: '⭐',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-sunday-chiller',
    name: 'サンデーチラー',
    description: '日曜日に30アイテム登録',
    threshold: 30,
    icon: '😌',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-weekday-warrior',
    name: 'ウィークデイウォリアー',
    description: '平日に100アイテム登録',
    threshold: 100,
    icon: '💼',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-weekend-hero',
    name: 'ウィークエンドヒーロー',
    description: '週末に100アイテム登録',
    threshold: 100,
    icon: '🦸',
    tier: 'platinum',
    category: 'special',
  },
  // === 季節・イベント追加実績 ===
  {
    id: 'special-spring-bloom',
    name: 'スプリングブルーム',
    description: '春(3-5月)に50アイテム登録',
    threshold: 50,
    icon: '🌷',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-summer-heat',
    name: 'サマーヒート',
    description: '夏(6-8月)に50アイテム登録',
    threshold: 50,
    icon: '🌊',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-autumn-harvest',
    name: 'オータムハーベスト',
    description: '秋(9-11月)に50アイテム登録',
    threshold: 50,
    icon: '🎃',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-winter-wonder',
    name: 'ウィンターワンダー',
    description: '冬(12-2月)に50アイテム登録',
    threshold: 50,
    icon: '⛄',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-girls-day',
    name: 'ひな祭りコレクター',
    description: '3月3日にアイテム登録',
    threshold: 1,
    icon: '🎎',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-boys-day',
    name: 'こどもの日コレクター',
    description: '5月5日にアイテム登録',
    threshold: 1,
    icon: '🎏',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-obon',
    name: 'お盆コレクター',
    description: '8月13-15日にアイテム登録',
    threshold: 1,
    icon: '🏮',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-autumn-equinox',
    name: '秋分の日コレクター',
    description: '9月23日にアイテム登録',
    threshold: 1,
    icon: '🍁',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-sports-day',
    name: 'スポーツの日コレクター',
    description: '10月第2月曜日にアイテム登録',
    threshold: 1,
    icon: '🏅',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-culture-day',
    name: '文化の日コレクター',
    description: '11月3日にアイテム登録',
    threshold: 1,
    icon: '🎨',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-labor-thanksgiving',
    name: '勤労感謝の日コレクター',
    description: '11月23日にアイテム登録',
    threshold: 1,
    icon: '🙏',
    tier: 'silver',
    category: 'special',
  },
  // === 数値・マイルストーン系実績 ===
  {
    id: 'special-lucky-number-7',
    name: 'ラッキー7',
    description: '7の倍数のアイテム数達成(7,14,21...)',
    threshold: 7,
    icon: '🎰',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-lucky-number-77',
    name: 'ダブルラッキー',
    description: '77アイテム達成',
    threshold: 77,
    icon: '🍀',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-lucky-number-777',
    name: 'トリプルラッキー',
    description: '777アイテム達成',
    threshold: 777,
    icon: '🎲',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-hundred-club',
    name: 'ハンドレッドクラブ',
    description: '100アイテム達成',
    threshold: 100,
    icon: '💯',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-triple-digits',
    name: 'トリプルディジット',
    description: '111アイテム達成',
    threshold: 111,
    icon: '1️⃣',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-double-hundred',
    name: 'ダブルハンドレッド',
    description: '200アイテム達成',
    threshold: 200,
    icon: '✌️',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-triple-hundred',
    name: 'トリプルハンドレッド',
    description: '300アイテム達成',
    threshold: 300,
    icon: '3️⃣',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-half-k',
    name: 'ハーフK',
    description: '500アイテム達成',
    threshold: 500,
    icon: '🎯',
    tier: 'gold',
    category: 'special',
  },
  // === チャレンジ系実績 ===
  {
    id: 'special-daily-5',
    name: 'デイリー5',
    description: '1日に5アイテム登録を3日連続',
    threshold: 15,
    icon: '📊',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-daily-10-streak',
    name: 'デイリー10ストリーク',
    description: '1日に10アイテム登録を3日連続',
    threshold: 30,
    icon: '📈',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-power-hour',
    name: 'パワーアワー',
    description: '1時間に20アイテム登録',
    threshold: 20,
    icon: '⚡',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-super-sprint',
    name: 'スーパースプリント',
    description: '30分に15アイテム登録',
    threshold: 15,
    icon: '🏃',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-consistency-king',
    name: 'コンシステンシーキング',
    description: '30日連続で毎日1アイテム以上登録',
    threshold: 30,
    icon: '👑',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-consistency-emperor',
    name: 'コンシステンシーエンペラー',
    description: '60日連続で毎日1アイテム以上登録',
    threshold: 60,
    icon: '🏛️',
    tier: 'platinum',
    category: 'special',
  },
  // === レア度追加実績 ===
  {
    id: 'special-common-century',
    name: 'コモンセンチュリー',
    description: 'コモンアイテムを100個獲得',
    threshold: 100,
    icon: '📦',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-uncommon-50',
    name: 'アンコモン50',
    description: 'アンコモンアイテムを50個獲得',
    threshold: 50,
    icon: '🌿',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-rare-25',
    name: 'レア25',
    description: 'レアアイテムを25個獲得',
    threshold: 25,
    icon: '💎',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-epic-15',
    name: 'エピック15',
    description: 'エピックアイテムを15個獲得',
    threshold: 15,
    icon: '🔮',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-legendary-trio',
    name: 'レジェンダリートリオ',
    description: 'レジェンダリーアイテムを3個獲得',
    threshold: 3,
    icon: '🌟',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-rarity-collector',
    name: 'レアリティコレクター',
    description: '各レア度のアイテムを5個以上所持',
    threshold: 25,
    icon: '🌈',
    tier: 'platinum',
    category: 'special',
  },
  // === データ完成度追加実績 ===
  {
    id: 'special-photo-starter',
    name: 'フォトスターター',
    description: '画像付きアイテム5個登録',
    threshold: 5,
    icon: '📷',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-photo-25',
    name: 'フォト25',
    description: '画像付きアイテム25個登録',
    threshold: 25,
    icon: '📸',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-photo-200',
    name: 'フォト200',
    description: '画像付きアイテム200個登録',
    threshold: 200,
    icon: '🎬',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-memo-starter',
    name: 'メモスターター',
    description: 'メモ付きアイテム5個登録',
    threshold: 5,
    icon: '📝',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-memo-25',
    name: 'メモ25',
    description: 'メモ付きアイテム25個登録',
    threshold: 25,
    icon: '📒',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-memo-100',
    name: 'メモ100',
    description: 'メモ付きアイテム100個登録',
    threshold: 100,
    icon: '📚',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-detailed-writer',
    name: 'ディテールドライター',
    description: '50文字以上のメモを20個作成',
    threshold: 20,
    icon: '✍️',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-novelist-pro',
    name: 'ノベリストプロ',
    description: '200文字以上のメモを10個作成',
    threshold: 10,
    icon: '📖',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-location-starter',
    name: 'ロケーションスターター',
    description: '保管場所を3種類使用',
    threshold: 3,
    icon: '📍',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-location-10',
    name: 'ロケーション10',
    description: '保管場所を10種類使用',
    threshold: 10,
    icon: '🏠',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-location-30',
    name: 'ロケーション30',
    description: '保管場所を30種類使用',
    threshold: 30,
    icon: '🗺️',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-complete-starter',
    name: 'コンプリートスターター',
    description: '完全データ(画像+メモ+場所)のアイテム5個',
    threshold: 5,
    icon: '✅',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-complete-25',
    name: 'コンプリート25',
    description: '完全データのアイテム25個',
    threshold: 25,
    icon: '🏅',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-complete-100',
    name: 'コンプリート100',
    description: '完全データのアイテム100個',
    threshold: 100,
    icon: '🏆',
    tier: 'platinum',
    category: 'special',
  },
  // === カテゴリ深掘り実績 ===
  {
    id: 'special-category-10',
    name: 'カテゴリ10',
    description: '1つのカテゴリに10アイテム登録',
    threshold: 10,
    icon: '📁',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-category-30',
    name: 'カテゴリ30',
    description: '1つのカテゴリに30アイテム登録',
    threshold: 30,
    icon: '📂',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-category-100',
    name: 'カテゴリ100',
    description: '1つのカテゴリに100アイテム登録',
    threshold: 100,
    icon: '🗂️',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-category-250',
    name: 'カテゴリ250',
    description: '1つのカテゴリに250アイテム登録',
    threshold: 250,
    icon: '📊',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-balanced-3',
    name: 'バランスド3',
    description: '3つのカテゴリに各10アイテム以上登録',
    threshold: 30,
    icon: '⚖️',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-balanced-5',
    name: 'バランスド5',
    description: '5つのカテゴリに各10アイテム以上登録',
    threshold: 50,
    icon: '🎭',
    tier: 'gold',
    category: 'special',
  },
  // === 特殊名前系実績 ===
  {
    id: 'special-hiragana-only',
    name: 'ひらがなオンリー',
    description: 'ひらがなのみの名前のアイテムを登録',
    threshold: 1,
    icon: 'あ',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-katakana-only',
    name: 'カタカナオンリー',
    description: 'カタカナのみの名前のアイテムを登録',
    threshold: 1,
    icon: 'ア',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-kanji-only',
    name: '漢字オンリー',
    description: '漢字のみの名前のアイテムを登録',
    threshold: 1,
    icon: '漢',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-alphabet-only',
    name: 'アルファベットオンリー',
    description: '英字のみの名前のアイテムを登録',
    threshold: 1,
    icon: '🔤',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-mixed-script',
    name: 'ミックススクリプト',
    description: '複数の文字種を含む名前のアイテムを10個登録',
    threshold: 10,
    icon: '🔡',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-question-mark',
    name: 'クエスチョンマーク',
    description: '?を含む名前のアイテムを登録',
    threshold: 1,
    icon: '❓',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-exclamation',
    name: 'エクスクラメーション',
    description: '!を含む名前のアイテムを登録',
    threshold: 1,
    icon: '❗',
    tier: 'bronze',
    category: 'special',
  },
  // === ユニーク系実績 ===
  {
    id: 'special-first-category',
    name: 'ファーストカテゴリ',
    description: '最初のカテゴリにアイテム登録',
    threshold: 1,
    icon: '1️⃣',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-all-months',
    name: 'オールマンス',
    description: '1-12月全ての月にアイテム登録',
    threshold: 12,
    icon: '📅',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-leap-year',
    name: 'リープイヤー',
    description: 'うるう年の2月29日にアイテム登録',
    threshold: 1,
    icon: '🐸',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-full-moon',
    name: 'フルムーン',
    description: '満月の日にアイテム登録',
    threshold: 1,
    icon: '🌕',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-friday-13th',
    name: '13日の金曜日',
    description: '13日の金曜日にアイテム登録',
    threshold: 1,
    icon: '🎭',
    tier: 'gold',
    category: 'special',
  },
  // === 長期継続追加実績 ===
  {
    id: 'special-three-years',
    name: '3周年記念',
    description: '登録から3年継続',
    threshold: 1095,
    icon: '🎊',
    tier: 'legendary',
    category: 'special',
  },
  {
    id: 'special-five-years',
    name: '5周年記念',
    description: '登録から5年継続',
    threshold: 1825,
    icon: '🌟',
    tier: 'legendary',
    category: 'special',
  },
  {
    id: 'special-decade',
    name: 'ディケード',
    description: '登録から10年継続',
    threshold: 3650,
    icon: '♾️',
    tier: 'legendary',
    category: 'special',
  },
  // === コレクションサイズ系実績 ===
  {
    id: 'special-tiny-collection',
    name: 'タイニーコレクション',
    description: '5アイテム達成',
    threshold: 5,
    icon: '🐣',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-small-collection',
    name: 'スモールコレクション',
    description: '15アイテム達成',
    threshold: 15,
    icon: '🐥',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-growing-collection',
    name: 'グローイングコレクション',
    description: '30アイテム達成',
    threshold: 30,
    icon: '🌱',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-medium-collection',
    name: 'ミディアムコレクション',
    description: '75アイテム達成',
    threshold: 75,
    icon: '🌿',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-large-collection',
    name: 'ラージコレクション',
    description: '150アイテム達成',
    threshold: 150,
    icon: '🌳',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-huge-collection',
    name: 'ヒュージコレクション',
    description: '400アイテム達成',
    threshold: 400,
    icon: '🏔️',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-massive-collection',
    name: 'マッシブコレクション',
    description: '750アイテム達成',
    threshold: 750,
    icon: '🗻',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-epic-collection',
    name: 'エピックコレクション',
    description: '1500アイテム達成',
    threshold: 1500,
    icon: '🌋',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-legendary-collection',
    name: 'レジェンダリーコレクション',
    description: '3000アイテム達成',
    threshold: 3000,
    icon: '🌌',
    tier: 'diamond',
    category: 'special',
  },
  {
    id: 'special-mythic-collection',
    name: 'ミシックコレクション',
    description: '5000アイテム達成',
    threshold: 5000,
    icon: '✨',
    tier: 'diamond',
    category: 'special',
  },
  {
    id: 'special-godlike-collection',
    name: 'ゴッドライクコレクション',
    description: '7500アイテム達成',
    threshold: 7500,
    icon: '🔱',
    tier: 'legendary',
    category: 'special',
  },
  {
    id: 'special-ultimate-collection',
    name: 'アルティメットコレクション',
    description: '10000アイテム達成',
    threshold: 10000,
    icon: '👑',
    tier: 'legendary',
    category: 'special',
  },
  // === ストリーク追加実績 ===
  {
    id: 'special-streak-4',
    name: '4日ストリーク',
    description: '4日連続でアイテム追加',
    threshold: 4,
    icon: '4️⃣',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-streak-6',
    name: '6日ストリーク',
    description: '6日連続でアイテム追加',
    threshold: 6,
    icon: '6️⃣',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-streak-8',
    name: '8日ストリーク',
    description: '8日連続でアイテム追加',
    threshold: 8,
    icon: '8️⃣',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-streak-25',
    name: '25日ストリーク',
    description: '25日連続でアイテム追加',
    threshold: 25,
    icon: '🔥',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-streak-40',
    name: '40日ストリーク',
    description: '40日連続でアイテム追加',
    threshold: 40,
    icon: '💪',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-streak-75',
    name: '75日ストリーク',
    description: '75日連続でアイテム追加',
    threshold: 75,
    icon: '🏃',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-streak-120',
    name: '120日ストリーク',
    description: '120日連続でアイテム追加',
    threshold: 120,
    icon: '🚀',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-streak-270',
    name: '270日ストリーク',
    description: '270日連続でアイテム追加',
    threshold: 270,
    icon: '⭐',
    tier: 'diamond',
    category: 'special',
  },
  {
    id: 'special-streak-400',
    name: '400日ストリーク',
    description: '400日連続でアイテム追加',
    threshold: 400,
    icon: '🌟',
    tier: 'diamond',
    category: 'special',
  },
  {
    id: 'special-streak-600',
    name: '600日ストリーク',
    description: '600日連続でアイテム追加',
    threshold: 600,
    icon: '💫',
    tier: 'legendary',
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
  // === 基本バッジ ===
  {
    id: 'badge-starter',
    name: 'スターター',
    description: 'コレクションを開始',
    icon: '🚀',
    condition: (items) => items.length >= 1,
    tier: 'bronze',
  },
  {
    id: 'badge-collector-10',
    name: 'コレクター10',
    description: '10アイテム達成',
    icon: '🎯',
    condition: (items) => items.length >= 10,
    tier: 'bronze',
  },
  {
    id: 'badge-collector-25',
    name: 'コレクター25',
    description: '25アイテム達成',
    icon: '📋',
    condition: (items) => items.length >= 25,
    tier: 'bronze',
  },
  {
    id: 'badge-collector-50',
    name: 'ハーフセンチュリー',
    description: '50アイテム達成',
    icon: '🏅',
    condition: (items) => items.length >= 50,
    tier: 'silver',
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
    id: 'badge-half-millennium',
    name: 'ハーフミレニアム',
    description: '500アイテム達成',
    icon: '🎖️',
    condition: (items) => items.length >= 500,
    tier: 'platinum',
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
    id: 'badge-legend-5000',
    name: 'レジェンド',
    description: '5000アイテム達成',
    icon: '👑',
    condition: (items) => items.length >= 5000,
    tier: 'diamond',
  },
  // === カテゴリ系 ===
  {
    id: 'badge-organizer',
    name: 'オーガナイザー',
    description: '5つのカテゴリを使用',
    icon: '📁',
    condition: (items) => new Set(items.map(i => i.category)).size >= 5,
    tier: 'silver',
  },
  {
    id: 'badge-multi-category',
    name: 'マルチカテゴリ',
    description: '8つのカテゴリを使用',
    icon: '🗂️',
    condition: (items) => new Set(items.map(i => i.category)).size >= 8,
    tier: 'gold',
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
  {
    id: 'badge-category-specialist',
    name: 'カテゴリスペシャリスト',
    description: '1つのカテゴリに50アイテム以上登録',
    icon: '🎯',
    condition: (items) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return Array.from(catCount.values()).some(c => c >= 50);
    },
    tier: 'gold',
  },
  {
    id: 'badge-category-master',
    name: 'カテゴリマスター',
    description: '1つのカテゴリに100アイテム以上登録',
    icon: '🏆',
    condition: (items) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return Array.from(catCount.values()).some(c => c >= 100);
    },
    tier: 'platinum',
  },
  // === 画像・メモ系 ===
  {
    id: 'badge-photographer',
    name: 'フォトグラファー',
    description: '全アイテムに画像を登録',
    icon: '📸',
    condition: (items) => items.length >= 10 && items.every(i => i.image),
    tier: 'gold',
  },
  {
    id: 'badge-visual-collector',
    name: 'ビジュアルコレクター',
    description: '50アイテム以上に画像を登録',
    icon: '🖼️',
    condition: (items) => items.filter(i => i.image).length >= 50,
    tier: 'silver',
  },
  {
    id: 'badge-gallery-owner',
    name: 'ギャラリーオーナー',
    description: '100アイテム以上に画像を登録',
    icon: '🎨',
    condition: (items) => items.filter(i => i.image).length >= 100,
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
    id: 'badge-note-taker',
    name: 'ノートテイカー',
    description: '30アイテム以上にメモを追加',
    icon: '📒',
    condition: (items) => items.filter(i => i.notes && i.notes.length > 0).length >= 30,
    tier: 'silver',
  },
  {
    id: 'badge-chronicler',
    name: 'クロニクラー',
    description: '100アイテム以上にメモを追加',
    icon: '📚',
    condition: (items) => items.filter(i => i.notes && i.notes.length > 0).length >= 100,
    tier: 'gold',
  },
  // === 保管場所系 ===
  {
    id: 'badge-location-starter',
    name: 'ロケーションスターター',
    description: '5種類以上の保管場所を使用',
    icon: '🏠',
    condition: (items) => new Set(items.filter(i => i.location).map(i => i.location)).size >= 5,
    tier: 'bronze',
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
    id: 'badge-location-legend',
    name: 'ロケーションレジェンド',
    description: '25種類以上の保管場所を使用',
    icon: '🗺️',
    condition: (items) => new Set(items.filter(i => i.location).map(i => i.location)).size >= 25,
    tier: 'platinum',
  },
  // === 連続日数系 ===
  {
    id: 'badge-three-days',
    name: 'スリーデイズ',
    description: '3日連続でアイテム追加',
    icon: '🔥',
    condition: (_, __, streak) => streak >= 3,
    tier: 'bronze',
  },
  {
    id: 'badge-dedicated',
    name: '献身的コレクター',
    description: '7日連続でアイテム追加',
    icon: '💪',
    condition: (_, __, streak) => streak >= 7,
    tier: 'silver',
  },
  {
    id: 'badge-two-weeks',
    name: 'ツーウィークス',
    description: '14日連続でアイテム追加',
    icon: '📅',
    condition: (_, __, streak) => streak >= 14,
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
    id: 'badge-sixty-days',
    name: 'シックスティデイズ',
    description: '60日連続でアイテム追加',
    icon: '🎯',
    condition: (_, __, streak) => streak >= 60,
    tier: 'platinum',
  },
  {
    id: 'badge-hundred-days',
    name: '100日マスター',
    description: '100日連続でアイテム追加',
    icon: '💯',
    condition: (_, __, streak) => streak >= 100,
    tier: 'diamond',
  },
  {
    id: 'badge-yearly-streak',
    name: 'イヤリーストリーク',
    description: '365日連続でアイテム追加',
    icon: '🏆',
    condition: (_, __, streak) => streak >= 365,
    tier: 'diamond',
  },
  // === レア度系 ===
  {
    id: 'badge-rare-collector',
    name: 'レアコレクター',
    description: 'レア以上のアイテムを10個所持',
    icon: '💎',
    condition: (items) => {
      let count = 0;
      items.forEach(i => {
        const rarity = determineRarity(i.name, i.createdAt);
        if (rarity === 'rare' || rarity === 'epic' || rarity === 'legendary') count++;
      });
      return count >= 10;
    },
    tier: 'silver',
  },
  {
    id: 'badge-epic-collector',
    name: 'エピックコレクター',
    description: 'エピック以上のアイテムを10個所持',
    icon: '🔮',
    condition: (items) => {
      let count = 0;
      items.forEach(i => {
        const rarity = determineRarity(i.name, i.createdAt);
        if (rarity === 'epic' || rarity === 'legendary') count++;
      });
      return count >= 10;
    },
    tier: 'gold',
  },
  {
    id: 'badge-legendary-collector',
    name: 'レジェンダリーコレクター',
    description: 'レジェンダリーのアイテムを5個所持',
    icon: '🌟',
    condition: (items) => {
      let count = 0;
      items.forEach(i => {
        const rarity = determineRarity(i.name, i.createdAt);
        if (rarity === 'legendary') count++;
      });
      return count >= 5;
    },
    tier: 'platinum',
  },
  {
    id: 'badge-rarity-master',
    name: 'レアリティマスター',
    description: '全レア度のアイテムを所持',
    icon: '🌈',
    condition: (items) => {
      const rarities = new Set<Rarity>();
      items.forEach(i => {
        rarities.add(determineRarity(i.name, i.createdAt));
      });
      return rarities.size >= 5;
    },
    tier: 'gold',
  },
  // === バランス系 ===
  {
    id: 'badge-balanced-3',
    name: 'バランサー',
    description: '3つのカテゴリに各10アイテム以上登録',
    icon: '⚖️',
    condition: (items) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return Array.from(catCount.values()).filter(c => c >= 10).length >= 3;
    },
    tier: 'silver',
  },
  {
    id: 'badge-balanced-5',
    name: 'マスターバランサー',
    description: '5つのカテゴリに各10アイテム以上登録',
    icon: '🎭',
    condition: (items) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return Array.from(catCount.values()).filter(c => c >= 10).length >= 5;
    },
    tier: 'gold',
  },
  // === 完璧主義系 ===
  {
    id: 'badge-complete-10',
    name: 'コンプリートビギナー',
    description: '10アイテム全てに画像・メモ・保管場所を登録',
    icon: '🏅',
    condition: (items) => {
      const complete = items.filter(i => i.image && i.notes && i.notes.length > 0 && i.location);
      return complete.length >= 10;
    },
    tier: 'silver',
  },
  {
    id: 'badge-complete-50',
    name: 'コンプリートマスター',
    description: '50アイテム全てに画像・メモ・保管場所を登録',
    icon: '🎖️',
    condition: (items) => {
      const complete = items.filter(i => i.image && i.notes && i.notes.length > 0 && i.location);
      return complete.length >= 50;
    },
    tier: 'gold',
  },
  {
    id: 'badge-complete-100',
    name: 'コンプリートレジェンド',
    description: '100アイテム全てに画像・メモ・保管場所を登録',
    icon: '🏆',
    condition: (items) => {
      const complete = items.filter(i => i.image && i.notes && i.notes.length > 0 && i.location);
      return complete.length >= 100;
    },
    tier: 'platinum',
  },
  // === 特殊バッジ ===
  {
    id: 'badge-first-item',
    name: 'ファーストステップ',
    description: '最初のアイテムを登録',
    icon: '👶',
    condition: (items) => items.length >= 1,
    tier: 'bronze',
  },
  {
    id: 'badge-quick-start',
    name: 'クイックスタート',
    description: '初日に5アイテム以上登録',
    icon: '⚡',
    condition: (items) => {
      if (items.length < 5) return false;
      const firstDate = items.reduce((min, i) =>
        i.createdAt && i.createdAt < min ? i.createdAt : min,
        items[0]?.createdAt || new Date()
      );
      const firstDayItems = items.filter(i => {
        if (!i.createdAt) return false;
        const diff = i.createdAt.getTime() - firstDate.getTime();
        return diff < 24 * 60 * 60 * 1000;
      });
      return firstDayItems.length >= 5;
    },
    tier: 'silver',
  },
  {
    id: 'badge-active-week',
    name: 'アクティブウィーク',
    description: '1週間で50アイテム登録',
    icon: '📈',
    condition: (items) => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return items.filter(i => i.createdAt && i.createdAt >= weekAgo).length >= 50;
    },
    tier: 'gold',
  },
  {
    id: 'badge-active-month',
    name: 'アクティブマンス',
    description: '1ヶ月で200アイテム登録',
    icon: '🚀',
    condition: (items) => {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return items.filter(i => i.createdAt && i.createdAt >= monthAgo).length >= 200;
    },
    tier: 'platinum',
  },
  {
    id: 'badge-diverse-locations',
    name: '多拠点コレクター',
    description: '各保管場所に最低3アイテム（5箇所以上）',
    icon: '🏢',
    condition: (items) => {
      const locCount = new Map<string, number>();
      items.filter(i => i.location).forEach(i =>
        locCount.set(i.location!, (locCount.get(i.location!) || 0) + 1)
      );
      return Array.from(locCount.values()).filter(c => c >= 3).length >= 5;
    },
    tier: 'gold',
  },
  // === 追加アイテム数系 ===
  {
    id: 'badge-collector-75',
    name: 'セブンティファイブ',
    description: '75アイテム達成',
    icon: '🎪',
    condition: (items) => items.length >= 75,
    tier: 'silver',
  },
  {
    id: 'badge-collector-150',
    name: 'ワンフィフティ',
    description: '150アイテム達成',
    icon: '🎡',
    condition: (items) => items.length >= 150,
    tier: 'gold',
  },
  {
    id: 'badge-collector-200',
    name: 'ダブルセンチュリー',
    description: '200アイテム達成',
    icon: '🏛️',
    condition: (items) => items.length >= 200,
    tier: 'gold',
  },
  {
    id: 'badge-collector-300',
    name: 'トリプルセンチュリー',
    description: '300アイテム達成',
    icon: '🏰',
    condition: (items) => items.length >= 300,
    tier: 'platinum',
  },
  {
    id: 'badge-collector-750',
    name: 'セブンフィフティ',
    description: '750アイテム達成',
    icon: '🗼',
    condition: (items) => items.length >= 750,
    tier: 'platinum',
  },
  {
    id: 'badge-collector-2000',
    name: 'ツーサウザンド',
    description: '2000アイテム達成',
    icon: '⛩️',
    condition: (items) => items.length >= 2000,
    tier: 'diamond',
  },
  {
    id: 'badge-collector-3000',
    name: 'スリーサウザンド',
    description: '3000アイテム達成',
    icon: '🏯',
    condition: (items) => items.length >= 3000,
    tier: 'diamond',
  },
  {
    id: 'badge-infinity',
    name: 'インフィニティ',
    description: '10000アイテム達成',
    icon: '♾️',
    condition: (items) => items.length >= 10000,
    tier: 'diamond',
  },
  // === タグ系バッジ ===
  {
    id: 'badge-tag-starter',
    name: 'タグスターター',
    description: 'タグ付きアイテムを5個登録',
    icon: '🏷️',
    condition: (items) => items.filter(i => i.tags && i.tags.length > 0).length >= 5,
    tier: 'bronze',
  },
  {
    id: 'badge-tag-lover',
    name: 'タグラバー',
    description: 'タグ付きアイテムを20個登録',
    icon: '🔖',
    condition: (items) => items.filter(i => i.tags && i.tags.length > 0).length >= 20,
    tier: 'silver',
  },
  {
    id: 'badge-tag-master',
    name: 'タグマスター',
    description: 'タグ付きアイテムを50個登録',
    icon: '📑',
    condition: (items) => items.filter(i => i.tags && i.tags.length > 0).length >= 50,
    tier: 'gold',
  },
  {
    id: 'badge-multi-tag',
    name: 'マルチタグ',
    description: '3つ以上のタグがついたアイテムを10個登録',
    icon: '🎴',
    condition: (items) => items.filter(i => i.tags && i.tags.length >= 3).length >= 10,
    tier: 'gold',
  },
  {
    id: 'badge-tag-variety',
    name: 'タグバラエティ',
    description: '10種類以上のユニークなタグを使用',
    icon: '🎨',
    condition: (items) => {
      const allTags = new Set<string>();
      items.forEach(i => i.tags?.forEach(t => allTags.add(t)));
      return allTags.size >= 10;
    },
    tier: 'silver',
  },
  {
    id: 'badge-tag-expert',
    name: 'タグエキスパート',
    description: '25種類以上のユニークなタグを使用',
    icon: '🎭',
    condition: (items) => {
      const allTags = new Set<string>();
      items.forEach(i => i.tags?.forEach(t => allTags.add(t)));
      return allTags.size >= 25;
    },
    tier: 'gold',
  },
  {
    id: 'badge-tag-legend',
    name: 'タグレジェンド',
    description: '50種類以上のユニークなタグを使用',
    icon: '🌠',
    condition: (items) => {
      const allTags = new Set<string>();
      items.forEach(i => i.tags?.forEach(t => allTags.add(t)));
      return allTags.size >= 50;
    },
    tier: 'platinum',
  },
  // === 時間帯系バッジ ===
  {
    id: 'badge-morning-collector',
    name: 'モーニングコレクター',
    description: '朝(6-9時)に20アイテム登録',
    icon: '🌅',
    condition: (items) => {
      const morningItems = items.filter(i => {
        if (!i.createdAt) return false;
        const hour = i.createdAt.getHours();
        return hour >= 6 && hour < 9;
      });
      return morningItems.length >= 20;
    },
    tier: 'silver',
  },
  {
    id: 'badge-afternoon-collector',
    name: 'アフタヌーンコレクター',
    description: '午後(12-17時)に30アイテム登録',
    icon: '☀️',
    condition: (items) => {
      const afternoonItems = items.filter(i => {
        if (!i.createdAt) return false;
        const hour = i.createdAt.getHours();
        return hour >= 12 && hour < 17;
      });
      return afternoonItems.length >= 30;
    },
    tier: 'silver',
  },
  {
    id: 'badge-evening-collector',
    name: 'イブニングコレクター',
    description: '夕方(17-21時)に30アイテム登録',
    icon: '🌆',
    condition: (items) => {
      const eveningItems = items.filter(i => {
        if (!i.createdAt) return false;
        const hour = i.createdAt.getHours();
        return hour >= 17 && hour < 21;
      });
      return eveningItems.length >= 30;
    },
    tier: 'silver',
  },
  {
    id: 'badge-night-collector',
    name: 'ナイトコレクター',
    description: '深夜(21-24時)に30アイテム登録',
    icon: '🌙',
    condition: (items) => {
      const nightItems = items.filter(i => {
        if (!i.createdAt) return false;
        const hour = i.createdAt.getHours();
        return hour >= 21 || hour < 4;
      });
      return nightItems.length >= 30;
    },
    tier: 'gold',
  },
  {
    id: 'badge-all-hours',
    name: 'オールアワーズ',
    description: '全時間帯(朝昼夕夜)でアイテム登録',
    icon: '⏰',
    condition: (items) => {
      let morning = false, afternoon = false, evening = false, night = false;
      items.forEach(i => {
        if (!i.createdAt) return;
        const hour = i.createdAt.getHours();
        if (hour >= 6 && hour < 12) morning = true;
        else if (hour >= 12 && hour < 17) afternoon = true;
        else if (hour >= 17 && hour < 21) evening = true;
        else night = true;
      });
      return morning && afternoon && evening && night;
    },
    tier: 'gold',
  },
  // === 曜日系バッジ ===
  {
    id: 'badge-monday-starter',
    name: 'マンデースターター',
    description: '月曜日に10アイテム登録',
    icon: '📅',
    condition: (items) => {
      return items.filter(i => i.createdAt && i.createdAt.getDay() === 1).length >= 10;
    },
    tier: 'bronze',
  },
  {
    id: 'badge-wednesday-warrior',
    name: 'ウェンズデーウォリアー',
    description: '水曜日に10アイテム登録',
    icon: '🎯',
    condition: (items) => {
      return items.filter(i => i.createdAt && i.createdAt.getDay() === 3).length >= 10;
    },
    tier: 'bronze',
  },
  {
    id: 'badge-friday-finisher',
    name: 'フライデーフィニッシャー',
    description: '金曜日に20アイテム登録',
    icon: '🎊',
    condition: (items) => {
      return items.filter(i => i.createdAt && i.createdAt.getDay() === 5).length >= 20;
    },
    tier: 'silver',
  },
  {
    id: 'badge-weekend-master',
    name: 'ウィークエンドマスター',
    description: '週末(土日)に50アイテム登録',
    icon: '🏖️',
    condition: (items) => {
      return items.filter(i => {
        if (!i.createdAt) return false;
        const day = i.createdAt.getDay();
        return day === 0 || day === 6;
      }).length >= 50;
    },
    tier: 'gold',
  },
  {
    id: 'badge-all-days',
    name: 'オールデイズ',
    description: '全曜日でアイテム登録',
    icon: '📆',
    condition: (items) => {
      const days = new Set<number>();
      items.forEach(i => {
        if (i.createdAt) days.add(i.createdAt.getDay());
      });
      return days.size >= 7;
    },
    tier: 'silver',
  },
  // === 季節系バッジ ===
  {
    id: 'badge-spring-collector',
    name: 'スプリングコレクター',
    description: '春(3-5月)に20アイテム登録',
    icon: '🌸',
    condition: (items) => {
      return items.filter(i => {
        if (!i.createdAt) return false;
        const month = i.createdAt.getMonth();
        return month >= 2 && month <= 4;
      }).length >= 20;
    },
    tier: 'bronze',
  },
  {
    id: 'badge-summer-collector',
    name: 'サマーコレクター',
    description: '夏(6-8月)に20アイテム登録',
    icon: '🌻',
    condition: (items) => {
      return items.filter(i => {
        if (!i.createdAt) return false;
        const month = i.createdAt.getMonth();
        return month >= 5 && month <= 7;
      }).length >= 20;
    },
    tier: 'bronze',
  },
  {
    id: 'badge-autumn-collector',
    name: 'オータムコレクター',
    description: '秋(9-11月)に20アイテム登録',
    icon: '🍂',
    condition: (items) => {
      return items.filter(i => {
        if (!i.createdAt) return false;
        const month = i.createdAt.getMonth();
        return month >= 8 && month <= 10;
      }).length >= 20;
    },
    tier: 'bronze',
  },
  {
    id: 'badge-winter-collector',
    name: 'ウィンターコレクター',
    description: '冬(12-2月)に20アイテム登録',
    icon: '❄️',
    condition: (items) => {
      return items.filter(i => {
        if (!i.createdAt) return false;
        const month = i.createdAt.getMonth();
        return month === 11 || month <= 1;
      }).length >= 20;
    },
    tier: 'bronze',
  },
  {
    id: 'badge-four-seasons',
    name: 'フォーシーズンズ',
    description: '全季節でアイテム登録',
    icon: '🌍',
    condition: (items) => {
      let spring = false, summer = false, autumn = false, winter = false;
      items.forEach(i => {
        if (!i.createdAt) return;
        const month = i.createdAt.getMonth();
        if (month >= 2 && month <= 4) spring = true;
        else if (month >= 5 && month <= 7) summer = true;
        else if (month >= 8 && month <= 10) autumn = true;
        else winter = true;
      });
      return spring && summer && autumn && winter;
    },
    tier: 'gold',
  },
  // === データ完成度系バッジ ===
  {
    id: 'badge-detail-oriented',
    name: 'ディテール志向',
    description: '50文字以上のメモを20個作成',
    icon: '📖',
    condition: (items) => {
      return items.filter(i => i.notes && i.notes.length >= 50).length >= 20;
    },
    tier: 'gold',
  },
  {
    id: 'badge-story-teller',
    name: 'ストーリーテラー',
    description: '100文字以上のメモを10個作成',
    icon: '📚',
    condition: (items) => {
      return items.filter(i => i.notes && i.notes.length >= 100).length >= 10;
    },
    tier: 'gold',
  },
  {
    id: 'badge-epic-writer',
    name: 'エピックライター',
    description: '200文字以上のメモを5個作成',
    icon: '✍️',
    condition: (items) => {
      return items.filter(i => i.notes && i.notes.length >= 200).length >= 5;
    },
    tier: 'platinum',
  },
  {
    id: 'badge-visual-master',
    name: 'ビジュアルマスター',
    description: '200アイテム以上に画像を登録',
    icon: '🎬',
    condition: (items) => items.filter(i => i.image).length >= 200,
    tier: 'platinum',
  },
  {
    id: 'badge-visual-legend',
    name: 'ビジュアルレジェンド',
    description: '500アイテム以上に画像を登録',
    icon: '🎥',
    condition: (items) => items.filter(i => i.image).length >= 500,
    tier: 'diamond',
  },
  {
    id: 'badge-location-50',
    name: 'ロケーションコレクター',
    description: '50種類以上の保管場所を使用',
    icon: '🌐',
    condition: (items) => new Set(items.filter(i => i.location).map(i => i.location)).size >= 50,
    tier: 'diamond',
  },
  // === コレクション多様性系バッジ ===
  {
    id: 'badge-balanced-category-7',
    name: 'セブンバランサー',
    description: '7つのカテゴリに各5アイテム以上登録',
    icon: '🎯',
    condition: (items) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return Array.from(catCount.values()).filter(c => c >= 5).length >= 7;
    },
    tier: 'gold',
  },
  {
    id: 'badge-category-dominator',
    name: 'カテゴリドミネーター',
    description: '1つのカテゴリに200アイテム以上登録',
    icon: '👊',
    condition: (items) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return Array.from(catCount.values()).some(c => c >= 200);
    },
    tier: 'diamond',
  },
  {
    id: 'badge-even-spread',
    name: 'イーブンスプレッド',
    description: '全カテゴリに各3アイテム以上登録',
    icon: '⚖️',
    condition: (items, categories) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return categories.every(c => (catCount.get(c.id) || 0) >= 3);
    },
    tier: 'platinum',
  },
  // === 連続日数追加系バッジ ===
  {
    id: 'badge-five-days',
    name: 'ファイブデイズ',
    description: '5日連続でアイテム追加',
    icon: '🖐️',
    condition: (_, __, streak) => streak >= 5,
    tier: 'bronze',
  },
  {
    id: 'badge-ten-days',
    name: 'テンデイズ',
    description: '10日連続でアイテム追加',
    icon: '🔟',
    condition: (_, __, streak) => streak >= 10,
    tier: 'silver',
  },
  {
    id: 'badge-twenty-one-days',
    name: 'ハビットビルダー',
    description: '21日連続でアイテム追加（習慣形成）',
    icon: '🧠',
    condition: (_, __, streak) => streak >= 21,
    tier: 'silver',
  },
  {
    id: 'badge-forty-five-days',
    name: 'フォーティファイブ',
    description: '45日連続でアイテム追加',
    icon: '🌟',
    condition: (_, __, streak) => streak >= 45,
    tier: 'gold',
  },
  {
    id: 'badge-ninety-days',
    name: 'クォーターイヤー',
    description: '90日連続でアイテム追加',
    icon: '🏅',
    condition: (_, __, streak) => streak >= 90,
    tier: 'platinum',
  },
  {
    id: 'badge-half-year-streak',
    name: 'ハーフイヤーストリーク',
    description: '180日連続でアイテム追加',
    icon: '🎖️',
    condition: (_, __, streak) => streak >= 180,
    tier: 'diamond',
  },
  {
    id: 'badge-two-year-streak',
    name: 'ツーイヤーストリーク',
    description: '730日連続でアイテム追加',
    icon: '🌠',
    condition: (_, __, streak) => streak >= 730,
    tier: 'diamond',
  },
  // === スペシャルバッジ ===
  {
    id: 'badge-first-of-month',
    name: 'ファーストオブマンス',
    description: '月初(1日)にアイテム登録を3回',
    icon: '📆',
    condition: (items) => {
      return items.filter(i => i.createdAt && i.createdAt.getDate() === 1).length >= 3;
    },
    tier: 'silver',
  },
  {
    id: 'badge-end-of-month',
    name: 'エンドオブマンス',
    description: '月末(28-31日)にアイテム登録を5回',
    icon: '🗓️',
    condition: (items) => {
      return items.filter(i => {
        if (!i.createdAt) return false;
        const date = i.createdAt.getDate();
        return date >= 28;
      }).length >= 5;
    },
    tier: 'silver',
  },
  {
    id: 'badge-lucky-seven',
    name: 'ラッキーセブン',
    description: '7日、17日、27日にアイテム登録',
    icon: '🍀',
    condition: (items) => {
      const dates = new Set(items.filter(i => i.createdAt).map(i => i.createdAt!.getDate()));
      return dates.has(7) && dates.has(17) && dates.has(27);
    },
    tier: 'gold',
  },
  {
    id: 'badge-double-digit',
    name: 'ダブルディジット',
    description: 'ゾロ目の日(11日、22日)にアイテム登録',
    icon: '🎰',
    condition: (items) => {
      const dates = new Set(items.filter(i => i.createdAt).map(i => i.createdAt!.getDate()));
      return dates.has(11) && dates.has(22);
    },
    tier: 'silver',
  },
  {
    id: 'badge-new-year-week',
    name: 'ニューイヤーウィーク',
    description: '1月1日〜7日の全日にアイテム登録',
    icon: '🎍',
    condition: (items) => {
      const newYearDays = new Set<number>();
      items.forEach(i => {
        if (!i.createdAt) return;
        if (i.createdAt.getMonth() === 0 && i.createdAt.getDate() <= 7) {
          newYearDays.add(i.createdAt.getDate());
        }
      });
      return newYearDays.size >= 7;
    },
    tier: 'platinum',
  },
  {
    id: 'badge-birthday',
    name: 'バースデー',
    description: '毎月のアイテムを12ヶ月連続登録',
    icon: '🎂',
    condition: (items) => {
      const months = new Set<number>();
      items.forEach(i => {
        if (i.createdAt) months.add(i.createdAt.getMonth());
      });
      return months.size >= 12;
    },
    tier: 'gold',
  },
  // === レア度追加系バッジ ===
  {
    id: 'badge-common-collector',
    name: 'コモンコレクター',
    description: 'コモンアイテムを100個所持',
    icon: '📋',
    condition: (items) => {
      let count = 0;
      items.forEach(i => {
        const rarity = determineRarity(i.name, i.createdAt);
        if (rarity === 'common') count++;
      });
      return count >= 100;
    },
    tier: 'silver',
  },
  {
    id: 'badge-uncommon-master',
    name: 'アンコモンマスター',
    description: 'アンコモンアイテムを50個所持',
    icon: '🌿',
    condition: (items) => {
      let count = 0;
      items.forEach(i => {
        const rarity = determineRarity(i.name, i.createdAt);
        if (rarity === 'uncommon') count++;
      });
      return count >= 50;
    },
    tier: 'gold',
  },
  {
    id: 'badge-rare-master',
    name: 'レアマスター',
    description: 'レアアイテムを30個所持',
    icon: '💠',
    condition: (items) => {
      let count = 0;
      items.forEach(i => {
        const rarity = determineRarity(i.name, i.createdAt);
        if (rarity === 'rare') count++;
      });
      return count >= 30;
    },
    tier: 'platinum',
  },
  {
    id: 'badge-epic-master',
    name: 'エピックマスター',
    description: 'エピックアイテムを20個所持',
    icon: '🔮',
    condition: (items) => {
      let count = 0;
      items.forEach(i => {
        const rarity = determineRarity(i.name, i.createdAt);
        if (rarity === 'epic') count++;
      });
      return count >= 20;
    },
    tier: 'diamond',
  },
  {
    id: 'badge-legendary-master',
    name: 'レジェンダリーマスター',
    description: 'レジェンダリーアイテムを10個所持',
    icon: '👑',
    condition: (items) => {
      let count = 0;
      items.forEach(i => {
        const rarity = determineRarity(i.name, i.createdAt);
        if (rarity === 'legendary') count++;
      });
      return count >= 10;
    },
    tier: 'diamond',
  },
  // === アクティビティ系バッジ ===
  {
    id: 'badge-daily-10',
    name: 'デイリーテン',
    description: '1日に10アイテム登録',
    icon: '📊',
    condition: (items) => {
      const dayMap = new Map<string, number>();
      items.forEach(i => {
        if (!i.createdAt) return;
        const key = i.createdAt.toDateString();
        dayMap.set(key, (dayMap.get(key) || 0) + 1);
      });
      return Array.from(dayMap.values()).some(c => c >= 10);
    },
    tier: 'silver',
  },
  {
    id: 'badge-daily-25',
    name: 'デイリートゥエンティファイブ',
    description: '1日に25アイテム登録',
    icon: '📈',
    condition: (items) => {
      const dayMap = new Map<string, number>();
      items.forEach(i => {
        if (!i.createdAt) return;
        const key = i.createdAt.toDateString();
        dayMap.set(key, (dayMap.get(key) || 0) + 1);
      });
      return Array.from(dayMap.values()).some(c => c >= 25);
    },
    tier: 'gold',
  },
  {
    id: 'badge-daily-50',
    name: 'デイリーフィフティ',
    description: '1日に50アイテム登録',
    icon: '🔥',
    condition: (items) => {
      const dayMap = new Map<string, number>();
      items.forEach(i => {
        if (!i.createdAt) return;
        const key = i.createdAt.toDateString();
        dayMap.set(key, (dayMap.get(key) || 0) + 1);
      });
      return Array.from(dayMap.values()).some(c => c >= 50);
    },
    tier: 'platinum',
  },
  {
    id: 'badge-weekly-100',
    name: 'ウィークリーハンドレッド',
    description: '1週間で100アイテム登録',
    icon: '🚀',
    condition: (items) => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return items.filter(i => i.createdAt && i.createdAt >= weekAgo).length >= 100;
    },
    tier: 'platinum',
  },
  {
    id: 'badge-monthly-500',
    name: 'マンスリー500',
    description: '1ヶ月で500アイテム登録',
    icon: '💫',
    condition: (items) => {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return items.filter(i => i.createdAt && i.createdAt >= monthAgo).length >= 500;
    },
    tier: 'diamond',
  },
  // === コンプリート系追加バッジ ===
  {
    id: 'badge-complete-25',
    name: 'コンプリート25',
    description: '25アイテムに画像・メモ・保管場所を登録',
    icon: '🏆',
    condition: (items) => {
      const complete = items.filter(i => i.image && i.notes && i.notes.length > 0 && i.location);
      return complete.length >= 25;
    },
    tier: 'gold',
  },
  {
    id: 'badge-complete-200',
    name: 'コンプリートグランド',
    description: '200アイテムに画像・メモ・保管場所を登録',
    icon: '🎊',
    condition: (items) => {
      const complete = items.filter(i => i.image && i.notes && i.notes.length > 0 && i.location);
      return complete.length >= 200;
    },
    tier: 'diamond',
  },
  // === 名前系バッジ ===
  {
    id: 'badge-short-names',
    name: 'ミニマリスト',
    description: '3文字以下の名前のアイテムを10個登録',
    icon: '✂️',
    condition: (items) => {
      return items.filter(i => i.name.length <= 3).length >= 10;
    },
    tier: 'silver',
  },
  {
    id: 'badge-long-names',
    name: 'ロングネーマー',
    description: '20文字以上の名前のアイテムを10個登録',
    icon: '📜',
    condition: (items) => {
      return items.filter(i => i.name.length >= 20).length >= 10;
    },
    tier: 'silver',
  },
  {
    id: 'badge-emoji-names',
    name: '絵文字マニア',
    description: '絵文字を含む名前のアイテムを10個登録',
    icon: '😎',
    condition: (items) => {
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
      return items.filter(i => emojiRegex.test(i.name)).length >= 10;
    },
    tier: 'gold',
  },
  // === 特殊条件バッジ ===
  {
    id: 'badge-same-category-row',
    name: 'カテゴリフォーカス',
    description: '同じカテゴリに5連続でアイテム登録',
    icon: '🎯',
    condition: (items) => {
      if (items.length < 5) return false;
      const sorted = [...items].sort((a, b) =>
        (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)
      );
      for (let i = 0; i <= sorted.length - 5; i++) {
        const cat = sorted[i].category;
        if (sorted.slice(i, i + 5).every(item => item.category === cat)) {
          return true;
        }
      }
      return false;
    },
    tier: 'silver',
  },
  {
    id: 'badge-category-switcher',
    name: 'カテゴリスイッチャー',
    description: '5連続で異なるカテゴリにアイテム登録',
    icon: '🔀',
    condition: (items) => {
      if (items.length < 5) return false;
      const sorted = [...items].sort((a, b) =>
        (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)
      );
      for (let i = 0; i <= sorted.length - 5; i++) {
        const cats = new Set(sorted.slice(i, i + 5).map(item => item.category));
        if (cats.size === 5) return true;
      }
      return false;
    },
    tier: 'gold',
  },
  {
    id: 'badge-consistent',
    name: 'コンシステント',
    description: '7日連続で毎日1アイテム以上登録',
    icon: '📐',
    condition: (items, _, streak) => streak >= 7,
    tier: 'silver',
  },
  // === ミリオンバッジ ===
  {
    id: 'badge-half-way-to-thousand',
    name: 'ハーフウェイ',
    description: '500アイテムで1000への道の半分',
    icon: '🛤️',
    condition: (items) => items.length >= 500,
    tier: 'platinum',
  },
  {
    id: 'badge-photo-memo-combo',
    name: 'フォトメモコンボ',
    description: '画像とメモの両方があるアイテムを50個登録',
    icon: '📱',
    condition: (items) => {
      return items.filter(i => i.image && i.notes && i.notes.length > 0).length >= 50;
    },
    tier: 'gold',
  },
  {
    id: 'badge-location-specialist',
    name: 'ロケーションスペシャリスト',
    description: '1つの保管場所に20アイテム以上登録',
    icon: '🏡',
    condition: (items) => {
      const locCount = new Map<string, number>();
      items.filter(i => i.location).forEach(i =>
        locCount.set(i.location!, (locCount.get(i.location!) || 0) + 1)
      );
      return Array.from(locCount.values()).some(c => c >= 20);
    },
    tier: 'silver',
  },
  {
    id: 'badge-location-dominator',
    name: 'ロケーションドミネーター',
    description: '1つの保管場所に50アイテム以上登録',
    icon: '🏰',
    condition: (items) => {
      const locCount = new Map<string, number>();
      items.filter(i => i.location).forEach(i =>
        locCount.set(i.location!, (locCount.get(i.location!) || 0) + 1)
      );
      return Array.from(locCount.values()).some(c => c >= 50);
    },
    tier: 'gold',
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
