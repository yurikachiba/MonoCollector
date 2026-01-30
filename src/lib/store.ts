import { create } from 'zustand';
import { Item, Category, getAllItems, getAllCategories, addItem, updateItem, deleteItem, searchItems, getStats } from './db';

interface StoreState {
  items: Item[];
  categories: Category[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  stats: {
    totalItems: number;
    categoryBreakdown: { category: string; count: number }[];
    recentItems: Item[];
  } | null;

  // Actions
  loadData: () => Promise<void>;
  addNewItem: (item: Item) => Promise<void>;
  updateExistingItem: (item: Item) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  refreshStats: () => Promise<void>;
  getFilteredItems: () => Item[];
}

export const useStore = create<StoreState>((set, get) => ({
  items: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  isLoading: true,
  viewMode: 'grid',
  stats: null,

  loadData: async () => {
    set({ isLoading: true });
    try {
      const [items, categories, stats] = await Promise.all([
        getAllItems(),
        getAllCategories(),
        getStats(),
      ]);
      set({ items, categories, stats, isLoading: false });
    } catch (error) {
      console.error('Failed to load data:', error);
      set({ isLoading: false });
    }
  },

  addNewItem: async (item: Item) => {
    await addItem(item);
    const [items, categories, stats] = await Promise.all([
      getAllItems(),
      getAllCategories(),
      getStats(),
    ]);
    set({ items, categories, stats });
  },

  updateExistingItem: async (item: Item) => {
    await updateItem(item);
    const items = await getAllItems();
    set({ items });
  },

  removeItem: async (id: string) => {
    await deleteItem(id);
    const [items, categories, stats] = await Promise.all([
      getAllItems(),
      getAllCategories(),
      getStats(),
    ]);
    set({ items, categories, stats });
  },

  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setViewMode: (mode: 'grid' | 'list') => {
    set({ viewMode: mode });
  },

  refreshStats: async () => {
    const stats = await getStats();
    set({ stats });
  },

  getFilteredItems: () => {
    const { items, selectedCategory, searchQuery } = get();
    let filtered = items;

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          item.notes.toLowerCase().includes(query)
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
}));
