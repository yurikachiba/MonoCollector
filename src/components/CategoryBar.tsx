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
            'backdrop-blur-lg transition-all duration-300',
            !selectedCategory
              ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg'
              : 'bg-white/30 hover:bg-white/40 border border-white/30'
          )}
        >
          <span>✨</span>
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
              'backdrop-blur-lg transition-all duration-300',
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg'
                : 'bg-white/30 hover:bg-white/40 border border-white/30'
            )}
          >
            <span>{category.icon}</span>
            <span className="text-sm font-medium">{category.name}</span>
            {category.itemCount > 0 && (
              <span
                className={clsx(
                  'text-xs px-2 py-0.5 rounded-full',
                  selectedCategory === category.id
                    ? 'bg-white/30'
                    : 'bg-pink-400/20 text-pink-600'
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
