// AI-powered Icon Generator - 画像から絵文字風のかわいいオリジナルアイコンを生成
import Groq from 'groq-sdk';
import { getStoredApiKey } from './groq-vision';

export interface AIGeneratedIcon {
  id: string;
  svg: string;
  dataUrl: string;
  objectName: string;
  style: 'cute' | 'minimal' | 'bold';
  createdAt: Date;
}

// アイコン生成用のシステムプロンプト
const ICON_GENERATION_PROMPT = `あなたは絵文字のようなかわいいフラットデザインのSVGアイコンを生成するエキスパートです。

画像に写っているメインのオブジェクトを認識し、そのオブジェクトを表現するかわいいSVGアイコンを生成してください。

ルール:
1. SVGのサイズは viewBox="0 0 64 64" で統一
2. シンプルでかわいいフラットデザイン（絵文字のようなスタイル）
3. 丸みを帯びた形状を使用（rx, ry属性を活用）
4. 明るく鮮やかな色を使用
5. ハイライトや影を入れて立体感を出す
6. 複雑すぎない（パス数は10個以内）
7. 具体的なオブジェクトを表現（抽象的なパターンはNG）

以下のJSON形式で返してください:
{
  "objectName": "認識したオブジェクト名（日本語）",
  "svg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 64 64\\">...</svg>"
}

例（りんご）:
{
  "objectName": "りんご",
  "svg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 64 64\\"><ellipse cx=\\"32\\" cy=\\"38\\" rx=\\"22\\" ry=\\"20\\" fill=\\"#FF6B6B\\"/><ellipse cx=\\"26\\" cy=\\"34\\" rx=\\"6\\" ry=\\"8\\" fill=\\"#FF8A8A\\" opacity=\\"0.5\\"/><path d=\\"M32 18 C32 18 36 12 42 14\\" stroke=\\"#8B5A2B\\" stroke-width=\\"3\\" fill=\\"none\\" stroke-linecap=\\"round\\"/><ellipse cx=\\"40\\" cy=\\"14\\" rx=\\"6\\" ry=\\"4\\" fill=\\"#4CAF50\\" transform=\\"rotate(-20 40 14)\\"/></svg>"
}

注意:
- SVGコードは1行で、改行なし
- ダブルクォートはエスケープ（\\"）
- xmlns属性は必須
- 画像に写っている実際のオブジェクトを表現すること`;

// スタイルバリエーション用のプロンプト
const STYLE_PROMPTS: Record<AIGeneratedIcon['style'], string> = {
  cute: `かわいいスタイル:
- 丸みを帯びた形状
- パステルカラーまたは鮮やかな色
- 目を入れる場合は大きくてかわいい目
- 全体的に柔らかい印象`,

  minimal: `ミニマルスタイル:
- シンプルな形状
- 少ない色数（2-3色）
- 細い線や単純な図形
- モダンでクリーンな印象`,

  bold: `ボールドスタイル:
- はっきりした輪郭
- 濃い色使い
- 太い線
- インパクトのある印象`,
};

export async function generateIconFromImage(
  imageBase64: string,
  style: AIGeneratedIcon['style'] = 'cute'
): Promise<AIGeneratedIcon> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('APIキーが設定されていません。設定画面から登録してください。');
  }

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

  const fullPrompt = `${ICON_GENERATION_PROMPT}\n\n${STYLE_PROMPTS[style]}`;

  const response = await groq.chat.completions.create({
    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: fullPrompt,
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
    max_tokens: 2048,
    temperature: 0.7,
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

  if (!parsed.svg || !parsed.svg.includes('<svg')) {
    throw new Error('有効なSVGが生成されませんでした');
  }

  // SVGを正規化
  let svg = parsed.svg;
  // エスケープされた引用符を戻す
  svg = svg.replace(/\\"/g, '"');
  // viewBoxがない場合は追加
  if (!svg.includes('viewBox')) {
    svg = svg.replace('<svg', '<svg viewBox="0 0 64 64"');
  }
  // widthとheightを追加（表示用）
  if (!svg.includes('width=')) {
    svg = svg.replace('viewBox', 'width="64" height="64" viewBox');
  }

  const id = `ai-icon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    svg,
    dataUrl: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`,
    objectName: parsed.objectName || '不明',
    style,
    createdAt: new Date(),
  };
}

// 全スタイルのアイコンを生成
export async function generateAllIconStyles(
  imageBase64: string
): Promise<Record<AIGeneratedIcon['style'], AIGeneratedIcon>> {
  const styles: AIGeneratedIcon['style'][] = ['cute', 'minimal', 'bold'];
  const results: Partial<Record<AIGeneratedIcon['style'], AIGeneratedIcon>> = {};

  // 並列で生成（APIレート制限に注意）
  const promises = styles.map(async (style) => {
    try {
      const icon = await generateIconFromImage(imageBase64, style);
      return { style, icon };
    } catch (error) {
      console.error(`Failed to generate ${style} icon:`, error);
      return { style, icon: null };
    }
  });

  const settled = await Promise.allSettled(promises);

  for (const result of settled) {
    if (result.status === 'fulfilled' && result.value.icon) {
      results[result.value.style] = result.value.icon;
    }
  }

  // 少なくとも1つのアイコンが生成されていることを確認
  if (Object.keys(results).length === 0) {
    throw new Error('アイコンの生成に失敗しました');
  }

  return results as Record<AIGeneratedIcon['style'], AIGeneratedIcon>;
}

// SVGをPNG Data URLに変換
export async function aiIconToPngDataUrl(icon: AIGeneratedIcon, size: number = 128): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('SVGの変換に失敗しました'));
    };

    img.src = icon.dataUrl;
  });
}
