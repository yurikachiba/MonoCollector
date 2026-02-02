'use client';

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// 食品・食材 - かわいいリンゴ
export function FoodIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* リンゴ本体 */}
      <ellipse cx="16" cy="19" rx="11" ry="10" fill="#FF6B6B" />
      <ellipse cx="12" cy="17" rx="3" ry="4" fill="#FF8A8A" opacity="0.6" />
      {/* ヘタ */}
      <path d="M16 9 C16 9, 18 6, 22 7" stroke="#8B5A2B" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* 葉っぱ */}
      <ellipse cx="20" cy="8" rx="3" ry="2" fill="#4CAF50" transform="rotate(-20 20 8)" />
      <path d="M19 8 L21 7" stroke="#2E7D32" strokeWidth="0.5" />
    </svg>
  );
}

// キッチン用品 - かわいいフライパン
export function KitchenIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* フライパン本体 */}
      <circle cx="14" cy="16" r="10" fill="#4ECDC4" />
      <circle cx="14" cy="16" r="7" fill="#3DB9B0" />
      {/* ハイライト */}
      <ellipse cx="11" cy="14" rx="2" ry="2.5" fill="#6EE7DF" opacity="0.5" />
      {/* 持ち手 */}
      <rect x="23" y="14" width="7" height="4" rx="1" fill="#795548" />
      <rect x="23" y="14" width="7" height="1.5" rx="0.5" fill="#8D6E63" />
    </svg>
  );
}

// 衣類 - かわいいTシャツ
export function ClothesIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* Tシャツ本体 */}
      <path
        d="M8 8 L12 6 L16 8 L20 6 L24 8 L26 12 L22 14 L22 26 L10 26 L10 14 L6 12 Z"
        fill="#45B7D1"
      />
      {/* 襟ぐり */}
      <path d="M12 6 Q16 10 20 6" stroke="#3A9FC1" strokeWidth="1.5" fill="none" />
      {/* ハイライト */}
      <path d="M10 14 L10 24" stroke="#67C7DD" strokeWidth="2" opacity="0.4" />
      {/* 袖のライン */}
      <path d="M8 8 L6 12" stroke="#3A9FC1" strokeWidth="1" />
      <path d="M24 8 L26 12" stroke="#3A9FC1" strokeWidth="1" />
    </svg>
  );
}

// 電子機器 - かわいいスマートフォン
export function ElectronicsIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* スマホ本体 */}
      <rect x="9" y="4" width="14" height="24" rx="3" fill="#96CEB4" />
      {/* スクリーン */}
      <rect x="11" y="7" width="10" height="15" rx="1" fill="#E8F5E9" />
      {/* ハイライト */}
      <rect x="11" y="7" width="4" height="15" rx="1" fill="#F1F8E9" opacity="0.5" />
      {/* ホームボタン */}
      <circle cx="16" cy="25" r="1.5" fill="#7CB99B" />
      {/* ノッチ */}
      <rect x="14" y="5" width="4" height="1" rx="0.5" fill="#7CB99B" />
    </svg>
  );
}

// 本・書籍 - かわいい本
export function BooksIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* 下の本 */}
      <rect x="6" y="18" width="20" height="6" rx="1" fill="#FFD93D" />
      <rect x="6" y="18" width="20" height="2" rx="0.5" fill="#FFE566" />
      {/* 中の本 */}
      <rect x="5" y="12" width="22" height="6" rx="1" fill="#6BCB77" />
      <rect x="5" y="12" width="22" height="2" rx="0.5" fill="#8ADB8A" />
      {/* 上の本 */}
      <rect x="7" y="6" width="18" height="6" rx="1" fill="#4D96FF" />
      <rect x="7" y="6" width="18" height="2" rx="0.5" fill="#70ABFF" />
      {/* 背表紙の飾り */}
      <rect x="8" y="7" width="1" height="4" fill="#3A7BD5" />
      <rect x="6" y="13" width="1" height="4" fill="#5AB85A" />
      <rect x="7" y="19" width="1" height="4" fill="#E6C200" />
    </svg>
  );
}

