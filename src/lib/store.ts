import { create } from 'zustand';

interface UIState {
  selectedCategory: string | null;
  searchQuery: string;
  viewMode: 'grid' | 'list';

  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedCategory: null,
  searchQuery: '',
  viewMode: 'grid',

  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setViewMode: (mode: 'grid' | 'list') => {
    set({ viewMode: mode });
  },
}));
