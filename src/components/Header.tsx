'use client';

import { useState } from 'react';
import { Search, Grid, List, Sparkles, Settings } from 'lucide-react';
import { useStore } from '@/lib/store';
import GlassCard from './GlassCard';
import SettingsModal from './SettingsModal';

export default function Header() {
  const { searchQuery, setSearchQuery, viewMode, setViewMode, stats } = useStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 py-4">
      <GlassCard className="!rounded-3xl">
        <div className="flex flex-col gap-4">
          {/* Logo and Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  モノコレクター
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stats?.totalItems || 0} アイテム収集中
                </p>
              </div>
            </div>

            {/* View Toggle & Settings */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-white/30 dark:bg-white/10 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white/60 dark:bg-white/20 shadow-sm'
                      : 'hover:bg-white/30'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-white/60 dark:bg-white/20 shadow-sm'
                      : 'hover:bg-white/30'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 transition-all"
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
              className="w-full pl-10 pr-4 py-3 bg-white/40 dark:bg-white/10
                         border border-white/30 rounded-xl
                         placeholder-gray-400 text-gray-700 dark:text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-pink-400/50
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
