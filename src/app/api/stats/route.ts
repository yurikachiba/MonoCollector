import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      .map((cat) => ({
        category: cat.name,
        count: items.filter((item) => item.category === cat.id).length,
      }))
      .filter((c) => c.count > 0);

    const recentItems = items.slice(0, 5).map(item => ({
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
