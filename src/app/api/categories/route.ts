import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const defaultCategories = [
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

// GET /api/categories - Get all categories
export async function GET() {
  try {
    // Initialize default categories if none exist
    const existingCount = await prisma.category.count();

    if (existingCount === 0) {
      await prisma.category.createMany({
        data: defaultCategories,
        skipDuplicates: true,
      });
    }

    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
