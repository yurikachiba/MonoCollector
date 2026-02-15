'use client';

import { useMemo } from 'react';
import { useUIStore } from '@/lib/store';
import { useCategories } from '@/hooks/useCategories';
import { useItems } from '@/hooks/useItems';
import { CategoryIcon } from '@/components/icons/CategoryIcons';

export default function CategoryBar() {
  const { selectedCategory, setSelectedCategory } = useUIStore();
  const { data: categories = [] } = useCategories();
  const { data: items = [] } = useItems();

  // ユーザーのアイテムからカテゴリごとのカウントを計算
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [items]);

  return (
    <div className="px-4 py-2 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
            !selectedCategory
              ? 'bg-black dark:bg-white text-white dark:text-black'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          すべて
        </button>

        {categories.map((category) => {
          const count = categoryCounts[category.id] || 0;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedCategory === category.id
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <CategoryIcon categoryId={category.id} size={18} />
              {category.name}
              {count > 0 && (
                <span className="ml-1 opacity-60">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
