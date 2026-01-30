'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Tag,
  Hash,
  FileText,
  ChevronDown,
  Wand2,
  Settings,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import Webcam from 'react-webcam';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '@/lib/db';
import { useStore } from '@/lib/store';
import { classifyItem, suggestIcon, locationSuggestions } from '@/lib/ai-classifier';
import { analyzeImage, getStoredApiKey, setStoredApiKey, removeStoredApiKey } from '@/lib/groq-vision';
import GlassCard from './GlassCard';
import clsx from 'clsx';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: Item | null;
}

export default function AddItemModal({ isOpen, onClose, editItem }: AddItemModalProps) {
  const { categories, addNewItem, updateExistingItem } = useStore();
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'form' | 'camera'>('form');
  const [image, setImage] = useState<string>('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [icon, setIcon] = useState('📦');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isAutoClassifying, setIsAutoClassifying] = useState(false);

  // AI Vision states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Load API key on mount
  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  // Reset form when modal opens/closes or editItem changes
  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setCategory(editItem.category);
      setIcon(editItem.icon);
      setImage(editItem.image);
      setLocation(editItem.location);
      setQuantity(editItem.quantity);
      setNotes(editItem.notes);
      setTags(editItem.tags);
    } else if (isOpen) {
      resetForm();
    }
    setAnalysisError(null);
  }, [editItem, isOpen]);

  const resetForm = () => {
    setImage('');
    setName('');
    setCategory('other');
    setIcon('📦');
    setLocation('');
    setQuantity(1);
    setNotes('');
    setTags([]);
    setTagInput('');
    setMode('form');
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setMode('form');
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoClassify = async () => {
    if (!name) return;

    setIsAutoClassifying(true);
    // Simulate API delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = classifyItem(name);
    setCategory(result.categoryId);
    setIcon(suggestIcon(result.categoryId, name));
    setTags(result.suggestedTags);

    setIsAutoClassifying(false);
  };

  // AI Vision Analysis
  const handleAiAnalysis = async () => {
    if (!image) return;

    if (!apiKey) {
      setShowApiKeySettings(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await analyzeImage(image, apiKey);
      setName(result.name);
      setCategory(result.category);
      setIcon(result.icon);
      setLocation(result.location);
      setTags(result.tags);
      setNotes(result.notes);
      setQuantity(result.quantity);
    } catch (error) {
      console.error('AI analysis error:', error);
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Invalid API')) {
          setAnalysisError('APIキーが無効です。設定を確認してください。');
          setShowApiKeySettings(true);
        } else if (error.message.includes('rate limit')) {
          setAnalysisError('レート制限に達しました。しばらく待ってから再試行してください。');
        } else {
          setAnalysisError(error.message || 'AI分析中にエラーが発生しました');
        }
      } else {
        setAnalysisError('AI分析中にエラーが発生しました');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
      setShowApiKeySettings(false);
      setAnalysisError(null);
    }
  };

  const handleRemoveApiKey = () => {
    removeStoredApiKey();
    setApiKey('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    const now = new Date();
    const itemData: Item = {
      id: editItem?.id || uuidv4(),
      name: name.trim(),
      category,
      icon,
      image,
      location,
      quantity,
      notes,
      tags,
      createdAt: editItem?.createdAt || now,
      updatedAt: now,
      isCollected: editItem?.isCollected || false,
    };

    if (editItem) {
      await updateExistingItem(itemData);
    } else {
      await addNewItem(itemData);
    }

    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <GlassCard className="!p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editItem ? 'アイテムを編集' : '新しいアイテム'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {mode === 'camera' ? (
                  /* Camera Mode */
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{
                          facingMode: 'environment',
                        }}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setMode('form')}
                        className="flex-1 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 font-medium"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="flex-1 py-3 px-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium"
                      >
                        撮影
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form Mode */
                  <div className="space-y-4">
                    {/* Image Upload Area */}
                    <div
                      onClick={() => !image && fileInputRef.current?.click()}
                      className={clsx(
                        'relative aspect-video rounded-2xl overflow-hidden',
                        'border-2 border-dashed border-gray-300 dark:border-gray-700',
                        'flex items-center justify-center cursor-pointer',
                        'hover:border-gray-400 dark:hover:border-gray-600 transition-colors',
                        image && 'border-solid border-gray-400 dark:border-gray-600'
                      )}
                    >
                      {image ? (
                        <>
                          <img
                            src={image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMode('camera');
                              }}
                              className="p-3 rounded-full bg-white/80 text-gray-700"
                            >
                              <Camera className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="p-3 rounded-full bg-white/80 text-gray-700"
                            >
                              <Upload className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setImage('');
                              }}
                              className="p-3 rounded-full bg-white/80 text-red-500"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6">
                          <div className="flex justify-center gap-4 mb-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMode('camera');
                              }}
                              className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            >
                              <Camera className="w-6 h-6" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            >
                              <Upload className="w-6 h-6" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">
                            写真を撮影またはアップロード
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* AI Auto-read Button */}
                    {image && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <button
                            onClick={handleAiAnalysis}
                            disabled={isAnalyzing}
                            className={clsx(
                              'flex-1 py-3 px-4 rounded-xl font-medium transition-all',
                              'bg-black dark:bg-white text-white dark:text-black',
                              'disabled:opacity-50 disabled:cursor-not-allowed',
                              'flex items-center justify-center gap-2'
                            )}
                          >
                            <Wand2 className={clsx('w-5 h-5', isAnalyzing && 'animate-pulse')} />
                            {isAnalyzing ? 'AI解析中...' : 'AIで自動読み取り'}
                          </button>
                          <button
                            onClick={() => setShowApiKeySettings(!showApiKeySettings)}
                            className={clsx(
                              'p-3 rounded-xl transition-all',
                              'bg-gray-100 dark:bg-gray-800',
                              'hover:bg-gray-200 dark:hover:bg-gray-700',
                              showApiKeySettings && 'bg-gray-200 dark:bg-gray-700'
                            )}
                            title="Groq API設定"
                          >
                            <Settings className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Error Message */}
                        {analysisError && (
                          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{analysisError}</span>
                          </div>
                        )}

                        {/* API Key Settings */}
                        <AnimatePresence>
                          {showApiKeySettings && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Groq APIキー
                                  </label>
                                  <a
                                    href="https://console.groq.com/keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
                                  >
                                    キーを取得
                                  </a>
                                </div>
                                <div className="flex gap-2">
                                  <div className="flex-1 relative">
                                    <input
                                      type={showApiKey ? 'text' : 'password'}
                                      value={apiKey}
                                      onChange={(e) => setApiKey(e.target.value)}
                                      placeholder="gsk_..."
                                      className="w-full px-4 py-2 pr-10 rounded-lg bg-white dark:bg-gray-900
                                                 border border-gray-200 dark:border-gray-700
                                                 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
                                                 text-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowApiKey(!showApiKey)}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                    >
                                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                  </div>
                                  <button
                                    onClick={handleSaveApiKey}
                                    disabled={!apiKey.trim()}
                                    className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium
                                               disabled:opacity-50 disabled:cursor-not-allowed
                                               hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                                  >
                                    保存
                                  </button>
                                </div>
                                {apiKey && (
                                  <button
                                    onClick={handleRemoveApiKey}
                                    className="text-xs text-red-500 hover:underline"
                                  >
                                    APIキーを削除
                                  </button>
                                )}
                                <p className="text-xs text-gray-500">
                                  Groq Vision API (llama-3.2-90b-vision) を使用して画像からアイテム情報を自動認識します。
                                  APIキーはブラウザのローカルストレージに保存されます。
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Name Input with Auto-classify */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        アイテム名
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="例: りんご、Tシャツ、充電器..."
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800
                                       border border-gray-200 dark:border-gray-700
                                       focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                          />
                        </div>
                        <button
                          onClick={handleAutoClassify}
                          disabled={!name || isAutoClassifying}
                          className={clsx(
                            'px-4 py-3 rounded-xl font-medium transition-all',
                            'bg-black dark:bg-white text-white dark:text-black',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            'flex items-center gap-2'
                          )}
                        >
                          <Sparkles
                            className={clsx('w-4 h-4', isAutoClassifying && 'animate-spin')}
                          />
                          <span className="hidden sm:inline">自動分類</span>
                        </button>
                      </div>
                    </div>

                    {/* Category & Icon */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          カテゴリ
                        </label>
                        <div className="relative">
                          <select
                            value={category}
                            onChange={(e) => {
                              setCategory(e.target.value);
                              const cat = categories.find((c) => c.id === e.target.value);
                              if (cat) setIcon(cat.icon);
                            }}
                            className="w-full px-4 py-3 rounded-xl appearance-none
                                       bg-gray-100 dark:bg-gray-800
                                       border border-gray-200 dark:border-gray-700
                                       focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          アイコン
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{icon}</span>
                          <input
                            type="text"
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl
                                       bg-gray-100 dark:bg-gray-800
                                       border border-gray-200 dark:border-gray-700
                                       focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
                                       text-center text-xl"
                            maxLength={2}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        保管場所
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          onFocus={() => setShowLocationSuggestions(true)}
                          onBlur={() =>
                            setTimeout(() => setShowLocationSuggestions(false), 200)
                          }
                          placeholder="例: リビング、冷蔵庫..."
                          className="w-full px-4 py-3 rounded-xl
                                     bg-gray-100 dark:bg-gray-800
                                     border border-gray-200 dark:border-gray-700
                                     focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                        />
                        {showLocationSuggestions && (
                          <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                            <div className="flex flex-wrap gap-1">
                              {locationSuggestions.map((loc) => (
                                <button
                                  key={loc}
                                  onClick={() => {
                                    setLocation(loc);
                                    setShowLocationSuggestions(false);
                                  }}
                                  className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                  {loc}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        数量
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-lg font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                          }
                          min="1"
                          className="w-20 px-4 py-2 rounded-xl text-center
                                     bg-gray-100 dark:bg-gray-800
                                     border border-gray-200 dark:border-gray-700
                                     focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        タグ
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="タグを追加..."
                          className="flex-1 px-4 py-3 rounded-xl
                                     bg-gray-100 dark:bg-gray-800
                                     border border-gray-200 dark:border-gray-700
                                     focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                        />
                        <button
                          onClick={handleAddTag}
                          className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          追加
                        </button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                            >
                              {tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        メモ
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="メモを追加..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl resize-none
                                   bg-gray-100 dark:bg-gray-800
                                   border border-gray-200 dark:border-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={!name.trim()}
                      className={clsx(
                        'w-full py-4 rounded-xl font-bold text-lg',
                        'bg-black dark:bg-white text-white dark:text-black',
                        'hover:bg-gray-800 dark:hover:bg-gray-100 transition-all',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {editItem ? '更新する' : 'コレクションに追加'}
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
