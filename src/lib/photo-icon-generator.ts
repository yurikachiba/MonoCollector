// Photo-based Icon Generator - 写真からオリジナルアイコンを生成
// モノの写真を分析して、ユニークなアイコンを自動生成

export interface PhotoIcon {
  id: string;
  svg: string;
  dataUrl: string;
  colors: string[];
  style: PhotoIconStyle;
  createdAt: Date;
}

export type PhotoIconStyle = 'mosaic' | 'gradient' | 'geometric' | 'abstract' | 'pixel';

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  count: number;
}

// 画像から色を抽出
export async function extractColorsFromImage(
  imageDataUrl: string,
  sampleSize: number = 5
): Promise<ColorInfo[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 50; // サンプリング用の小さいサイズ
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve([]);
        return;
      }

      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);
      const pixels = imageData.data;

      // 色をカウント
      const colorMap = new Map<string, ColorInfo>();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // 色を量子化（似た色をグループ化）
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;
        const key = `${qr},${qg},${qb}`;

        if (colorMap.has(key)) {
          colorMap.get(key)!.count++;
        } else {
          const hex = rgbToHex(qr, qg, qb);
          const hsl = rgbToHsl(qr, qg, qb);
          colorMap.set(key, {
            hex,
            rgb: { r: qr, g: qg, b: qb },
            hsl,
            count: 1,
          });
        }
      }

      // 頻度順にソートして上位を返す
      const sortedColors = Array.from(colorMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, sampleSize);

      resolve(sortedColors);
    };

    img.onerror = () => resolve([]);
    img.src = imageDataUrl;
  });
}

// RGB to HEX
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.min(255, Math.max(0, x)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// RGB to HSL
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// 画像からハッシュを生成（一貫性のため）
async function getImageHash(imageDataUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 8;
      canvas.height = 8;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(Date.now());
        return;
      }

      ctx.drawImage(img, 0, 0, 8, 8);
      const data = ctx.getImageData(0, 0, 8, 8).data;

      let hash = 0;
      for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        hash = ((hash << 5) - hash) + Math.round(gray);
        hash = hash & hash;
      }

      resolve(Math.abs(hash));
    };
    img.onerror = () => resolve(Date.now());
    img.src = imageDataUrl;
  });
}

// Mosaic スタイル - 抽出した色でモザイクパターン
function generateMosaicSvg(colors: ColorInfo[], hash: number, size: number = 64): string {
  const gridSize = 4;
  const cellSize = size / gridSize;
  const cells: string[] = [];

  const bgColor = colors[0]?.hex || '#e5e7eb';

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const colorIndex = (hash + x * 3 + y * 7) % colors.length;
      const color = colors[colorIndex]?.hex || bgColor;
      const opacity = 0.6 + (((hash >> (x + y)) & 3) / 10);

      cells.push(`<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}" opacity="${opacity}"/>`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size * 0.12}"/>
    ${cells.join('\n    ')}
    <rect width="${size}" height="${size}" fill="none" stroke="${colors[1]?.hex || '#9ca3af'}" stroke-width="2" rx="${size * 0.12}"/>
  </svg>`;
}

// Gradient スタイル - 抽出した色でグラデーション
function generateGradientIconSvg(colors: ColorInfo[], hash: number, size: number = 64): string {
  const gradientId = `grad-${hash}`;
  const angle = (hash % 4) * 90;

  const color1 = colors[0]?.hex || '#6366f1';
  const color2 = colors[1]?.hex || '#8b5cf6';
  const color3 = colors[2]?.hex || '#a855f7';

  const x1 = angle === 90 || angle === 180 ? '100%' : '0%';
  const y1 = angle === 180 || angle === 270 ? '100%' : '0%';
  const x2 = angle === 270 || angle === 0 ? '100%' : '0%';
  const y2 = angle === 0 || angle === 90 ? '100%' : '0%';

  // 装飾パターン
  const patternType = hash % 4;
  let decoration = '';
  const cx = size / 2;
  const cy = size / 2;

  switch (patternType) {
    case 0:
      decoration = `<circle cx="${cx}" cy="${cy}" r="${size * 0.25}" fill="white" opacity="0.2"/>`;
      break;
    case 1:
      decoration = `<polygon points="${cx},${cy - size * 0.2} ${cx - size * 0.17},${cy + size * 0.12} ${cx + size * 0.17},${cy + size * 0.12}" fill="white" opacity="0.2"/>`;
      break;
    case 2:
      decoration = `<rect x="${cx - size * 0.15}" y="${cy - size * 0.15}" width="${size * 0.3}" height="${size * 0.3}" fill="white" opacity="0.2" transform="rotate(45 ${cx} ${cy})"/>`;
      break;
    case 3:
      const hexPoints = Array.from({ length: 6 }, (_, i) => {
        const a = (i * 60 - 30) * Math.PI / 180;
        return `${cx + size * 0.2 * Math.cos(a)},${cy + size * 0.2 * Math.sin(a)}`;
      }).join(' ');
      decoration = `<polygon points="${hexPoints}" fill="white" opacity="0.2"/>`;
      break;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="${gradientId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="50%" style="stop-color:${color2}"/>
        <stop offset="100%" style="stop-color:${color3}"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#${gradientId})" rx="${size * 0.15}"/>
    ${decoration}
  </svg>`;
}

