'use client';

import { useState } from 'react';
import { Search, Grid, List, Settings } from 'lucide-react';
import { useStore } from '@/lib/store';
import SettingsModal from './SettingsModal';

export default function Header() {
  const { searchQuery, setSearchQuery, viewMode, setViewMode } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 py-3">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            モノコレクター
          </h1>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800
                       rounded-lg text-sm
                       placeholder-gray-400 text-gray-700 dark:text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </header>
  );
}
