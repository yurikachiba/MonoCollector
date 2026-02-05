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
  // === 簡単で面白い実績 ===
  {
    id: 'special-lucky-seven',
    name: 'ラッキーセブン',
    description: '7時7分にアイテム登録',
    threshold: 1,
    icon: '🍀',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-triple-seven',
    name: 'トリプルセブン',
    description: '7月7日7時にアイテム登録',
    threshold: 1,
    icon: '🎰',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-same-numbers',
    name: 'ゾロ目マスター',
    description: 'ゾロ目の時間(11:11, 22:22など)に登録',
    threshold: 1,
    icon: '🔢',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-first-of-month',
    name: '月初めコレクター',
    description: '月の1日にアイテム登録',
    threshold: 1,
    icon: '📆',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-last-of-month',
    name: '駆け込みコレクター',
    description: '月末日にアイテム登録',
    threshold: 1,
    icon: '🏃‍♀️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-coffee-time',
    name: 'コーヒーブレイク',
    description: '午後3時(15:00台)にアイテム登録',
    threshold: 1,
    icon: '☕',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-tea-time',
    name: 'ティータイム',
    description: '午後4時(16:00台)にアイテム登録',
    threshold: 1,
    icon: '🍵',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-snack-time',
    name: 'おやつの時間',
    description: '3時のおやつ(15:00ちょうど)に登録',
    threshold: 1,
    icon: '🍰',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-dinner-time',
    name: 'ディナータイム',
    description: '夕食時(18-20時)にアイテム登録',
    threshold: 1,
    icon: '🍽️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-goodnight',
    name: 'おやすみコレクター',
    description: '就寝前(22-23時)にアイテム登録',
    threshold: 1,
    icon: '🌛',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-good-morning',
    name: 'おはようコレクター',
    description: '朝(6-8時)にアイテム登録',
    threshold: 1,
    icon: '🌅',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-rainy-day',
    name: '雨の日コレクター',
    description: '梅雨時期(6月)にアイテム登録',
    threshold: 1,
    icon: '☔',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-autumn',
    name: '秋のコレクター',
    description: '秋(9-11月)にアイテム登録',
    threshold: 1,
    icon: '🍁',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-winter',
    name: '冬のコレクター',
    description: '冬(12-2月)にアイテム登録',
    threshold: 1,
    icon: '❄️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-spring',
    name: '春のコレクター',
    description: '春(3-5月)にアイテム登録',
    threshold: 1,
    icon: '🌷',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-friday-13th',
    name: '13日の金曜日',
    description: '13日の金曜日にアイテム登録',
    threshold: 1,
    icon: '🖤',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-leap-year',
    name: 'うるう年コレクター',
    description: '2月29日にアイテム登録',
    threshold: 1,
    icon: '🐸',
    tier: 'platinum',
    category: 'special',
  },
  {
    id: 'special-childrens-day',
    name: 'こどもの日',
    description: '5月5日にアイテム登録',
    threshold: 1,
    icon: '🎏',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-obon',
    name: 'お盆コレクター',
    description: 'お盆期間(8/13-16)にアイテム登録',
    threshold: 1,
    icon: '🏮',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-pocky-day',
    name: 'ポッキーの日',
    description: '11月11日にアイテム登録',
    threshold: 1,
    icon: '🥢',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-hinamatsuri',
    name: 'ひな祭り',
    description: '3月3日にアイテム登録',
    threshold: 1,
    icon: '🎎',
    tier: 'silver',
    category: 'special',
  },
  // === アイテム名の面白い条件 ===
  {
    id: 'special-hiragana-only',
    name: 'ひらがなマスター',
    description: 'ひらがなのみの名前のアイテム登録',
    threshold: 1,
    icon: '🔤',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-katakana-only',
    name: 'カタカナマスター',
    description: 'カタカナのみの名前のアイテム登録',
    threshold: 1,
    icon: '🔠',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-english-only',
    name: 'イングリッシュ',
    description: '英語のみの名前のアイテム登録',
    threshold: 1,
    icon: '🇬🇧',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-color-name',
    name: 'カラフルネーマー',
    description: '色の名前を含むアイテム登録',
    threshold: 1,
    icon: '🎨',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-food-name',
    name: 'フードネーマー',
    description: '食べ物の名前を含むアイテム登録',
    threshold: 1,
    icon: '🍔',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-animal-name',
    name: 'アニマルネーマー',
    description: '動物の名前を含むアイテム登録',
    threshold: 1,
    icon: '🐾',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-lucky-name',
    name: 'ラッキーネーム',
    description: '「ラッキー」「幸運」を含むアイテム登録',
    threshold: 1,
    icon: '🌟',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-love-name',
    name: 'ラブネーム',
    description: '「愛」「好き」「Love」を含むアイテム登録',
    threshold: 1,
    icon: '💕',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-super-long-name',
    name: '超ロングネーム',
    description: '30文字以上の名前のアイテム登録',
    threshold: 1,
    icon: '📜',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-question-mark',
    name: 'クエスチョナー',
    description: '「？」を含む名前のアイテム登録',
    threshold: 1,
    icon: '❓',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-exclamation',
    name: 'エキサイティング',
    description: '「！」を含む名前のアイテム登録',
    threshold: 1,
    icon: '❗',
    tier: 'bronze',
    category: 'special',
  },
  // === 数字の面白い条件 ===
  {
    id: 'special-item-count-111',
    name: 'エンジェルナンバー111',
    description: '総アイテム数が111に到達',
    threshold: 111,
    icon: '👼',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-item-count-222',
    name: 'エンジェルナンバー222',
    description: '総アイテム数が222に到達',
    threshold: 222,
    icon: '✨',
    tier: 'silver',
    category: 'special',
  },
  {
    id: 'special-item-count-333',
    name: 'エンジェルナンバー333',
    description: '総アイテム数が333に到達',
    threshold: 333,
    icon: '🌈',
    tier: 'gold',
    category: 'special',
  },
  {
    id: 'special-item-count-777',
    name: 'エンジェルナンバー777',
    description: '総アイテム数が777に到達',
    threshold: 777,
    icon: '🎰',
    tier: 'platinum',
    category: 'special',
  },
  // === 即座に取れる簡単系 ===
  {
    id: 'special-first-edit',
    name: 'エディター',
    description: 'アイテムを初めて編集',
    threshold: 1,
    icon: '✏️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-first-photo',
    name: '初めての写真',
    description: '初めて写真付きアイテムを登録',
    threshold: 1,
    icon: '📱',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-first-memo',
    name: '初めてのメモ',
    description: '初めてメモ付きアイテムを登録',
    threshold: 1,
    icon: '📝',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-first-location',
    name: '初めての場所登録',
    description: '初めて保管場所を設定',
    threshold: 1,
    icon: '📍',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-first-tag',
    name: 'タグデビュー',
    description: '初めてタグ付きアイテムを登録',
    threshold: 1,
    icon: '🏷️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-second-item',
    name: 'セカンドステップ',
    description: '2個目のアイテム登録',
    threshold: 2,
    icon: '✌️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-third-item',
    name: 'サードステップ',
    description: '3個目のアイテム登録',
    threshold: 3,
    icon: '🥉',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-fifth-item',
    name: 'ハイファイブ',
    description: '5個目のアイテム登録',
    threshold: 5,
    icon: '🖐️',
    tier: 'bronze',
    category: 'special',
  },
  // === ユーモア系 ===
  {
    id: 'special-same-name-twice',
    name: 'デジャヴ',
    description: '同じ名前のアイテムを2つ登録',
    threshold: 2,
    icon: '👯',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-abc-order',
    name: 'ABC順',
    description: 'A(あ)から始まる名前のアイテム登録',
    threshold: 1,
    icon: '🔤',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-z-start',
    name: 'Z級コレクター',
    description: 'Z(ん)から始まる名前のアイテム登録',
    threshold: 1,
    icon: '💤',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-treasure',
    name: 'トレジャーハンター',
    description: '「宝」「お気に入り」を含むアイテム登録',
    threshold: 1,
    icon: '💎',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-secret',
    name: 'シークレットコレクター',
    description: '「秘密」「ヒミツ」を含むアイテム登録',
    threshold: 1,
    icon: '🤫',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-memory',
    name: 'メモリーキーパー',
    description: '「思い出」「記念」を含むアイテム登録',
    threshold: 1,
    icon: '💭',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-gift',
    name: 'ギフトコレクター',
    description: '「プレゼント」「贈り物」「ギフト」を含むアイテム登録',
    threshold: 1,
    icon: '🎁',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-handmade',
    name: 'ハンドメイドラバー',
    description: '「手作り」「ハンドメイド」を含むアイテム登録',
    threshold: 1,
    icon: '🧶',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-vintage',
    name: 'ビンテージコレクター',
    description: '「ビンテージ」「アンティーク」「レトロ」を含むアイテム登録',
    threshold: 1,
    icon: '🕰️',
    tier: 'bronze',
    category: 'special',
  },
  {
    id: 'special-limited',
    name: 'リミテッドエディション',
    description: '「限定」「レア」「希少」を含むアイテム登録',
    threshold: 1,
    icon: '⭐',
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
  // === 面白い＆取りやすい新バッジ ===
  {
    id: 'badge-welcome',
    name: 'ようこそ',
    description: 'アプリを初めて開いた',
    icon: '👋',
    condition: () => true, // 常に解除
    tier: 'bronze',
  },
  {
    id: 'badge-duo',
    name: 'デュオ',
    description: '2アイテム達成',
    icon: '✌️',
    condition: (items) => items.length >= 2,
    tier: 'bronze',
  },
  {
    id: 'badge-trio',
    name: 'トリオ',
    description: '3アイテム達成',
    icon: '🥉',
    condition: (items) => items.length >= 3,
    tier: 'bronze',
  },
  {
    id: 'badge-high-five',
    name: 'ハイファイブ',
    description: '5アイテム達成',
    icon: '🖐️',
    condition: (items) => items.length >= 5,
    tier: 'bronze',
  },
  {
    id: 'badge-lucky-seven',
    name: 'ラッキーセブン',
    description: '7アイテム達成',
    icon: '🍀',
    condition: (items) => items.length >= 7,
    tier: 'bronze',
  },
  {
    id: 'badge-first-category',
    name: 'カテゴリデビュー',
    description: '初めてカテゴリを使用',
    icon: '📂',
    condition: (items) => new Set(items.map(i => i.category)).size >= 1,
    tier: 'bronze',
  },
  {
    id: 'badge-two-categories',
    name: 'ツーカテゴリ',
    description: '2つのカテゴリを使用',
    icon: '📁',
    condition: (items) => new Set(items.map(i => i.category)).size >= 2,
    tier: 'bronze',
  },
  {
    id: 'badge-three-categories',
    name: 'スリーカテゴリ',
    description: '3つのカテゴリを使用',
    icon: '🗃️',
    condition: (items) => new Set(items.map(i => i.category)).size >= 3,
    tier: 'bronze',
  },
  {
    id: 'badge-first-photo',
    name: '初めての写真',
    description: '初めて画像付きアイテムを登録',
    icon: '📷',
    condition: (items) => items.some(i => i.image),
    tier: 'bronze',
  },
  {
    id: 'badge-first-memo',
    name: '初めてのメモ',
    description: '初めてメモ付きアイテムを登録',
    icon: '📝',
    condition: (items) => items.some(i => i.notes && i.notes.length > 0),
    tier: 'bronze',
  },
  {
    id: 'badge-first-location',
    name: '初めての場所',
    description: '初めて保管場所を設定',
    icon: '📍',
    condition: (items) => items.some(i => i.location),
    tier: 'bronze',
  },
  {
    id: 'badge-complete-info',
    name: 'コンプリートインフォ',
    description: '画像・メモ・場所が揃ったアイテムを1つ作成',
    icon: '✨',
    condition: (items) => items.some(i => i.image && i.notes && i.notes.length > 0 && i.location),
    tier: 'bronze',
  },
  {
    id: 'badge-five-photos',
    name: 'フォト5',
    description: '5アイテムに画像を登録',
    icon: '🖼️',
    condition: (items) => items.filter(i => i.image).length >= 5,
    tier: 'bronze',
  },
  {
    id: 'badge-ten-photos',
    name: 'フォト10',
    description: '10アイテムに画像を登録',
    icon: '🎞️',
    condition: (items) => items.filter(i => i.image).length >= 10,
    tier: 'bronze',
  },
  {
    id: 'badge-five-memos',
    name: 'メモ5',
    description: '5アイテムにメモを追加',
    icon: '📋',
    condition: (items) => items.filter(i => i.notes && i.notes.length > 0).length >= 5,
    tier: 'bronze',
  },
  {
    id: 'badge-ten-memos',
    name: 'メモ10',
    description: '10アイテムにメモを追加',
    icon: '📑',
    condition: (items) => items.filter(i => i.notes && i.notes.length > 0).length >= 10,
    tier: 'bronze',
  },
  {
    id: 'badge-one-location',
    name: 'ロケーション1',
    description: '1つの保管場所を使用',
    icon: '🏠',
    condition: (items) => new Set(items.filter(i => i.location).map(i => i.location)).size >= 1,
    tier: 'bronze',
  },
  {
    id: 'badge-two-locations',
    name: 'ロケーション2',
    description: '2つの保管場所を使用',
    icon: '🏡',
    condition: (items) => new Set(items.filter(i => i.location).map(i => i.location)).size >= 2,
    tier: 'bronze',
  },
  {
    id: 'badge-three-locations',
    name: 'ロケーション3',
    description: '3つの保管場所を使用',
    icon: '🏘️',
    condition: (items) => new Set(items.filter(i => i.location).map(i => i.location)).size >= 3,
    tier: 'bronze',
  },
  // === 日付・時間系の簡単バッジ ===
  {
    id: 'badge-morning-person',
    name: 'モーニングパーソン',
    description: '朝(6-9時)に登録したアイテムがある',
    icon: '🌅',
    condition: (items) => items.some(i => {
      if (!i.createdAt) return false;
      const hour = i.createdAt.getHours();
      return hour >= 6 && hour < 9;
    }),
    tier: 'bronze',
  },
  {
    id: 'badge-night-owl',
    name: 'ナイトオウル',
    description: '夜(21時以降)に登録したアイテムがある',
    icon: '🦉',
    condition: (items) => items.some(i => {
      if (!i.createdAt) return false;
      const hour = i.createdAt.getHours();
      return hour >= 21 || hour < 3;
    }),
    tier: 'bronze',
  },
  {
    id: 'badge-weekend-collector',
    name: 'ウィークエンドコレクター',
    description: '週末に登録したアイテムがある',
    icon: '🗓️',
    condition: (items) => items.some(i => {
      if (!i.createdAt) return false;
      const day = i.createdAt.getDay();
      return day === 0 || day === 6;
    }),
    tier: 'bronze',
  },
  // === レア度系の簡単バッジ ===
  {
    id: 'badge-first-uncommon',
    name: '初めてのアンコモン',
    description: 'アンコモン以上のアイテムを1つ所持',
    icon: '💚',
    condition: (items) => items.some(i => {
      const rarity = determineRarity(i.name, i.createdAt);
      return rarity !== 'common';
    }),
    tier: 'bronze',
  },
  {
    id: 'badge-first-rare',
    name: '初めてのレア',
    description: 'レア以上のアイテムを1つ所持',
    icon: '💙',
    condition: (items) => items.some(i => {
      const rarity = determineRarity(i.name, i.createdAt);
      return rarity === 'rare' || rarity === 'epic' || rarity === 'legendary';
    }),
    tier: 'bronze',
  },
  {
    id: 'badge-first-epic',
    name: '初めてのエピック',
    description: 'エピック以上のアイテムを1つ所持',
    icon: '💜',
    condition: (items) => items.some(i => {
      const rarity = determineRarity(i.name, i.createdAt);
      return rarity === 'epic' || rarity === 'legendary';
    }),
    tier: 'silver',
  },
  {
    id: 'badge-first-legendary',
    name: '初めてのレジェンダリー',
    description: 'レジェンダリーのアイテムを1つ所持',
    icon: '💛',
    condition: (items) => items.some(i => {
      const rarity = determineRarity(i.name, i.createdAt);
      return rarity === 'legendary';
    }),
    tier: 'gold',
  },
  // === ユニークで面白いバッジ ===
  {
    id: 'badge-same-category-3',
    name: '集中型コレクター',
    description: '1つのカテゴリに3アイテム登録',
    icon: '🎯',
    condition: (items) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return Array.from(catCount.values()).some(c => c >= 3);
    },
    tier: 'bronze',
  },
  {
    id: 'badge-same-category-5',
    name: 'カテゴリファン',
    description: '1つのカテゴリに5アイテム登録',
    icon: '❤️',
    condition: (items) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return Array.from(catCount.values()).some(c => c >= 5);
    },
    tier: 'bronze',
  },
  {
    id: 'badge-same-category-10',
    name: 'カテゴリラバー',
    description: '1つのカテゴリに10アイテム登録',
    icon: '💕',
    condition: (items) => {
      const catCount = new Map<string, number>();
      items.forEach(i => catCount.set(i.category, (catCount.get(i.category) || 0) + 1));
      return Array.from(catCount.values()).some(c => c >= 10);
    },
    tier: 'silver',
  },
  {
    id: 'badge-same-location-3',
    name: '整理上手',
    description: '1つの保管場所に3アイテム登録',
    icon: '🗄️',
    condition: (items) => {
      const locCount = new Map<string, number>();
      items.filter(i => i.location).forEach(i =>
        locCount.set(i.location!, (locCount.get(i.location!) || 0) + 1)
      );
      return Array.from(locCount.values()).some(c => c >= 3);
    },
    tier: 'bronze',
  },
  {
    id: 'badge-same-location-5',
    name: '収納マスター',
    description: '1つの保管場所に5アイテム登録',
    icon: '📦',
    condition: (items) => {
      const locCount = new Map<string, number>();
      items.filter(i => i.location).forEach(i =>
        locCount.set(i.location!, (locCount.get(i.location!) || 0) + 1)
      );
      return Array.from(locCount.values()).some(c => c >= 5);
    },
    tier: 'bronze',
  },
  // === アイテム名系の楽しいバッジ ===
  {
    id: 'badge-long-name',
    name: 'ロングネーマー',
    description: '10文字以上の名前のアイテムを登録',
    icon: '📏',
    condition: (items) => items.some(i => i.name.length >= 10),
    tier: 'bronze',
  },
  {
    id: 'badge-short-name',
    name: 'ショートネーマー',
    description: '3文字以下の名前のアイテムを登録',
    icon: '✂️',
    condition: (items) => items.some(i => i.name.length <= 3),
    tier: 'bronze',
  },
  {
    id: 'badge-emoji-lover',
    name: '絵文字ラバー',
    description: '絵文字を含む名前のアイテムを登録',
    icon: '😊',
    condition: (items) => items.some(i => /[\u{1F300}-\u{1F9FF}]/u.test(i.name)),
    tier: 'bronze',
  },
  {
    id: 'badge-number-name',
    name: 'ナンバーネーム',
    description: '数字を含む名前のアイテムを登録',
    icon: '🔢',
    condition: (items) => items.some(i => /[0-9０-９]/.test(i.name)),
    tier: 'bronze',
  },
  // === 連続日数の簡単バッジ ===
  {
    id: 'badge-two-days',
    name: 'ツーデイズ',
    description: '2日連続でアイテム追加',
    icon: '✌️',
    condition: (_, __, streak) => streak >= 2,
    tier: 'bronze',
  },
  // === 詳しいメモ系 ===
  {
    id: 'badge-detailed-memo',
    name: '詳しいメモ',
    description: '50文字以上のメモを書いたアイテムがある',
    icon: '📖',
    condition: (items) => items.some(i => i.notes && i.notes.length >= 50),
    tier: 'bronze',
  },
  {
    id: 'badge-storyteller',
    name: 'ストーリーテラー',
    description: '100文字以上のメモを書いたアイテムがある',
    icon: '📚',
    condition: (items) => items.some(i => i.notes && i.notes.length >= 100),
    tier: 'silver',
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