// コスメ・美容 - かわいいリップ
export function CosmeticsIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* キャップ */}
      <rect x="12" y="4" width="8" height="8" rx="1" fill="#DDA0DD" />
      <rect x="12" y="4" width="8" height="3" rx="1" fill="#E8B8E8" />
      {/* 本体 */}
      <rect x="11" y="12" width="10" height="12" rx="1" fill="#C770C7" />
      {/* リップ部分 */}
      <path
        d="M13 24 L13 28 Q16 30 19 28 L19 24 Z"
        fill="#FF6B9D"
      />
      <path
        d="M13 24 L13 26 Q16 28 19 26 L19 24 Z"
        fill="#FF89B3"
      />
      {/* ハイライト */}
      <rect x="12" y="13" width="2" height="8" fill="#D68AD6" opacity="0.5" />
    </svg>
  );
}

// 文房具 - かわいい鉛筆
export function StationeryIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* 鉛筆本体 */}
      <rect x="8" y="6" width="8" height="18" rx="1" fill="#98D8C8" />
      {/* ハイライト */}
      <rect x="8" y="6" width="3" height="18" fill="#B0E5D8" opacity="0.6" />
      {/* 芯 */}
      <polygon points="8,24 12,30 16,24" fill="#FFE4B5" />
      <polygon points="10,26 12,30 14,26" fill="#4A4A4A" />
      {/* 消しゴム */}
      <rect x="8" y="4" width="8" height="3" rx="1" fill="#FF9999" />
      {/* 金属部分 */}
      <rect x="7" y="6" width="10" height="2" fill="#C0C0C0" />
      <rect x="7" y="6" width="10" height="0.5" fill="#E0E0E0" />
    </svg>
  );
}

// おもちゃ・ホビー - かわいいゲームコントローラー
export function ToysIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* コントローラー本体 */}
      <rect x="4" y="10" width="24" height="14" rx="4" fill="#F7DC6F" />
      {/* 左側（十字キー） */}
      <rect x="7" y="14" width="6" height="2" rx="0.5" fill="#D4AC0D" />
      <rect x="9" y="12" width="2" height="6" rx="0.5" fill="#D4AC0D" />
      {/* 右側（ボタン） */}
      <circle cx="22" cy="14" r="2" fill="#FF6B6B" />
      <circle cx="26" cy="17" r="2" fill="#4ECDC4" />
      <circle cx="22" cy="20" r="2" fill="#45B7D1" />
      {/* ハイライト */}
      <rect x="4" y="10" width="24" height="4" rx="4" fill="#FCE883" opacity="0.5" />
    </svg>
  );
}

// 掃除用品 - かわいいほうき
export function CleaningIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* ほうき部分 */}
      <path
        d="M10 20 Q8 28 6 30 L26 30 Q24 28 22 20 Z"
        fill="#85C1E9"
      />
      <path
        d="M10 20 Q9 24 8 26 L24 26 Q23 24 22 20 Z"
        fill="#A9D4F0"
        opacity="0.5"
      />
      {/* 柄 */}
      <rect x="14" y="2" width="4" height="19" rx="1" fill="#8B5A2B" />
      <rect x="14" y="2" width="1.5" height="19" fill="#A0522D" opacity="0.5" />
      {/* 留め具 */}
      <rect x="12" y="19" width="8" height="3" rx="1" fill="#C0C0C0" />
      <rect x="12" y="19" width="8" height="1" rx="0.5" fill="#E0E0E0" />
    </svg>
  );
}

// 薬・医療品 - かわいいカプセル
export function MedicineIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* カプセル本体 */}
      <rect x="10" y="6" width="12" height="20" rx="6" fill="#F1948A" />
      {/* 上半分 */}
      <path
        d="M10 16 L22 16 L22 12 Q22 6 16 6 Q10 6 10 12 Z"
        fill="#FADBD8"
      />
      {/* ハイライト */}
      <ellipse cx="13" cy="11" rx="1.5" ry="3" fill="#FFF" opacity="0.4" />
      {/* 中央ライン */}
      <rect x="10" y="15" width="12" height="2" fill="#E74C3C" opacity="0.3" />
      {/* キラキラ */}
      <circle cx="24" cy="8" r="1" fill="#FFD700" />
      <circle cx="8" cy="22" r="0.8" fill="#FFD700" />
    </svg>
  );
}

