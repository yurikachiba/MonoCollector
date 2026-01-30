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
- カテゴリIDは上記リストのIDのみ使用（food, kitchen, clothes, electronics, books, cosmetics, stationery, toys, cleaning, medicine, furniture, sports, other）
- 画像に複数のアイテムが写っている場合は、メインのアイテムを認識
- 数量が複数見える場合は推定してquantityに反映
- 画像が不鮮明な場合でも最善の推測を行う`;

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
    model: 'llama-3.2-11b-vision-preview',
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

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AIの応答にJSONが含まれていませんでした');
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error('JSON parse error:', parseError, 'Content:', jsonMatch[0]);
    throw new Error('AIの応答のJSON形式が不正です');
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
