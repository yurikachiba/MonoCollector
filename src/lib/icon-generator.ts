// Auto Icon Generator - ジェン文字の上位互換
// 名前から一貫したユニークなアイコンを自動生成

export type IconStyle = 'geometric' | 'abstract' | 'pixel' | 'gradient' | 'ring';

export interface GeneratedIcon {
  svg: string;
  dataUrl: string;
  primaryColor: string;
  secondaryColor: string;
  style: IconStyle;
}

// 文字列からハッシュ値を生成
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// HSLをHEXに変換
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// 名前から頭文字を取得（日本語対応）
function getInitials(name: string): string {
  // 日本語の場合は最初の2文字
  const japaneseMatch = name.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/);
  if (japaneseMatch) {
    return name.slice(0, Math.min(2, name.length));
  }

  // 英語の場合は各単語の頭文字
  const words = name.split(/[\s\-_]+/).filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, Math.min(2, name.length)).toUpperCase();
}

// Geometric スタイル（幾何学的パターン）
function generateGeometricSvg(name: string, size: number = 64): string {
  const hash = hashString(name);
  const primaryHue = hash % 360;
  const secondaryHue = (primaryHue + 120) % 360;
  const primary = `hsl(${primaryHue}, 70%, 55%)`;
  const secondary = `hsl(${secondaryHue}, 60%, 65%)`;
  const bg = `hsl(${primaryHue}, 25%, 95%)`;

  const initials = getInitials(name);
  const shapes: string[] = [];

  // パターン生成（ハッシュベース）
  const patternType = hash % 5;
  const cx = size / 2;
  const cy = size / 2;

  switch (patternType) {
    case 0: // 円形パターン
      shapes.push(`<circle cx="${cx}" cy="${cy}" r="${size * 0.4}" fill="${primary}" opacity="0.3"/>`);
      shapes.push(`<circle cx="${cx}" cy="${cy}" r="${size * 0.25}" fill="${secondary}" opacity="0.5"/>`);
      break;
    case 1: // 六角形
      const hexPoints = Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 - 30) * Math.PI / 180;
        return `${cx + size * 0.35 * Math.cos(angle)},${cy + size * 0.35 * Math.sin(angle)}`;
      }).join(' ');
      shapes.push(`<polygon points="${hexPoints}" fill="${primary}" opacity="0.4"/>`);
      break;
    case 2: // 三角形
      shapes.push(`<polygon points="${cx},${cy - size * 0.3} ${cx - size * 0.26},${cy + size * 0.2} ${cx + size * 0.26},${cy + size * 0.2}" fill="${primary}" opacity="0.4"/>`);
      break;
    case 3: // 四角形回転
      shapes.push(`<rect x="${cx - size * 0.2}" y="${cy - size * 0.2}" width="${size * 0.4}" height="${size * 0.4}" fill="${primary}" opacity="0.4" transform="rotate(45 ${cx} ${cy})"/>`);
      break;
    case 4: // 複合パターン
      shapes.push(`<circle cx="${cx - size * 0.15}" cy="${cy - size * 0.15}" r="${size * 0.15}" fill="${primary}" opacity="0.3"/>`);
      shapes.push(`<circle cx="${cx + size * 0.15}" cy="${cy + size * 0.15}" r="${size * 0.15}" fill="${secondary}" opacity="0.3"/>`);
      break;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bg}" rx="${size * 0.15}"/>
    ${shapes.join('\n    ')}
    <text x="${cx}" y="${cy}" font-family="system-ui, sans-serif" font-size="${size * 0.35}" font-weight="600" fill="${primary}" text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`;
}

// Abstract スタイル（抽象的なグラデーション）
function generateAbstractSvg(name: string, size: number = 64): string {
  const hash = hashString(name);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 40 + (hash % 80)) % 360;
  const hue3 = (hue2 + 40 + (hash % 80)) % 360;

  const initials = getInitials(name);
  const gradientId = `grad-${hash}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:hsl(${hue1}, 80%, 65%)"/>
        <stop offset="50%" style="stop-color:hsl(${hue2}, 75%, 60%)"/>
        <stop offset="100%" style="stop-color:hsl(${hue3}, 70%, 55%)"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#${gradientId})" rx="${size * 0.15}"/>
    <text x="${size/2}" y="${size/2}" font-family="system-ui, sans-serif" font-size="${size * 0.35}" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="central" style="text-shadow: 0 1px 2px rgba(0,0,0,0.3)">${initials}</text>
  </svg>`;
}

// Pixel スタイル（ピクセルアートパターン）
function generatePixelSvg(name: string, size: number = 64): string {
  const hash = hashString(name);
  const hue = hash % 360;
  const primary = `hsl(${hue}, 70%, 55%)`;
  const secondary = `hsl(${hue}, 50%, 75%)`;
  const bg = `hsl(${hue}, 20%, 95%)`;

  const initials = getInitials(name);
  const gridSize = 5;
  const cellSize = size / (gridSize + 2);
  const pixels: string[] = [];

  // 対称的なピクセルパターン生成
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < Math.ceil(gridSize / 2); x++) {
      const bit = (hash >> (y * 3 + x)) & 1;
      if (bit) {
        const color = ((hash >> (y + x)) & 1) ? primary : secondary;
        // 左側
        pixels.push(`<rect x="${(x + 1) * cellSize}" y="${(y + 1) * cellSize}" width="${cellSize * 0.9}" height="${cellSize * 0.9}" fill="${color}" rx="1"/>`);
        // 右側（対称）
        const mirrorX = gridSize - 1 - x;
        if (mirrorX !== x) {
          pixels.push(`<rect x="${(mirrorX + 1) * cellSize}" y="${(y + 1) * cellSize}" width="${cellSize * 0.9}" height="${cellSize * 0.9}" fill="${color}" rx="1"/>`);
        }
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bg}" rx="${size * 0.12}"/>
    ${pixels.join('\n    ')}
    <text x="${size/2}" y="${size/2}" font-family="monospace" font-size="${size * 0.25}" font-weight="700" fill="${primary}" text-anchor="middle" dominant-baseline="central" opacity="0.8">${initials}</text>
  </svg>`;
}

