'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import clsx from 'clsx';

export default function CategoryBar() {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="px-4 py-2">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* All Items */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory(null)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap',
            'transition-all duration-300',
            !selectedCategory
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          )}
        >
          <span>📦</span>
          <span className="text-sm font-medium">すべて</span>
        </motion.button>

        {/* Category Pills */}
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap',
              'transition-all duration-300',
              selectedCategory === category.id
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            )}
          >
            <span>{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
            {category.itemCount > 0 && (
              <span
                className={clsx(
                  'text-xs px-2 py-0.5 rounded-full',
                  selectedCategory === category.id
                    ? 'bg-white/20 dark:bg-black/20'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              >
                {category.itemCount}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
