'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Upload, Wand2, ChevronDown, Sparkles } from 'lucide-react';
import Webcam from 'react-webcam';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '@/lib/db';
import { useCategories } from '@/hooks/useCategories';
import { useAddItem, useUpdateItem } from '@/hooks/useItems';
import { analyzeImage, getStoredApiKey } from '@/lib/groq-vision';
import IconGenerator from './IconGenerator';
import AIIconGenerator from './AIIconGenerator';
import { GeneratedIcon } from '@/lib/icon-generator';
import { AIGeneratedIcon } from '@/lib/ai-icon-generator';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: Item | null;
}

// Utility to resize and compress image
const compressImage = async (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
};

export default function AddItemModal({ isOpen, onClose, editItem }: AddItemModalProps) {
  const { data: categories = [] } = useCategories();
  const addItemMutation = useAddItem();
  const updateItemMutation = useUpdateItem();
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'form' | 'camera'>('form');
  const [image, setImage] = useState<string | Uint8Array>('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [location, setLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useAutoIcon, setUseAutoIcon] = useState(false);
  const [generatedIcon, setGeneratedIcon] = useState<GeneratedIcon | null>(null);
  const [generatedAIIcon, setGeneratedAIIcon] = useState<AIGeneratedIcon | null>(null);
  const [enableAIIcon, setEnableAIIcon] = useState(true); // デフォルトでON

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setCategory(editItem.category);
      if (editItem.image instanceof Uint8Array) {
        // Convert Uint8Array to Base64 for display
        const base64 = `data:image/jpeg;base64,${Buffer.from(editItem.image).toString('base64')}`;
        setImage(base64);
      } else {
        setImage(editItem.image);
      }
      setLocation(editItem.location);
    } else if (isOpen) {
      setImage('');
      setName('');
      setCategory('other');
      setLocation('');
      setMode('form');
      setUseAutoIcon(false);
      setGeneratedIcon(null);
      setGeneratedAIIcon(null);
      setEnableAIIcon(true);
    }
  }, [editItem, isOpen]);

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const compressed = await compressImage(imageSrc);
      setImage(compressed);
      setMode('form');
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const compressed = await compressImage(base64);
        setImage(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiAnalysis = async () => {
    if (!image) return;
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      alert('設定からAPIキーを登録してください');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeImage(typeof image === 'string' ? image : '', apiKey);
      setName(result.name);
      setCategory(result.category);
      setLocation(result.location);
    } catch (error) {
      const message = error instanceof Error ? error.message : '不明なエラー';
      alert(`解析に失敗しました: ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    const submitId = `submit_${Date.now()}`;
    console.log(`[${submitId}] handleSubmit - Starting`);

    if (!name.trim()) {
      console.warn(`[${submitId}] Name is empty, aborting`);
      alert('名前を入力してください');
      return;
    }

    // Validate image for new items (auto icon mode allows no image)
    if (!editItem && !useAutoIcon && (!image || (typeof image === 'string' && !image.startsWith('data:')))) {
      console.warn(`[${submitId}] Image is missing or invalid, aborting`);
      alert('画像を追加するか、自動アイコンを使用してください');
      return;
    }

    // If using auto icon, generate PNG from SVG
    let finalImage: string | Uint8Array = image;
    if (useAutoIcon && generatedIcon && !image) {
      // Convert SVG to PNG data URL
      finalImage = await new Promise<string>((resolve) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        img.onload = () => {
          ctx?.drawImage(img, 0, 0, 256, 256);
          resolve(canvas.toDataURL('image/png'));
        };

        img.src = generatedIcon.dataUrl;
      });
    }

    const cat = categories.find((c) => c.id === category);
    console.log(`[${submitId}] Category found:`, cat);

    const itemData: Item = {
      id: editItem?.id || uuidv4(),
      name: name.trim(),
      category,
      icon: cat?.icon || '📦',
      image: finalImage,
      // AIでオリジナルアイコンを生成した場合
      generatedIcon: enableAIIcon && generatedAIIcon ? generatedAIIcon.dataUrl : editItem?.generatedIcon,
      iconStyle: enableAIIcon && generatedAIIcon ? generatedAIIcon.style : editItem?.iconStyle,
      iconColors: editItem?.iconColors || [], // AIアイコンでは色抽出は使わない
      location,
      quantity: editItem?.quantity || 1,
      notes: editItem?.notes || '',
      tags: editItem?.tags || [],
      createdAt: editItem?.createdAt || new Date(),
      updatedAt: new Date(),
      isCollected: editItem?.isCollected || false,
    };

    console.log(`[${submitId}] Item data prepared:`, {
      id: itemData.id,
      name: itemData.name,
      category: itemData.category,
      icon: itemData.icon,
      location: itemData.location,
      quantity: itemData.quantity,
      imageType: typeof itemData.image,
      imageLength: typeof itemData.image === 'string' ? itemData.image.length : 'Uint8Array',
      imagePrefix: typeof itemData.image === 'string' ? itemData.image.substring(0, 50) : 'N/A',
      isEdit: !!editItem,
    });

    try {
      if (editItem) {
        console.log(`[${submitId}] Updating existing item`);
        await updateItemMutation.mutateAsync(itemData);
      } else {
        console.log(`[${submitId}] Creating new item`);
        await addItemMutation.mutateAsync(itemData);
      }
      console.log(`[${submitId}] Operation completed successfully`);
      onClose();
    } catch (error) {
      console.error(`[${submitId}] Operation failed:`, error);
      console.error(`[${submitId}] Error type:`, error instanceof Error ? error.constructor.name : typeof error);
      console.error(`[${submitId}] Error message:`, error instanceof Error ? error.message : String(error));
      console.error(`[${submitId}] Error stack:`, error instanceof Error ? error.stack : 'No stack');
      const message = error instanceof Error ? error.message : '不明なエラー';
      alert(`保存に失敗しました: ${message}`);
    }
  };

  if (!isOpen) return null;

  const displayImage = typeof image === 'string' ? image : '';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {editItem ? '編集' : '追加'}
            </h2>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {mode === 'camera' ? (
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-black rounded-xl overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: 'environment' }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('form')}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 font-medium text-sm"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium text-sm"
                  >
                    撮影
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Image */}
                <div
                  onClick={() => !image && fileInputRef.current?.click()}
                  className={`aspect-video rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer overflow-hidden ${
                    image ? 'border-solid' : ''
                  }`}
                >
                  {image ? (
                    <div className="relative w-full h-full group">
                      <NextImage src={displayImage} alt="" fill className="object-cover" unoptimized />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); setMode('camera'); }}
                          className="p-2 bg-white rounded-full"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="p-2 bg-white rounded-full"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setImage(''); }}
                          className="p-2 bg-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="flex justify-center gap-3 mb-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setMode('camera'); }}
                          className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full"
                        >
                          <Camera className="w-5 h-5 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                          className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full"
                        >
                          <Upload className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">写真を追加</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* AI Icon Generator - AIでかわいいオリジナルアイコン生成 */}
                {image && typeof image === 'string' && image.startsWith('data:') && !editItem && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setEnableAIIcon(!enableAIIcon)}
                      className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                        enableAIIcon
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {enableAIIcon ? 'AIアイコン生成ON' : 'AIでオリジナルアイコンを生成'}
                    </button>

                    {/* AI Icon Generator */}
                    {enableAIIcon && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                        <AIIconGenerator
                          imageDataUrl={image}
                          onSelect={(icon) => setGeneratedAIIcon(icon)}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Auto Icon Mode Toggle - 写真がない場合のみ表示 */}
                {!image && !editItem && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setUseAutoIcon(!useAutoIcon)}
                      className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                        useAutoIcon
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      {useAutoIcon ? '自動アイコン使用中' : '写真なしで自動アイコンを使う'}
                    </button>

                    {/* Icon Generator Preview */}
                    {useAutoIcon && name.trim() && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                        <IconGenerator
                          name={name.trim()}
                          onSelect={(icon) => setGeneratedIcon(icon)}
                          showAllStyles
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* AI Button */}
                {image && (
                  <button
                    onClick={handleAiAnalysis}
                    disabled={isAnalyzing}
                    className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Wand2 className={`w-4 h-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
                    {isAnalyzing ? '解析中...' : 'AIで自動入力'}
                  </button>
                )}

                {/* Name */}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="名前"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                />

                {/* Category */}
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Location */}
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="場所（任意）"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                />

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!name.trim() || (!editItem && !image && !useAutoIcon) || addItemMutation.isPending || updateItemMutation.isPending}
                  className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addItemMutation.isPending || updateItemMutation.isPending
                    ? '保存中...'
                    : editItem ? '保存' : '追加'}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
