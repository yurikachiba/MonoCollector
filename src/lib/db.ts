import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Item {
  id: string;
  name: string;
  category: string;
  icon: string;
  image: string;
  location: string;
  quantity: number;
  notes: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isCollected: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
}

interface MonoCollectorDB extends DBSchema {
  items: {
    key: string;
    value: Item;
    indexes: { 'by-category': string; 'by-date': Date };
  };
  categories: {
    key: string;
    value: Category;
  };
}

const DB_NAME = 'mono-collector-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<MonoCollectorDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<MonoCollectorDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<MonoCollectorDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Items store
      const itemStore = db.createObjectStore('items', { keyPath: 'id' });
      itemStore.createIndex('by-category', 'category');
      itemStore.createIndex('by-date', 'createdAt');

      // Categories store
      db.createObjectStore('categories', { keyPath: 'id' });
    },
  });

  // Initialize default categories
  await initializeDefaultCategories(dbInstance);

  return dbInstance;
}

export const defaultCategories: Category[] = [
  { id: 'food', name: '食品・食材', icon: '🍎', color: '#FF6B6B', itemCount: 0 },
  { id: 'kitchen', name: 'キッチン用品', icon: '🍳', color: '#4ECDC4', itemCount: 0 },
  { id: 'clothes', name: '衣類', icon: '👕', color: '#45B7D1', itemCount: 0 },
  { id: 'electronics', name: '電子機器', icon: '📱', color: '#96CEB4', itemCount: 0 },
  { id: 'books', name: '本・書籍', icon: '📚', color: '#FFEAA7', itemCount: 0 },
  { id: 'cosmetics', name: 'コスメ・美容', icon: '💄', color: '#DDA0DD', itemCount: 0 },
  { id: 'stationery', name: '文房具', icon: '✏️', color: '#98D8C8', itemCount: 0 },
  { id: 'toys', name: 'おもちゃ・ホビー', icon: '🎮', color: '#F7DC6F', itemCount: 0 },
  { id: 'cleaning', name: '掃除用品', icon: '🧹', color: '#85C1E9', itemCount: 0 },
  { id: 'medicine', name: '薬・医療品', icon: '💊', color: '#F1948A', itemCount: 0 },
  { id: 'furniture', name: '家具・インテリア', icon: '🪑', color: '#D7BDE2', itemCount: 0 },
  { id: 'sports', name: 'スポーツ用品', icon: '⚽', color: '#82E0AA', itemCount: 0 },
  { id: 'other', name: 'その他', icon: '📦', color: '#AEB6BF', itemCount: 0 },
];

async function initializeDefaultCategories(db: IDBPDatabase<MonoCollectorDB>) {
  const tx = db.transaction('categories', 'readwrite');
  const store = tx.objectStore('categories');

  for (const category of defaultCategories) {
    const existing = await store.get(category.id);
    if (!existing) {
      await store.put(category);
    }
  }

  await tx.done;
}

// Item operations
export async function addItem(item: Item): Promise<void> {
  const db = await getDB();
  await db.put('items', item);
  await updateCategoryCount(item.category);
}

export async function updateItem(item: Item): Promise<void> {
  const db = await getDB();
  await db.put('items', { ...item, updatedAt: new Date() });
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDB();
  const item = await db.get('items', id);
  if (item) {
    await db.delete('items', id);
    await updateCategoryCount(item.category);
  }
}

export async function getItem(id: string): Promise<Item | undefined> {
  const db = await getDB();
  return db.get('items', id);
}

export async function getAllItems(): Promise<Item[]> {
  const db = await getDB();
  return db.getAll('items');
}

export async function getItemsByCategory(category: string): Promise<Item[]> {
  const db = await getDB();
  return db.getAllFromIndex('items', 'by-category', category);
}

// Category operations
export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB();
  return db.getAll('categories');
}

export async function updateCategoryCount(categoryId: string): Promise<void> {
  const db = await getDB();
  const items = await getItemsByCategory(categoryId);
  const category = await db.get('categories', categoryId);
  if (category) {
    category.itemCount = items.length;
    await db.put('categories', category);
  }
}

export async function recalculateAllCategoryCounts(): Promise<void> {
  const categories = await getAllCategories();
  for (const category of categories) {
    await updateCategoryCount(category.id);
  }
}

// Search
export async function searchItems(query: string): Promise<Item[]> {
  const items = await getAllItems();
  const lowerQuery = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      item.notes.toLowerCase().includes(lowerQuery)
  );
}

// Stats
export async function getStats(): Promise<{
  totalItems: number;
  categoryBreakdown: { category: string; count: number }[];
  recentItems: Item[];
}> {
  const items = await getAllItems();
  const categories = await getAllCategories();

  const categoryBreakdown = categories
    .map((cat) => ({
      category: cat.name,
      count: items.filter((item) => item.category === cat.id).length,
    }))
    .filter((c) => c.count > 0);

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    totalItems: items.length,
    categoryBreakdown,
    recentItems,
  };
}
