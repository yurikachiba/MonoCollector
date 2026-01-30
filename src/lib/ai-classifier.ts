import { defaultCategories } from './db';

// Keyword-based classifier for automatic categorization
// This can be enhanced with OpenAI Vision API for image recognition

interface ClassificationResult {
  categoryId: string;
  confidence: number;
  suggestedName: string;
  suggestedTags: string[];
}

const categoryKeywords: Record<string, string[]> = {
  food: [
    '野菜', '果物', '肉', '魚', '米', 'パン', '牛乳', '卵', '調味料', '醤油', '味噌',
    'vegetable', 'fruit', 'meat', 'fish', 'rice', 'bread', 'milk', 'egg',
    'トマト', 'キャベツ', 'にんじん', 'じゃがいも', 'りんご', 'バナナ', '鶏肉', '豚肉', '牛肉',
    '冷凍', '缶詰', 'レトルト', 'インスタント', 'お菓子', 'スナック', '飲料', 'ジュース',
    '食品', '食材', '料理', '調理'
  ],
  kitchen: [
    'フライパン', '鍋', '包丁', 'まな板', 'お皿', 'コップ', '箸', 'スプーン', 'フォーク',
    '電子レンジ', 'トースター', '炊飯器', 'ミキサー', 'ケトル',
    'pan', 'pot', 'knife', 'dish', 'cup', 'spoon', 'fork',
    'キッチン', '台所', '食器', 'タッパー', '保存容器'
  ],
  clothes: [
    'シャツ', 'パンツ', 'ズボン', 'スカート', 'ワンピース', 'ジャケット', 'コート',
    '靴下', '下着', 'Tシャツ', 'セーター', 'カーディガン', '帽子', 'マフラー', '手袋',
    'shirt', 'pants', 'skirt', 'jacket', 'coat', 'socks',
    '衣類', '服', 'ファッション', '洋服', '着物'
  ],
  electronics: [
    'スマホ', 'パソコン', 'PC', 'タブレット', 'イヤホン', 'ヘッドホン', '充電器', 'ケーブル',
    'カメラ', 'テレビ', 'ゲーム機', 'Switch', 'PlayStation', 'キーボード', 'マウス',
    'phone', 'computer', 'tablet', 'camera', 'TV', 'game',
    '電子機器', 'ガジェット', 'デバイス', '電化製品', 'USB'
  ],
  books: [
    '本', '書籍', '漫画', 'マンガ', 'コミック', '雑誌', '小説', '教科書', '参考書',
    '絵本', '図鑑', '辞書', '辞典', 'ノート', '手帳',
    'book', 'manga', 'comic', 'magazine', 'novel'
  ],
  cosmetics: [
    '化粧品', 'コスメ', 'ファンデーション', '口紅', 'リップ', 'アイシャドウ', 'マスカラ',
    'シャンプー', 'リンス', 'ボディソープ', '洗顔', 'スキンケア', '化粧水', '乳液', 'クリーム',
    'cosmetic', 'makeup', 'shampoo', 'skincare',
    '美容', 'ヘアケア', 'ネイル', '香水'
  ],
  stationery: [
    'ペン', '鉛筆', 'シャーペン', '消しゴム', '定規', 'はさみ', 'テープ', 'のり',
    'ホッチキス', 'クリップ', 'ファイル', 'バインダー', '付箋', 'メモ帳',
    'pen', 'pencil', 'eraser', 'ruler', 'scissors', 'tape',
    '文房具', 'ステーショナリー', '筆記用具', '事務用品'
  ],
  toys: [
    'おもちゃ', 'ゲーム', 'フィギュア', 'ぬいぐるみ', 'プラモデル', 'ブロック', 'レゴ',
    'カード', 'トレカ', 'パズル', 'ボードゲーム',
    'toy', 'game', 'figure', 'plush', 'puzzle',
    'ホビー', '趣味', 'コレクション', '模型'
  ],
  cleaning: [
    '洗剤', '掃除機', 'モップ', '雑巾', 'スポンジ', 'ブラシ', 'ゴミ袋',
    '漂白剤', '柔軟剤', 'クリーナー', 'ティッシュ', 'トイレットペーパー',
    'detergent', 'vacuum', 'mop', 'sponge', 'brush',
    '掃除', 'クリーニング', '清掃', '衛生用品'
  ],
  medicine: [
    '薬', '風邪薬', '頭痛薬', '胃薬', '目薬', '絆創膏', '包帯', '体温計',
    'サプリメント', 'ビタミン', 'マスク', '消毒液', '医療',
    'medicine', 'drug', 'vitamin', 'supplement', 'mask',
    '医薬品', '健康', '救急'
  ],
  furniture: [
    '机', 'テーブル', '椅子', 'ソファ', 'ベッド', '棚', '本棚', 'クローゼット',
    'カーテン', 'ラグ', 'マット', 'クッション', '照明', 'ランプ',
    'desk', 'table', 'chair', 'sofa', 'bed', 'shelf',
    '家具', 'インテリア', '収納'
  ],
  sports: [
    'ボール', 'ラケット', 'バット', 'グローブ', 'シューズ', 'ウェア', 'ヨガマット',
    'ダンベル', '縄跳び', 'ゴルフ', 'テニス', 'サッカー', '野球',
    'ball', 'racket', 'shoes', 'yoga', 'dumbbell',
    'スポーツ', '運動', 'フィットネス', 'トレーニング'
  ],
};

