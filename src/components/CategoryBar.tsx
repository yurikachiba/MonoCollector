'use client';

import { useStore } from '@/lib/store';

export default function CategoryBar() {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

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

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {category.icon} {category.name}
            {category.itemCount > 0 && (
              <span className="ml-1 opacity-60">{category.itemCount}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