// Geometric スタイル - 抽出した色で幾何学模様
function generateGeometricIconSvg(colors: ColorInfo[], hash: number, size: number = 64): string {
  const cx = size / 2;
  const cy = size / 2;
  const bgColor = colors[0]?.hex || '#f3f4f6';
  const primaryColor = colors[1]?.hex || '#6366f1';
  const secondaryColor = colors[2]?.hex || '#8b5cf6';

  const shapes: string[] = [];
  const shapeCount = 3 + (hash % 4);

  for (let i = 0; i < shapeCount; i++) {
    const shapeType = (hash >> (i * 2)) % 4;
    const offset = (i - shapeCount / 2) * (size * 0.1);
    const color = i % 2 === 0 ? primaryColor : secondaryColor;
    const opacity = 0.4 + (i * 0.1);

    switch (shapeType) {
      case 0:
        shapes.push(`<circle cx="${cx + offset}" cy="${cy + offset * 0.5}" r="${size * (0.15 + i * 0.05)}" fill="${color}" opacity="${opacity}"/>`);
        break;
      case 1:
        const angle = (hash + i * 45) * Math.PI / 180;
        shapes.push(`<rect x="${cx - size * 0.1}" y="${cy - size * 0.1}" width="${size * 0.2}" height="${size * 0.2}" fill="${color}" opacity="${opacity}" transform="rotate(${angle * 180 / Math.PI} ${cx} ${cy})"/>`);
        break;
      case 2:
        const triSize = size * (0.15 + i * 0.03);
        shapes.push(`<polygon points="${cx},${cy - triSize} ${cx - triSize * 0.87},${cy + triSize * 0.5} ${cx + triSize * 0.87},${cy + triSize * 0.5}" fill="${color}" opacity="${opacity}"/>`);
        break;
      case 3:
        shapes.push(`<ellipse cx="${cx + offset}" cy="${cy}" rx="${size * 0.2}" ry="${size * 0.1}" fill="${color}" opacity="${opacity}"/>`);
        break;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size * 0.15}"/>
    ${shapes.join('\n    ')}
  </svg>`;
}

// Abstract スタイル - 抽出した色で抽象的なパターン
function generateAbstractIconSvg(colors: ColorInfo[], hash: number, size: number = 64): string {
  const cx = size / 2;
  const cy = size / 2;
  const bgColor = colors[0]?.hex || '#fef3c7';

  const paths: string[] = [];
  const pathCount = 2 + (hash % 3);

  for (let i = 0; i < pathCount; i++) {
    const color = colors[(i + 1) % colors.length]?.hex || '#f59e0b';
    const opacity = 0.5 + (i * 0.15);

    // ベジェ曲線で波形を生成
    const startX = (hash >> i) % (size * 0.3);
    const startY = size * 0.3 + ((hash >> (i + 4)) % (size * 0.4));
    const cp1x = size * 0.3 + ((hash >> (i + 2)) % (size * 0.4));
    const cp1y = ((hash >> (i + 6)) % (size * 0.5));
    const cp2x = size * 0.5 + ((hash >> (i + 3)) % (size * 0.3));
    const cp2y = size - ((hash >> (i + 5)) % (size * 0.3));
    const endX = size - ((hash >> (i + 1)) % (size * 0.2));
    const endY = size * 0.5 + ((hash >> (i + 7)) % (size * 0.3));

    paths.push(`<path d="M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}" stroke="${color}" stroke-width="${3 + i}" fill="none" opacity="${opacity}" stroke-linecap="round"/>`);
  }

  // アクセント円
  const accentColor = colors[colors.length - 1]?.hex || '#fbbf24';
  paths.push(`<circle cx="${cx + (hash % 10) - 5}" cy="${cy + ((hash >> 4) % 10) - 5}" r="${size * 0.08}" fill="${accentColor}" opacity="0.7"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size * 0.15}"/>
    ${paths.join('\n    ')}
  </svg>`;
}

// Pixel スタイル - 抽出した色でピクセルアート
function generatePixelIconSvg(colors: ColorInfo[], hash: number, size: number = 64): string {
  const gridSize = 6;
  const cellSize = size / gridSize;
  const pixels: string[] = [];

  const bgColor = colors[0]?.hex || '#f5f5f5';

  // 対称的なピクセルパターン
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < Math.ceil(gridSize / 2); x++) {
      const bit = (hash >> (y * 3 + x)) & 1;
      if (bit || ((hash >> (y + x * 2)) & 1)) {
        const colorIndex = 1 + ((hash >> (y + x)) % (colors.length - 1));
        const color = colors[colorIndex]?.hex || colors[1]?.hex || '#6366f1';

        // 左側
        pixels.push(`<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize * 0.9}" height="${cellSize * 0.9}" fill="${color}" rx="1"/>`);

        // 右側（対称）
        const mirrorX = gridSize - 1 - x;
        if (mirrorX !== x) {
          pixels.push(`<rect x="${mirrorX * cellSize}" y="${y * cellSize}" width="${cellSize * 0.9}" height="${cellSize * 0.9}" fill="${color}" rx="1"/>`);
        }
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size * 0.12}"/>
    ${pixels.join('\n    ')}
  </svg>`;
}

// メイン: 写真からアイコンを生成
export async function generateIconFromPhoto(
  imageDataUrl: string,
  style?: PhotoIconStyle,
  size: number = 64
): Promise<PhotoIcon> {
  const colors = await extractColorsFromImage(imageDataUrl, 5);
  const hash = await getImageHash(imageDataUrl);

  // スタイルが指定されていなければハッシュから決定
  const styles: PhotoIconStyle[] = ['mosaic', 'gradient', 'geometric', 'abstract', 'pixel'];
  const selectedStyle = style || styles[hash % styles.length];

  let svg: string;
  switch (selectedStyle) {
    case 'mosaic':
      svg = generateMosaicSvg(colors, hash, size);
      break;
    case 'gradient':
      svg = generateGradientIconSvg(colors, hash, size);
      break;
    case 'geometric':
      svg = generateGeometricIconSvg(colors, hash, size);
      break;
    case 'abstract':
      svg = generateAbstractIconSvg(colors, hash, size);
      break;
    case 'pixel':
      svg = generatePixelIconSvg(colors, hash, size);
      break;
    default:
      svg = generateMosaicSvg(colors, hash, size);
  }

  const id = `icon-${hash}-${Date.now()}`;

  return {
    id,
    svg,
    dataUrl: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`,
    colors: colors.map(c => c.hex),
    style: selectedStyle,
    createdAt: new Date(),
  };
}

