import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PrismaItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  image: Uint8Array;
  location: string;
  quantity: number;
  notes: string;
  tags: string[];
  isCollected: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  itemCount: number;
}

// GET /api/stats - Get statistics
export async function GET() {
  try {
    const [items, categories] = await Promise.all([
      prisma.item.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany(),
    ]);

    const categoryBreakdown = categories
      .map((cat: PrismaCategory) => ({
        category: cat.name,
        count: items.filter((item: PrismaItem) => item.category === cat.id).length,
      }))
      .filter((c: { category: string; count: number }) => c.count > 0);

    const recentItems = items.slice(0, 5).map((item: PrismaItem) => ({
      ...item,
      image: `data:image/jpeg;base64,${Buffer.from(item.image).toString('base64')}`
    }));

    return NextResponse.json({
      totalItems: items.length,
      categoryBreakdown,
      recentItems,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
