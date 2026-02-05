import Groq from 'groq-sdk';
import { defaultCategories } from './db';

const STORAGE_KEY = 'mono-collector-groq-api-key';

export interface AnalysisResult {
  name: string;
  category: string;
  icon: string;
  location: string;
  tags: string[];
  notes: string;
  quantity: number;
}

export function getStoredApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, apiKey);
}

export function removeStoredApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

const CATEGORY_LIST = defaultCategories.map(c => `${c.id}: ${c.name} (${c.icon})`).join('\n');

const SYSTEM_PROMPT = `あなたは家庭用品の認識エキスパートです。画像を分析して、以下の情報をJSON形式で返してください。

利用可能なカテゴリ:
${CATEGORY_LIST}

必ず以下のJSON形式で返してください（他のテキストは含めないでください）:
{
  "name": "アイテム名（日本語で簡潔に）",
  "category": "カテゴリID（上記リストから選択）",
  "icon": "絵文字1つ",
  "location": "推奨保管場所（キッチン、リビング、冷蔵庫など）",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "notes": "簡単な説明やメモ",
  "quantity": 1
}

注意事項:
- nameには素材名（ガラス、プラスチック、金属など）ではなく、具体的な製品名を使ってください
  - 良い例: コップ、グラス、マグカップ、ワイングラス、タンブラー
  - 悪い例: ガラス、陶器、プラスチック
- カテゴリIDは上記リストのIDのみ使用（food, kitchen, clothes, electronics, books, cosmetics, stationery, toys, cleaning, medicine, furniture, sports, other）
- 画像に複数のアイテムが写っている場合は、メインのアイテムを認識
- 数量が複数見える場合は推定してquantityに反映
- 画像が不鮮明な場合でも最善の推測を行う`;

// テキスト情報からタグを推測するためのプロンプト
const TAG_SUGGESTION_PROMPT = `あなたは家庭用品のタグ付けエキスパートです。
アイテムの情報を元に、整理や後から見返すのに役立つタグを5つ提案してください。

タグの考え方:
- アイテムの特徴（素材、色、サイズなど）
- 用途やシーン（日常使い、特別な日、季節など）
- 感情的な価値（思い出、大切、お気に入りなど）
- 時期や年齢（2024年、○歳の時など）

必ず以下のJSON形式で返してください（他のテキストは含めないでください）:
{
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"]
}`;

export interface TagSuggestionInput {
  name: string;
  category: string;
  location?: string;
}

export async function suggestTags(
  input: TagSuggestionInput,
  apiKey: string
): Promise<string[]> {
  const groq = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const { name, category, location } = input;
  const userMessage = `アイテム情報:
- 名前: ${name}
- カテゴリ: ${category}
- 保管場所: ${location || '未設定'}

このアイテムに適したタグを5つ提案してください。`;

  try {
    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'system',
          content: TAG_SUGGESTION_PROMPT,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      max_tokens: 256,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return [];
    }

    // JSONをパース
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return [];
    }

    let jsonStr = jsonMatch[0]
      .replace(/[\x00-\x1F\x7F]/g, '')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');

    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [];
  } catch (error) {
    console.error('Tag suggestion error:', error);
    return [];
  }
}

export async function analyzeImage(imageBase64: string, apiKey: string): Promise<AnalysisResult> {
  const groq = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  // Remove data URL prefix if present
  const base64Data = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  // Determine media type from data URL
  let mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' = 'image/jpeg';
  if (imageBase64.includes('data:image/png')) {
    mediaType = 'image/png';
  } else if (imageBase64.includes('data:image/webp')) {
    mediaType = 'image/webp';
  } else if (imageBase64.includes('data:image/gif')) {
    mediaType = 'image/gif';
  }

  const response = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mediaType};base64,${base64Data}`,
            },
          },
        ],
      },
    ],
    max_tokens: 1024,
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('AIからの応答がありませんでした');
  }

  // Parse JSON from response - より堅牢なパース
  let parsed;
  try {
    // まず最も外側の{}を探す
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', content);
      throw new Error('AIの応答にJSONが含まれていませんでした');
    }

    let jsonStr = jsonMatch[0];

    // JSONの不正な文字をクリーンアップ
    jsonStr = jsonStr
      .replace(/[\x00-\x1F\x7F]/g, '') // 制御文字を削除
      .replace(/,\s*}/g, '}')  // 末尾カンマを修正
      .replace(/,\s*]/g, ']'); // 配列の末尾カンマを修正

    parsed = JSON.parse(jsonStr);
  } catch (parseError) {
    console.error('JSON parse error:', parseError, 'Content:', content);
    // パース失敗時はデフォルト値を返す
    return {
      name: '認識に失敗しました',
      category: 'other',
      icon: '📦',
      location: '',
      tags: [],
      notes: 'AI解析に失敗しました。手動で入力してください。',
      quantity: 1,
    };
  }

  // Validate and normalize the result
  const validCategoryIds = defaultCategories.map(c => c.id);
  const category = validCategoryIds.includes(parsed.category) ? parsed.category : 'other';

  return {
    name: parsed.name || '不明なアイテム',
    category,
    icon: parsed.icon || '📦',
    location: parsed.location || '',
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 5) : [],
    notes: parsed.notes || '',
    quantity: typeof parsed.quantity === 'number' && parsed.quantity > 0 ? parsed.quantity : 1,
  };
}
