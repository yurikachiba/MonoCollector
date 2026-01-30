import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/items - Get all items
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const item = await prisma.item.create({
      data: {
        id: body.id,
        name: body.name,
        category: body.category,
        icon: body.icon,
        image: body.image,
        location: body.location,
        quantity: body.quantity,
        notes: body.notes,
        tags: body.tags,
        isCollected: body.isCollected,
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
      },
    });

    // Update category item count
    await updateCategoryCount(body.category);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Failed to create item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

const defaultCategories: Record<string, { name: string; icon: string; color: string }> = {
  food: { name: '食品・食材', icon: '🍎', color: '#FF6B6B' },
  kitchen: { name: 'キッチン用品', icon: '🍳', color: '#4ECDC4' },
  clothes: { name: '衣類', icon: '👕', color: '#45B7D1' },
  electronics: { name: '電子機器', icon: '📱', color: '#96CEB4' },
  books: { name: '本・書籍', icon: '📚', color: '#FFEAA7' },
  cosmetics: { name: 'コスメ・美容', icon: '💄', color: '#DDA0DD' },
  stationery: { name: '文房具', icon: '✏️', color: '#98D8C8' },
  toys: { name: 'おもちゃ・ホビー', icon: '🎮', color: '#F7DC6F' },
  cleaning: { name: '掃除用品', icon: '🧹', color: '#85C1E9' },
  medicine: { name: '薬・医療品', icon: '💊', color: '#F1948A' },
  furniture: { name: '家具・インテリア', icon: '🪑', color: '#D7BDE2' },
  sports: { name: 'スポーツ用品', icon: '⚽', color: '#82E0AA' },
  other: { name: 'その他', icon: '📦', color: '#AEB6BF' },
};

async function updateCategoryCount(categoryId: string) {
  const count = await prisma.item.count({
    where: { category: categoryId },
  });

  const defaultCategory = defaultCategories[categoryId] || defaultCategories.other;

  await prisma.category.upsert({
    where: { id: categoryId },
    update: { itemCount: count },
    create: {
      id: categoryId,
      name: defaultCategory.name,
      icon: defaultCategory.icon,
      color: defaultCategory.color,
      itemCount: count,
    },
  });
}
