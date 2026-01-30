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

// Item operations
export async function addItem(item: Item): Promise<void> {
  const response = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error('Failed to add item');
  }
}

export async function updateItem(item: Item): Promise<void> {
  const response = await fetch(`/api/items/${item.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error('Failed to update item');
  }
}

export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`/api/items/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete item');
  }
}

export async function getItem(id: string): Promise<Item | undefined> {
  const response = await fetch(`/api/items/${id}`);

  if (!response.ok) {
    if (response.status === 404) return undefined;
    throw new Error('Failed to fetch item');
  }

  const data = await response.json();
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

export async function getAllItems(): Promise<Item[]> {
  const response = await fetch('/api/items');

  if (!response.ok) {
    throw new Error('Failed to fetch items');
  }

  const data = await response.json();
  return data.map((item: Item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }));
}

export async function getItemsByCategory(category: string): Promise<Item[]> {
  const items = await getAllItems();
  return items.filter((item) => item.category === category);
}

// Category operations
export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
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
  const response = await fetch('/api/stats');

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  const data = await response.json();
  return {
    ...data,
    recentItems: data.recentItems.map((item: Item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })),
  };
}