// Gradient スタイル（美しいグラデーション背景）
function generateGradientSvg(name: string, size: number = 64): string {
  const hash = hashString(name);
  const hue = hash % 360;

  const initials = getInitials(name);
  const gradientId = `ring-grad-${hash}`;

  // グラデーションの方向をハッシュで決定
  const angle = (hash % 4) * 90;
  const x1 = angle === 90 || angle === 180 ? '100%' : '0%';
  const y1 = angle === 180 || angle === 270 ? '100%' : '0%';
  const x2 = angle === 270 || angle === 0 ? '100%' : '0%';
  const y2 = angle === 0 || angle === 90 ? '100%' : '0%';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="${gradientId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
        <stop offset="0%" style="stop-color:hsl(${hue}, 85%, 60%)"/>
        <stop offset="100%" style="stop-color:hsl(${(hue + 60) % 360}, 80%, 50%)"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#${gradientId})" rx="${size * 0.2}"/>
    <text x="${size/2}" y="${size/2}" font-family="system-ui, sans-serif" font-size="${size * 0.38}" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`;
}

// Ring スタイル（円環デザイン）
function generateRingSvg(name: string, size: number = 64): string {
  const hash = hashString(name);
  const hue = hash % 360;
  const primary = `hsl(${hue}, 75%, 55%)`;
  const secondary = `hsl(${(hue + 180) % 360}, 65%, 60%)`;
  const bg = `hsl(${hue}, 15%, 97%)`;

  const initials = getInitials(name);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  // 円弧の数をハッシュで決定
  const arcCount = 2 + (hash % 4);
  const arcs: string[] = [];

  for (let i = 0; i < arcCount; i++) {
    const startAngle = (360 / arcCount * i + (hash % 30)) * Math.PI / 180;
    const endAngle = startAngle + (Math.PI / arcCount) * 1.5;
    const color = i % 2 === 0 ? primary : secondary;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    arcs.push(`<path d="M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}" stroke="${color}" stroke-width="${size * 0.06}" fill="none" stroke-linecap="round" opacity="0.7"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bg}" rx="${size * 0.15}"/>
    ${arcs.join('\n    ')}
    <text x="${cx}" y="${cy}" font-family="system-ui, sans-serif" font-size="${size * 0.32}" font-weight="600" fill="${primary}" text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`;
}

// メインのアイコン生成関数
export function generateIcon(name: string, style?: IconStyle, size: number = 64): GeneratedIcon {
  const hash = hashString(name);
  const selectedStyle = style || (['geometric', 'abstract', 'pixel', 'gradient', 'ring'] as IconStyle[])[hash % 5];

  let svg: string;
  switch (selectedStyle) {
    case 'geometric':
      svg = generateGeometricSvg(name, size);
      break;
    case 'abstract':
      svg = generateAbstractSvg(name, size);
      break;
    case 'pixel':
      svg = generatePixelSvg(name, size);
      break;
    case 'gradient':
      svg = generateGradientSvg(name, size);
      break;
    case 'ring':
      svg = generateRingSvg(name, size);
      break;
    default:
      svg = generateGeometricSvg(name, size);
  }

  const primaryHue = hash % 360;
  const secondaryHue = (primaryHue + 120) % 360;

  return {
    svg,
    dataUrl: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`,
    primaryColor: hslToHex(primaryHue, 70, 55),
    secondaryColor: hslToHex(secondaryHue, 60, 65),
    style: selectedStyle,
  };
}

// 全スタイルのプレビューを生成
export function generateAllStyles(name: string, size: number = 64): Record<IconStyle, GeneratedIcon> {
  return {
    geometric: generateIcon(name, 'geometric', size),
    abstract: generateIcon(name, 'abstract', size),
    pixel: generateIcon(name, 'pixel', size),
    gradient: generateIcon(name, 'gradient', size),
    ring: generateIcon(name, 'ring', size),
  };
}

// SVGをBlobに変換（画像として保存用）
export function svgToBlob(svg: string): Blob {
  return new Blob([svg], { type: 'image/svg+xml' });
}

// SVGをPNG Data URLに変換
export async function svgToPngDataUrl(svg: string, size: number = 128): Promise<string> {
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

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  });
}