// 全スタイルのプレビューを生成
export async function generateAllPhotoIconStyles(
  imageDataUrl: string,
  size: number = 64
): Promise<Record<PhotoIconStyle, PhotoIcon>> {
  const colors = await extractColorsFromImage(imageDataUrl, 5);
  const hash = await getImageHash(imageDataUrl);

  const styles: PhotoIconStyle[] = ['mosaic', 'gradient', 'geometric', 'abstract', 'pixel'];
  const result: Partial<Record<PhotoIconStyle, PhotoIcon>> = {};

  for (const style of styles) {
    let svg: string;
    switch (style) {
      case 'mosaic':
        svg = generateMosaicSvg(colors, hash, size);
        break;
      case 'gradient':
        svg = generateGradientIconSvg(colors, hash, size);
        break;
      case 'geometric':
        svg = generateGeometricIconSvg(colors, hash, size);
        break;
      case 'abstract':
        svg = generateAbstractIconSvg(colors, hash, size);
        break;
      case 'pixel':
        svg = generatePixelIconSvg(colors, hash, size);
        break;
    }

    result[style] = {
      id: `icon-${hash}-${style}`,
      svg,
      dataUrl: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`,
      colors: colors.map(c => c.hex),
      style,
      createdAt: new Date(),
    };
  }

  return result as Record<PhotoIconStyle, PhotoIcon>;
}

// SVGをPNG Data URLに変換
export async function photoIconToPngDataUrl(icon: PhotoIcon, size: number = 128): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };

    img.src = icon.dataUrl;
  });
}
