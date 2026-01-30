'use client';

import { useState } from 'react';
import { Search, Grid, List, Box, Settings } from 'lucide-react';
import { useStore } from '@/lib/store';
import GlassCard from './GlassCard';
import SettingsModal from './SettingsModal';

export default function Header() {
  const { searchQuery, setSearchQuery, viewMode, setViewMode, stats } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <GlassCard className="!rounded-2xl">
        <div className="flex flex-col gap-4">
          {/* Logo and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                <Box className="w-5 h-5 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  モノコレクター
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats?.totalItems || 0} アイテム
                </p>
              </div>
            </div>

            {/* View Toggle & Settings */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                title="設定"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="アイテムを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700 rounded-xl
                         placeholder-gray-400 text-gray-700 dark:text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
                         transition-all"
            />
          </div>
        </div>
      </GlassCard>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </header>
  );
}
