'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';
import { Item } from '@/lib/db';
import { useStore } from '@/lib/store';
import ItemCard from './ItemCard';

interface ItemGridProps {
  onEdit: (item: Item) => void;
}

export default function ItemGrid({ onEdit }: ItemGridProps) {
  const { categories, viewMode, getFilteredItems, isLoading, searchQuery, selectedCategory } = useStore();

  const filteredItems = getFilteredItems();

  if (isLoading) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">
          {searchQuery || selectedCategory
            ? '見つかりませんでした'
            : 'アイテムを追加しましょう'}
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <motion.div
        layout
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'
            : 'flex flex-col gap-2'
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              category={categories.find((c) => c.id === item.category)}
              onEdit={onEdit}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