// 家具・インテリア - かわいい椅子
export function FurnitureIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* 背もたれ */}
      <rect x="8" y="4" width="16" height="10" rx="2" fill="#D7BDE2" />
      <rect x="8" y="4" width="16" height="4" rx="2" fill="#E8D4F0" opacity="0.5" />
      {/* 座面 */}
      <rect x="6" y="14" width="20" height="6" rx="2" fill="#BB8FCE" />
      <rect x="6" y="14" width="20" height="2" rx="1" fill="#D2B4DE" opacity="0.5" />
      {/* 脚 */}
      <rect x="8" y="20" width="3" height="8" rx="1" fill="#8E44AD" />
      <rect x="21" y="20" width="3" height="8" rx="1" fill="#8E44AD" />
      {/* 脚のハイライト */}
      <rect x="8" y="20" width="1" height="8" fill="#9B59B6" opacity="0.5" />
      <rect x="21" y="20" width="1" height="8" fill="#9B59B6" opacity="0.5" />
    </svg>
  );
}

// スポーツ用品 - かわいいサッカーボール
export function SportsIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* ボール本体 */}
      <circle cx="16" cy="16" r="12" fill="#82E0AA" />
      <circle cx="16" cy="16" r="12" fill="url(#sports-gradient)" />
      {/* 模様 */}
      <path d="M16 4 L16 10" stroke="#2ECC71" strokeWidth="2" />
      <path d="M16 22 L16 28" stroke="#2ECC71" strokeWidth="2" />
      <path d="M4 16 L10 16" stroke="#2ECC71" strokeWidth="2" />
      <path d="M22 16 L28 16" stroke="#2ECC71" strokeWidth="2" />
      <circle cx="16" cy="16" r="4" fill="#58D68D" />
      <circle cx="16" cy="16" r="2" fill="#82E0AA" />
      {/* ハイライト */}
      <ellipse cx="12" cy="10" rx="3" ry="2" fill="#FFF" opacity="0.3" />
      <defs>
        <radialGradient id="sports-gradient" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#A9DFBF" />
          <stop offset="100%" stopColor="#82E0AA" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// その他 - かわいいボックス
export function OtherIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} fill="none">
      {/* ボックス本体 */}
      <rect x="4" y="12" width="24" height="16" rx="2" fill="#AEB6BF" />
      {/* 蓋 */}
      <rect x="2" y="8" width="28" height="5" rx="1" fill="#BDC3C7" />
      {/* リボン縦 */}
      <rect x="14" y="8" width="4" height="20" fill="#FF6B6B" />
      {/* リボン横 */}
      <rect x="2" y="9" width="28" height="3" fill="#FF6B6B" />
      {/* リボン結び目 */}
      <circle cx="16" cy="8" r="3" fill="#FF8A8A" />
      <ellipse cx="12" cy="6" rx="3" ry="2" fill="#FF6B6B" transform="rotate(-30 12 6)" />
      <ellipse cx="20" cy="6" rx="3" ry="2" fill="#FF6B6B" transform="rotate(30 20 6)" />
      {/* ハイライト */}
      <rect x="4" y="12" width="10" height="16" rx="2" fill="#C4CACD" opacity="0.3" />
    </svg>
  );
}

// カテゴリIDからアイコンを取得するコンポーネント
export const categoryIconMap: Record<string, React.FC<IconProps>> = {
  food: FoodIcon,
  kitchen: KitchenIcon,
  clothes: ClothesIcon,
  electronics: ElectronicsIcon,
  books: BooksIcon,
  cosmetics: CosmeticsIcon,
  stationery: StationeryIcon,
  toys: ToysIcon,
  cleaning: CleaningIcon,
  medicine: MedicineIcon,
  furniture: FurnitureIcon,
  sports: SportsIcon,
  other: OtherIcon,
};

interface CategoryIconProps extends IconProps {
  categoryId: string;
}

export function CategoryIcon({ categoryId, size = 24, className = '' }: CategoryIconProps) {
  const IconComponent = categoryIconMap[categoryId] || OtherIcon;
  return <IconComponent size={size} className={className} />;
}

export default CategoryIcon;
