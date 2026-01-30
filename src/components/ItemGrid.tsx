'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';
import { Item } from '@/lib/db';
import { useStore } from '@/lib/store';
import ItemCard from './ItemCard';
import GlassCard from './GlassCard';

interface ItemGridProps {
  onEdit: (item: Item) => void;
  onShare: (item: Item) => void;
}

export default function ItemGrid({ onEdit, onShare }: ItemGridProps) {
  const { categories, viewMode, getFilteredItems, isLoading, searchQuery, selectedCategory } = useStore();

  const filteredItems = getFilteredItems();

  if (isLoading) {
    return (
      <div className="px-4 py-8">
        <GlassCard className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">読み込み中...</p>
        </GlassCard>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="px-4 py-8">
        <GlassCard className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {searchQuery || selectedCategory
              ? '該当するアイテムがありません'
              : 'まだアイテムがありません'}
          </h3>
          <p className="text-gray-500 text-sm">
            {searchQuery || selectedCategory
              ? '検索条件を変えてみてください'
              : '右下の + ボタンからアイテムを追加しましょう'}
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <motion.div
        layout
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'
            : 'flex flex-col gap-3'
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              category={categories.find((c) => c.id === item.category)}
              onEdit={onEdit}
              onShare={onShare}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Item count */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          {filteredItems.length} アイテム表示中
        </p>
      </div>
    </div>
  );
}
