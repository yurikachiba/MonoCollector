'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Tag, Trash2, Edit2, Share2, Check } from 'lucide-react';
import { Item, Category } from '@/lib/db';
import { useStore } from '@/lib/store';
import GlassCard from './GlassCard';
import clsx from 'clsx';

interface ItemCardProps {
  item: Item;
  category?: Category;
  onEdit: (item: Item) => void;
  onShare: (item: Item) => void;
}

export default function ItemCard({ item, category, onEdit, onShare }: ItemCardProps) {
  const { removeItem, updateExistingItem, viewMode } = useStore();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await removeItem(item.id);
  };

  const toggleCollected = async () => {
    await updateExistingItem({
      ...item,
      isCollected: !item.isCollected,
    });
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isDeleting ? 0 : 1, x: isDeleting ? -100 : 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard
          hover
          className="flex items-center gap-4"
          onClick={() => setShowActions(!showActions)}
        >
          {/* Icon/Image */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: `${category?.color}20` }}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span>{item.icon}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                {item.name}
              </h3>
              {item.isCollected && (
                <span className="text-green-500">
                  <Check className="w-4 h-4" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{item.location || '未設定'}</span>
              <span>•</span>
              <span>×{item.quantity}</span>
            </div>
          </div>

          {/* Category Badge */}
          <div
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${category?.color}20`,
              color: category?.color,
            }}
          >
            {category?.icon} {category?.name}
          </div>

          {/* Quick Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCollected();
                  }}
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    item.isCollected
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-gray-500/20 text-gray-600 hover:bg-green-500/20'
                  )}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="p-2 rounded-lg bg-blue-500/20 text-blue-600 hover:bg-blue-500/30"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(item);
                  }}
                  className="p-2 rounded-lg bg-purple-500/20 text-purple-600 hover:bg-purple-500/30"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-2 rounded-lg bg-red-500/20 text-red-600 hover:bg-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isDeleting ? 0 : 1, scale: isDeleting ? 0.8 : 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <GlassCard
        hover
        className="relative overflow-hidden"
        onClick={() => setShowActions(!showActions)}
      >
        {/* Collected Badge */}
        {item.isCollected && (
          <div className="absolute top-2 right-2 z-10">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Image/Icon Area */}
        <div
          className="w-full aspect-square rounded-xl mb-3 flex items-center justify-center text-5xl relative overflow-hidden"
          style={{ backgroundColor: `${category?.color}15` }}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="drop-shadow-lg">{item.icon}</span>
          )}

          {/* Hover Overlay */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCollected();
                  }}
                  className={clsx(
                    'p-3 rounded-full transition-all',
                    item.isCollected
                      ? 'bg-green-500 text-white'
                      : 'bg-white/80 text-gray-700 hover:bg-green-500 hover:text-white'
                  )}
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-blue-500 hover:text-white transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(item);
                  }}
                  className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-purple-500 hover:text-white transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-3 rounded-full bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info */}
        <h3 className="font-semibold text-gray-800 dark:text-white truncate mb-1">
          {item.name}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{item.location || '未設定'}</span>
          </div>
          <span className="font-medium">×{item.quantity}</span>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/30 rounded-full text-xs"
              >
                <Tag className="w-2 h-2" />
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-xs text-gray-400">+{item.tags.length - 2}</span>
            )}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
