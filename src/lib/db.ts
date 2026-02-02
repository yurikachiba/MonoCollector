export interface Item {
  id: string;
  name: string;
  category: string;
  icon: string;
  image: Uint8Array | string;
  generatedIcon?: string;  // 写真から生成したオリジナルアイコン（SVG data URL）
  iconStyle?: string;      // アイコンスタイル（mosaic, gradient, geometric, abstract, pixel）
  iconColors?: string[];   // アイコンに使われた色
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
  const clientRequestId = `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  console.log(`[${clientRequestId}] addItem - Starting item creation`);
  console.log(`[${clientRequestId}] Item data:`, {
    id: item.id,
    name: item.name,
    category: item.category,
    icon: item.icon,
    location: item.location,
    quantity: item.quantity,
    notes: item.notes,
    tags: item.tags,
    isCollected: item.isCollected,
    createdAt: item.createdAt,
    imageType: typeof item.image,
    imageLength: typeof item.image === 'string' ? item.image.length : 'Uint8Array',
  });

  const formData = new FormData();
  let imageProcessed = false;

  Object.entries(item).forEach(([key, value]) => {
    if (key === 'image') {
      console.log(`[${clientRequestId}] Processing image field:`, {
        type: typeof value,
        isString: typeof value === 'string',
        startsWithData: typeof value === 'string' && value.startsWith('data:'),
        length: typeof value === 'string' ? value.length : 'N/A',
        prefix: typeof value === 'string' ? value.substring(0, 50) : 'N/A',
      });

      if (typeof value === 'string' && value.startsWith('data:')) {
        try {
          // Base64 string to Blob
          const parts = value.split(',');
          const mimeMatch = parts[0].match(/:(.*?);/);
          const mimeString = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const base64Data = parts[1];

          console.log(`[${clientRequestId}] Image conversion:`, {
            mimeString,
            base64DataLength: base64Data?.length || 0,
          });

          if (!base64Data) {
            console.error(`[${clientRequestId}] No base64 data found in image string`);
            return;
          }

          const byteString = atob(base64Data);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          const extension = mimeString.split('/')[1] || 'jpg';

          console.log(`[${clientRequestId}] Created blob:`, {
            blobSize: blob.size,
            blobType: blob.type,
            filename: `image.${extension}`,
          });

          formData.append(key, blob, `image.${extension}`);
          imageProcessed = true;
        } catch (err) {
          console.error(`[${clientRequestId}] Error converting image:`, err);
        }
      } else {
        console.warn(`[${clientRequestId}] Skipping invalid image value:`, {
          type: typeof value,
          value: typeof value === 'string' ? value.substring(0, 100) : 'not a string',
        });
      }
      // Skip empty strings or invalid image values
    } else if (key === 'tags' || key === 'iconColors') {
      formData.append(key, JSON.stringify(value));
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  console.log(`[${clientRequestId}] FormData prepared:`, {
    imageProcessed,
    keys: Array.from(formData.keys()),
  });

  if (!imageProcessed) {
    console.error(`[${clientRequestId}] Warning: No image was added to FormData!`);
  }

  console.log(`[${clientRequestId}] Sending POST request to /api/items`);
  const response = await fetch('/api/items', {
    method: 'POST',
    body: formData,
  });

  console.log(`[${clientRequestId}] Response received:`, {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error(`[${clientRequestId}] Request failed:`, {
      status: response.status,
      data,
    });
    // Include full error details in the message
    const errorMsg = data.details || data.error || 'Failed to add item';
    const fullError = data.details && data.error ? `${data.error}: ${data.details}` : errorMsg;
    throw new Error(fullError);
  }

  console.log(`[${clientRequestId}] Item created successfully`);
}

export async function updateItem(item: Item): Promise<void> {
  const formData = new FormData();
  Object.entries(item).forEach(([key, value]) => {
    if (key === 'image') {
      if (typeof value === 'string' && value.startsWith('data:')) {
        const byteString = atob(value.split(',')[1]);
        const mimeString = value.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const extension = mimeString.split('/')[1] || 'jpg';
        formData.append(key, blob, `image.${extension}`);
      }
      // Skip empty strings or invalid image values
    } else if (key === 'tags' || key === 'iconColors') {
      formData.append(key, JSON.stringify(value));
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(`/api/items/${item.id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update item');
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
