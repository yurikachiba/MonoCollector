'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import {
  PhotoIcon,
  PhotoIconStyle,
  generateIconFromPhoto,
  generateAllPhotoIconStyles,
} from '@/lib/photo-icon-generator';

interface PhotoIconGeneratorProps {
  imageDataUrl: string;
  onSelect: (icon: PhotoIcon) => void;
  showAllStyles?: boolean;
}

const styleNames: Record<PhotoIconStyle, string> = {
  mosaic: 'モザイク',
  gradient: 'グラデ',
  geometric: '幾何学',
  abstract: '抽象',
  pixel: 'ピクセル',
};

export default function PhotoIconGenerator({
  imageDataUrl,
  onSelect,
  showAllStyles = true,
}: PhotoIconGeneratorProps) {
  const [icons, setIcons] = useState<Record<PhotoIconStyle, PhotoIcon> | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<PhotoIconStyle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const prevImageRef = useRef<string>('');
  const onSelectRef = useRef(onSelect);

  // onSelectが変わってもeffectを再実行しないようにrefで保持
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const generateIcons = useCallback(async (dataUrl: string) => {
    if (showAllStyles) {
      const allIcons = await generateAllPhotoIconStyles(dataUrl, 64);
      const firstStyle = Object.keys(allIcons)[0] as PhotoIconStyle;
      setIcons(allIcons);
      setSelectedStyle(firstStyle);
      onSelectRef.current(allIcons[firstStyle]);
    } else {
      const icon = await generateIconFromPhoto(dataUrl, undefined, 64);
      setIcons({ [icon.style]: icon } as Record<PhotoIconStyle, PhotoIcon>);
      setSelectedStyle(icon.style);
      onSelectRef.current(icon);
    }
    setIsLoading(false);
  }, [showAllStyles]);

  useEffect(() => {
    // 同じ画像なら何もしない
    if (imageDataUrl === prevImageRef.current) {
      return;
    }
    prevImageRef.current = imageDataUrl;

    if (!imageDataUrl) {
      // リセット処理 - 画像が空になった場合の初期化は問題ない
      /* eslint-disable react-hooks/set-state-in-effect */
      setIcons(null);
      setSelectedStyle(null);
      setIsLoading(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    setIsLoading(true);
    generateIcons(imageDataUrl);
  }, [imageDataUrl, generateIcons]);

  const handleStyleSelect = (style: PhotoIconStyle) => {
    if (icons && icons[style]) {
      setSelectedStyle(style);
      onSelect(icons[style]);
    }
  };

  if (!imageDataUrl) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>アイコン生成中...</span>
        </div>
      </div>
    );
  }

  if (!icons) {
    return null;
  }

  const styles = Object.keys(icons) as PhotoIconStyle[];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <span>オリジナルアイコン</span>
      </div>

      {/* スタイル選択 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {styles.map((style) => {
          const icon = icons[style];
          const isSelected = selectedStyle === style;

          return (
            <motion.button
              key={style}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStyleSelect(style)}
              className={`relative flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isSelected
                  ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-500'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {/* アイコンプレビュー */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image
                  src={icon.dataUrl}
                  alt={`${styleNames[style]} style`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 bg-purple-500/20 flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 text-purple-600" />
                  </motion.div>
                )}
              </div>

              {/* スタイル名 */}
              <span
                className={`text-[10px] font-medium ${
                  isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'
                }`}
              >
                {styleNames[style]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 抽出した色のプレビュー */}
      {selectedStyle && icons[selectedStyle] && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">抽出色:</span>
          <div className="flex gap-1">
            {icons[selectedStyle].colors.slice(0, 5).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