export function classifyItem(name: string, imageAnalysis?: string): ClassificationResult {
  const textToAnalyze = `${name} ${imageAnalysis || ''}`.toLowerCase();

  let bestMatch = {
    categoryId: 'other',
    score: 0,
  };

  for (const [categoryId, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (textToAnalyze.includes(keyword.toLowerCase())) {
        score += keyword.length; // Longer matches are more specific
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { categoryId, score };
    }
  }

  // Generate suggested tags based on matched keywords
  const suggestedTags: string[] = [];
  const category = defaultCategories.find((c) => c.id === bestMatch.categoryId);

  if (category) {
    suggestedTags.push(category.name);
  }

  // Extract potential tags from name
  const words = name.split(/[\s,、・]+/).filter((w) => w.length > 1);
  suggestedTags.push(...words.slice(0, 3));

  return {
    categoryId: bestMatch.categoryId,
    confidence: bestMatch.score > 0 ? Math.min(bestMatch.score / 10, 1) : 0.1,
    suggestedName: name,
    suggestedTags: [...new Set(suggestedTags)],
  };
}

// Icon suggestions based on category and item name
export function suggestIcon(categoryId: string, itemName: string): string {
  const category = defaultCategories.find((c) => c.id === categoryId);

  // Specific item icons
  const itemIcons: Record<string, string> = {
    // Food
    'りんご': '🍎', 'バナナ': '🍌', 'トマト': '🍅', 'にんじん': '🥕',
    'パン': '🍞', '米': '🍚', '卵': '🥚', '牛乳': '🥛',
    '肉': '🥩', '魚': '🐟', '野菜': '🥬', '果物': '🍇',
    // Electronics
    'スマホ': '📱', 'パソコン': '💻', 'カメラ': '📷', 'テレビ': '📺',
    'イヤホン': '🎧', 'ゲーム': '🎮', '充電器': '🔌',
    // Clothes
    'シャツ': '👔', 'Tシャツ': '👕', '靴': '👟', '帽子': '🧢',
    'ズボン': '👖', 'ドレス': '👗', 'コート': '🧥',
    // Kitchen
    'フライパン': '🍳', '鍋': '🍲', 'カップ': '☕', 'お皿': '🍽️',
    // Other
    '本': '📖', '薬': '💊', 'ペン': '🖊️', 'はさみ': '✂️',
  };

  for (const [keyword, icon] of Object.entries(itemIcons)) {
    if (itemName.includes(keyword)) {
      return icon;
    }
  }

  return category?.icon || '📦';
}

// Location suggestions
export const locationSuggestions = [
  'リビング', '寝室', 'キッチン', '浴室', 'トイレ', '玄関',
  'クローゼット', '押入れ', '引き出し', '棚', '冷蔵庫', '冷凍庫',
  'パントリー', '洗面所', 'ベランダ', '物置', 'ガレージ',
];
