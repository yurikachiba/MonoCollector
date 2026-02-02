import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CategoryWithCount {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ItemWithDate {
  category: string;
  createdAt: Date;
}

// GET /api/admin/stats - Get admin statistics (no personal info)
export async function GET() {
  try {
    // Fetch all data in parallel
    const [
      totalUsers,
      guestUsers,
      totalItems,
      items,
      categories,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isGuest: true } }),
      prisma.item.count(),
      prisma.item.findMany({
        select: {
          category: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany(),
    ]);

    // Category breakdown
    const categoryBreakdown = categories.map((cat: CategoryWithCount) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      count: items.filter((item: ItemWithDate) => item.category === cat.id).length,
    })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

    // Daily activity for the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailyActivity: Record<string, number> = {};

    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyActivity[dateStr] = 0;
    }

    items.forEach((item: ItemWithDate) => {
      if (item.createdAt >= thirtyDaysAgo) {
        const dateStr = item.createdAt.toISOString().split('T')[0];
        if (dailyActivity[dateStr] !== undefined) {
          dailyActivity[dateStr]++;
        }
      }
    });

    // Convert to array sorted by date
    const dailyActivityArray = Object.entries(dailyActivity)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Weekly activity summary
    const weeklyActivity = {
      thisWeek: 0,
      lastWeek: 0,
    };

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    items.forEach((item: ItemWithDate) => {
      if (item.createdAt >= oneWeekAgo) {
        weeklyActivity.thisWeek++;
      } else if (item.createdAt >= twoWeeksAgo) {
        weeklyActivity.lastWeek++;
      }
    });

    // Items per user average
    const avgItemsPerUser = totalUsers > 0 ? Math.round((totalItems / totalUsers) * 10) / 10 : 0;

    // Active users (users with at least 1 item)
    const usersWithItems = await prisma.user.count({
      where: {
        items: {
          some: {},
        },
      },
    });

    return NextResponse.json({
      users: {
        total: totalUsers,
        guests: guestUsers,
        registered: totalUsers - guestUsers,
        active: usersWithItems,
      },
      items: {
        total: totalItems,
        avgPerUser: avgItemsPerUser,
      },
      categoryBreakdown,
      activity: {
        daily: dailyActivityArray,
        weekly: weeklyActivity,
      },
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
