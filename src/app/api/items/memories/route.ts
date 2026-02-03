import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/items/memories - 振り返り対象のアイテムを取得
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();

    // 振り返り候補を取得:
    // - 7日前、14日前、30日前、90日前、365日前に登録されたアイテム
    const memoryWindows = [
      { days: 7, label: '1週間前' },
      { days: 14, label: '2週間前' },
      { days: 30, label: '1ヶ月前' },
      { days: 90, label: '3ヶ月前' },
      { days: 365, label: '1年前' },
    ];

    const memories = [];

    for (const window of memoryWindows) {
      const targetDate = new Date(now.getTime() - window.days * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const items = await prisma.item.findMany({
        where: {
          userId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        select: {
          id: true,
          name: true,
          category: true,
          icon: true,
          generatedIcon: true,
          createdAt: true,
        },
        take: 3, // 各期間から最大3件
      });

      if (items.length > 0) {
        memories.push({
          period: window.label,
          days: window.days,
          items: items.map((item: { id: string; name: string; category: string; icon: string; generatedIcon: string | null; createdAt: Date }) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            icon: item.icon,
            generatedIcon: item.generatedIcon,
            createdAt: item.createdAt.toISOString(),
          })),
        });
      }
    }

    // 最近追加したアイテムがある場合のみ、振り返りを有効に
    const recentItemCount = await prisma.item.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // 表示済みフラグをセッションストレージで管理するため、
    // サーバー側では単純にデータを返す
    return NextResponse.json({
      memories,
      hasRecentActivity: recentItemCount > 0,
      totalItems: memories.reduce((sum, m) => sum + m.items.length, 0),
    });
  } catch (error) {
    console.error('Failed to fetch memories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memories' },
      { status: 500 }
    );
  }
}
