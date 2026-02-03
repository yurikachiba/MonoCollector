'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Check, RefreshCw, AlertCircle } from 'lucide-react';
import {
  AIGeneratedIcon,
  generateIconFromImage,
} from '@/lib/ai-icon-generator';
import { getStoredApiKey } from '@/lib/groq-vision';

interface AIIconGeneratorProps {
  imageDataUrl: string;
  onSelect: (icon: AIGeneratedIcon) => void;
}

type IconStyle = 'cute' | 'minimal' | 'bold';

const styleNames: Record<IconStyle, string> = {
  cute: 'かわいい',
  minimal: 'シンプル',
  bold: 'ボールド',
};

const styleDescriptions: Record<IconStyle, string> = {
  cute: '丸みのある絵文字風',
  minimal: 'モダンでクリーン',
  bold: 'インパクト重視',
};

export default function AIIconGenerator({
  imageDataUrl,
  onSelect,
}: AIIconGeneratorProps) {
  const [icons, setIcons] = useState<Partial<Record<IconStyle, AIGeneratedIcon>>>({});
  const [selectedStyle, setSelectedStyle] = useState<IconStyle>('cute');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStyle, setLoadingStyle] = useState<IconStyle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const prevImageRef = useRef<string>('');
  const onSelectRef = useRef(onSelect);
  const hasInitializedRef = useRef(false);

  // onSelectが変わってもeffectを再実行しないようにrefで保持
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // APIキーの確認
  useEffect(() => {
    const apiKey = getStoredApiKey();
    setHasApiKey(!!apiKey);
  }, []);

  // アイコン生成
  const generateIcon = useCallback(async (style: IconStyle) => {
    if (!imageDataUrl || !hasApiKey) return;

    setLoadingStyle(style);
    setError(null);

    try {
      const icon = await generateIconFromImage(imageDataUrl, style);
      setIcons(prev => ({ ...prev, [style]: icon }));

      // 生成したスタイルを選択
      setSelectedStyle(style);
      onSelectRef.current(icon);
    } catch (err) {
      console.error('Icon generation error:', err);
      setError(err instanceof Error ? err.message : 'アイコン生成に失敗しました');
    } finally {
      setLoadingStyle(null);
    }
  }, [imageDataUrl, hasApiKey]);

  // 初回生成
  useEffect(() => {
    if (imageDataUrl === prevImageRef.current) {
      return;
    }
    prevImageRef.current = imageDataUrl;
    hasInitializedRef.current = false;

    if (!imageDataUrl || !hasApiKey) {
      setIcons({});
      setError(null);
      return;
    }

    // 初回は「かわいい」スタイルで生成
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setIsLoading(true);
      generateIcon('cute').finally(() => setIsLoading(false));
    }
  }, [imageDataUrl, hasApiKey, generateIcon]);

  const handleStyleSelect = (style: IconStyle) => {
    if (icons[style]) {
      setSelectedStyle(style);
      onSelect(icons[style]!);
    } else {
      // まだ生成されていないスタイルの場合は生成
      generateIcon(style);
    }
  };

  const handleRegenerate = () => {
    generateIcon(selectedStyle);
  };

  if (!imageDataUrl) {
    return null;
  }

  if (!hasApiKey) {
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-sm text-yellow-700 dark:text-yellow-300">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>右上の設定⚙️からGroq APIキーを登録すると、AIがかわいいアイコンを生成します（無料）</span>
      </div>
    );
  }

  if (isLoading && Object.keys(icons).length === 0) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
            <div className="absolute inset-0 animate-spin">
              <div className="w-2 h-2 bg-pink-400 rounded-full absolute -top-1 left-1/2 -translate-x-1/2" />
            </div>
          </div>
          <span className="font-medium text-purple-600 dark:text-purple-400">
            AIがアイコンを描いています...
          </span>
        </div>
      </div>
    );
  }

  if (error && Object.keys(icons).length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm text-red-600 dark:text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
        <button
          onClick={() => generateIcon('cute')}
          className="w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          再試行
        </button>
      </div>
    );
  }

  const styles: IconStyle[] = ['cute', 'minimal', 'bold'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span>AIオリジナルアイコン</span>
        </div>
        {icons[selectedStyle] && (
          <button
            onClick={handleRegenerate}
            disabled={loadingStyle !== null}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            title="再生成"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loadingStyle === selectedStyle ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* 認識されたオブジェクト名 */}
      {icons[selectedStyle]?.objectName && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          認識: <span className="font-medium text-gray-700 dark:text-gray-300">{icons[selectedStyle]?.objectName}</span>
        </div>
      )}

      {/* スタイル選択 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {styles.map((style) => {
          const icon = icons[style];
          const isSelected = selectedStyle === style;
          const isCurrentlyLoading = loadingStyle === style;

          return (
            <motion.button
              key={style}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStyleSelect(style)}
              disabled={isCurrentlyLoading}
              className={`relative flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all min-w-[80px] ${
                isSelected
                  ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-500'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {/* アイコンプレビュー */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center">
                {icon ? (
                  <>
                    <Image
                      src={icon.dataUrl}
                      alt={`${styleNames[style]} style`}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain"
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
                  </>
                ) : isCurrentlyLoading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-purple-500 animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-gray-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* スタイル名 */}
              <div className="text-center">
                <div
                  className={`text-[11px] font-medium ${
                    isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {styleNames[style]}
                </div>
                <div className="text-[9px] text-gray-400 dark:text-gray-500">
                  {styleDescriptions[style]}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <div className="text-xs text-red-500 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
