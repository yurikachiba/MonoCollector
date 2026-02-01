'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import { generateIcon, generateAllStyles, IconStyle, GeneratedIcon } from '@/lib/icon-generator';

interface IconGeneratorProps {
  name: string;
  selectedStyle?: IconStyle;
  onSelect: (icon: GeneratedIcon) => void;
  size?: number;
  showAllStyles?: boolean;
}

const styleLabels: Record<IconStyle, string> = {
  geometric: '幾何学',
  abstract: '抽象',
  pixel: 'ピクセル',
  gradient: 'グラデ',
  ring: 'リング',
};

export default function IconGenerator({
  name,
  selectedStyle,
  onSelect,
  size = 64,
  showAllStyles = false,
}: IconGeneratorProps) {
  const [currentStyle, setCurrentStyle] = useState<IconStyle | undefined>(selectedStyle);
  const [isExpanded, setIsExpanded] = useState(showAllStyles);

  // 名前が変わったらアイコンを再生成
  const icon = useMemo(() => {
    if (!name) return null;
    return generateIcon(name, currentStyle, size);
  }, [name, currentStyle, size]);

  const allIcons = useMemo(() => {
    if (!name || !isExpanded) return null;
    return generateAllStyles(name, size);
  }, [name, isExpanded, size]);

  useEffect(() => {
    if (icon) {
      onSelect(icon);
    }
  }, [icon, onSelect]);

  if (!name) {
    return (
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <Sparkles className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* メインアイコン表示 */}
      <div className="flex items-center gap-3">
        <motion.div
          key={icon?.dataUrl}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative group"
        >
          <div
            className="w-16 h-16 rounded-xl overflow-hidden shadow-md cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              backgroundImage: `url(${icon?.dataUrl})`,
              backgroundSize: 'cover',
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors" />
        </motion.div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            自動生成アイコン
          </p>
          <p className="text-xs text-gray-500">
            {icon && styleLabels[icon.style]}スタイル
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            {isExpanded ? 'スタイルを閉じる' : 'スタイルを変更'}
          </button>
        </div>
      </div>

      {/* スタイル選択パネル */}
      <AnimatePresence>
        {isExpanded && allIcons && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-5 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              {(Object.keys(allIcons) as IconStyle[]).map((style) => {
                const styleIcon = allIcons[style];
                const isSelected = icon?.style === style;

                return (
                  <button
                    key={style}
                    onClick={() => {
                      setCurrentStyle(style);
                      onSelect(styleIcon);
                    }}
                    className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-gray-700 shadow-md ring-2 ring-blue-500'
                        : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${styleIcon.dataUrl})`,
                        backgroundSize: 'cover',
                      }}
                    />
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">
                      {styleLabels[style]}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// コンパクトなアイコン表示コンポーネント（ItemCardなどで使用）
interface GeneratedIconDisplayProps {
  name: string;
  size?: number;
  className?: string;
}

export function GeneratedIconDisplay({ name, size = 48, className = '' }: GeneratedIconDisplayProps) {
  const icon = useMemo(() => {
    if (!name) return null;
    return generateIcon(name, undefined, size);
  }, [name, size]);

  if (!icon) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}>
        <Sparkles className="w-1/3 h-1/3 text-gray-400" />
      </div>
    );
  }

  return (
    <div
      className={`${className}`}
      style={{
        backgroundImage: `url(${icon.dataUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
