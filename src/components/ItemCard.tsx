'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, MoreHorizontal, Sparkles } from 'lucide-react';
import { Item, Category } from '@/lib/db';
import { useUIStore } from '@/lib/store';
import { useDeleteItem } from '@/hooks/useItems';
import { ItemRarityBadge } from './RarityBadge';

interface ItemCardProps {
  item: Item;
  category?: Category;
  onEdit: (item: Item) => void;
}

export default function ItemCard({ item, category, onEdit }: ItemCardProps) {
  const { viewMode } = useUIStore();
  const deleteItemMutation = useDeleteItem();
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('削除しますか？')) {
      await deleteItemMutation.mutateAsync(item.id);
    }
    setShowMenu(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
    setShowMenu(false);
  };

  const displayImage = typeof item.image === 'string' 
    ? item.image 
    : (item.image instanceof Uint8Array 
        ? `data:image/jpeg;base64,${Buffer.from(item.image).toString('base64')}`
        : '');

  // List View
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
        onClick={() => onEdit(item)}
      >
        {/* Image/Icon */}
        <div className="relative w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {item.image ? (
            <Image
              src={displayImage}
              alt={item.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">{item.icon}</span>
          )}
          {/* Generated Icon indicator */}
          {item.generatedIcon && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full overflow-hidden ring-1 ring-white dark:ring-gray-900">
              <Image
                src={item.generatedIcon}
                alt=""
                width={20}
                height={20}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {item.name}
          </h3>
          <p className="text-xs text-gray-400 truncate">
            {item.location || category?.name}
            {item.quantity > 1 && ` · ${item.quantity}個`}
          </p>
        </div>

        {/* Menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showMenu && (
          <div className="absolute right-12 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
            <button
              onClick={handleEdit}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              削除
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      className="relative group"
      onClick={() => onEdit(item)}
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
        {/* Image */}
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
          {item.image ? (
            <Image
              src={displayImage}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {item.icon}
            </div>
          )}

          {/* Delete button on hover */}
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>

          {/* Quantity badge */}
          {item.quantity > 1 && (
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
              ×{item.quantity}
            </div>
          )}

          {/* Generated Icon badge - オリジナルアイコン */}
          {item.generatedIcon && (
            <div className="absolute bottom-2 left-2 w-8 h-8 rounded-lg overflow-hidden ring-2 ring-white dark:ring-gray-900 shadow-md">
              <Image
                src={item.generatedIcon}
                alt="Generated Icon"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </div>
            </div>
          )}

          {/* Rarity badge */}
          <div className="absolute top-2 left-2">
            <ItemRarityBadge itemName={item.name} createdAt={item.createdAt} />
          </div>
        </div>

        {/* Info */}
        <div className="p-2">
          <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
            {item.name}
          </h3>
          {item.location && (
            <p className="text-xs text-gray-400 truncate">{item.location}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
