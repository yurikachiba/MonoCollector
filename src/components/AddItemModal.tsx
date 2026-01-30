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
} from 'lucide-react';
import Webcam from 'react-webcam';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '@/lib/db';
import { useStore } from '@/lib/store';
import { classifyItem, suggestIcon, locationSuggestions } from '@/lib/ai-classifier';
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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
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
            <GlassCard className="!bg-white/80 dark:!bg-gray-900/80">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {editItem ? 'アイテムを編集' : '新しいアイテム'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium shadow-lg"
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
                      'border-2 border-dashed border-gray-200 dark:border-gray-700',
                      'flex items-center justify-center cursor-pointer',
                      'hover:border-pink-400 transition-colors',
                      image && 'border-solid border-pink-400'
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
                            className="p-4 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-500"
                          >
                            <Camera className="w-6 h-6" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500"
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
                          className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/50
                                     border border-gray-200 dark:border-gray-700
                                     focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                        />
                      </div>
                      <button
                        onClick={handleAutoClassify}
                        disabled={!name || isAutoClassifying}
                        className={clsx(
                          'px-4 py-3 rounded-xl font-medium transition-all',
                          'bg-gradient-to-r from-pink-400 to-purple-500 text-white',
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
                                     bg-white/50 dark:bg-gray-800/50
                                     border border-gray-200 dark:border-gray-700
                                     focus:outline-none focus:ring-2 focus:ring-pink-400/50"
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
                                     bg-white/50 dark:bg-gray-800/50
                                     border border-gray-200 dark:border-gray-700
                                     focus:outline-none focus:ring-2 focus:ring-pink-400/50
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
                                   bg-white/50 dark:bg-gray-800/50
                                   border border-gray-200 dark:border-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                      />
                      {showLocationSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <div className="flex flex-wrap gap-1">
                            {locationSuggestions.map((loc) => (
                              <button
                                key={loc}
                                onClick={() => {
                                  setLocation(loc);
                                  setShowLocationSuggestions(false);
                                }}
                                className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
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
                                   bg-white/50 dark:bg-gray-800/50
                                   border border-gray-200 dark:border-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-pink-400/50"
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
                                   bg-white/50 dark:bg-gray-800/50
                                   border border-gray-200 dark:border-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 font-medium"
                      >
                        追加
                      </button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:text-pink-800"
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
                                 bg-white/50 dark:bg-gray-800/50
                                 border border-gray-200 dark:border-gray-700
                                 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className={clsx(
                      'w-full py-4 rounded-xl font-bold text-lg',
                      'bg-gradient-to-r from-pink-400 to-purple-500 text-white',
                      'shadow-lg hover:shadow-xl transition-all',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    {editItem ? '更新する' : 'コレクションに追加'}
                  </button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
