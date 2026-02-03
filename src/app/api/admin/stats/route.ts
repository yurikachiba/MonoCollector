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
  userId?: string | null;
}

interface UserWithItems {
  id: string;
  isGuest: boolean;
  createdAt: Date;
  _count: { items: number };
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
      usersWithItemCounts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isGuest: true } }),
      prisma.item.count(),
      prisma.item.findMany({
        select: {
          category: true,
          createdAt: true,
          userId: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany(),
      prisma.user.findMany({
        select: {
          id: true,
          isGuest: true,
          createdAt: true,
          _count: { select: { items: true } },
        },
      }),
    ]);

    // Category breakdown
    const categoryBreakdown = categories.map((cat: CategoryWithCount) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      count: items.filter((item: ItemWithDate) => item.category === cat.id).length,
    })).filter((c: { count: number }) => c.count > 0).sort((a: { count: number }, b: { count: number }) => b.count - a.count);

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

    // ========================================
    // ファネル分析
    // ========================================
    const usersWithZeroItems = usersWithItemCounts.filter((u: UserWithItems) => u._count.items === 0).length;
    const usersWithOneItem = usersWithItemCounts.filter((u: UserWithItems) => u._count.items === 1).length;
    const usersWithMultipleItems = usersWithItemCounts.filter((u: UserWithItems) => u._count.items > 1).length;
    const usersWithFiveOrMore = usersWithItemCounts.filter((u: UserWithItems) => u._count.items >= 5).length;
    const usersWithTenOrMore = usersWithItemCounts.filter((u: UserWithItems) => u._count.items >= 10).length;

    const funnel = {
      stages: [
        { name: '訪問→登録', from: totalUsers, to: totalUsers, rate: 100 },
        { name: '登録→1件登録', from: totalUsers, to: usersWithItems, rate: totalUsers > 0 ? Math.round((usersWithItems / totalUsers) * 100) : 0 },
        { name: '1件→複数登録', from: usersWithItems, to: usersWithMultipleItems, rate: usersWithItems > 0 ? Math.round((usersWithMultipleItems / usersWithItems) * 100) : 0 },
        { name: '複数→5件以上', from: usersWithMultipleItems, to: usersWithFiveOrMore, rate: usersWithMultipleItems > 0 ? Math.round((usersWithFiveOrMore / usersWithMultipleItems) * 100) : 0 },
        { name: '5件→10件以上', from: usersWithFiveOrMore, to: usersWithTenOrMore, rate: usersWithFiveOrMore > 0 ? Math.round((usersWithTenOrMore / usersWithFiveOrMore) * 100) : 0 },
      ],
      guestToRegistered: {
        guests: guestUsers,
        registered: totalUsers - guestUsers,
        conversionRate: totalUsers > 0 ? Math.round(((totalUsers - guestUsers) / totalUsers) * 100) : 0,
      },
    };

    // ========================================
    // エンゲージメント分析
    // ========================================
    const itemDistribution = {
      zero: usersWithZeroItems,
      one: usersWithOneItem,
      twoToFive: usersWithItemCounts.filter((u: UserWithItems) => u._count.items >= 2 && u._count.items <= 5).length,
      sixToTen: usersWithItemCounts.filter((u: UserWithItems) => u._count.items >= 6 && u._count.items <= 10).length,
      elevenPlus: usersWithItemCounts.filter((u: UserWithItems) => u._count.items > 10).length,
    };

    // パワーユーザー（上位10%）
    const sortedByItems = [...usersWithItemCounts].sort((a: UserWithItems, b: UserWithItems) => b._count.items - a._count.items);
    const top10PercentCount = Math.max(1, Math.ceil(sortedByItems.length * 0.1));
    const powerUsers = sortedByItems.slice(0, top10PercentCount);
    const powerUserItemCount = powerUsers.reduce((sum: number, u: UserWithItems) => sum + u._count.items, 0);

    // パレート分析（累積分布）
    const paretoData = [];
    let cumulativeItems = 0;
    for (let i = 0; i < sortedByItems.length; i++) {
      cumulativeItems += sortedByItems[i]._count.items;
      const userPercent = Math.round(((i + 1) / sortedByItems.length) * 100);
      const itemPercent = totalItems > 0 ? Math.round((cumulativeItems / totalItems) * 100) : 0;
      // 10%刻みでデータポイントを記録
      if (userPercent % 10 === 0 || i === sortedByItems.length - 1) {
        paretoData.push({ userPercent, itemPercent });
      }
    }

    // トップユーザー詳細（上位5人、匿名化）
    const topUsers = sortedByItems.slice(0, 5).map((u: UserWithItems, index: number) => ({
      rank: index + 1,
      itemCount: u._count.items,
      isGuest: u.isGuest,
      percentOfTotal: totalItems > 0 ? Math.round((u._count.items / totalItems) * 100) : 0,
    }));

    const engagement = {
      distribution: itemDistribution,
      powerUsers: {
        count: top10PercentCount,
        itemCount: powerUserItemCount,
        percentOfTotalItems: totalItems > 0 ? Math.round((powerUserItemCount / totalItems) * 100) : 0,
        avgItemsPerPowerUser: top10PercentCount > 0 ? Math.round((powerUserItemCount / top10PercentCount) * 10) / 10 : 0,
      },
      averageItemsPerActiveUser: usersWithItems > 0 ? Math.round((totalItems / usersWithItems) * 10) / 10 : 0,
      paretoData,
      topUsers,
    };

    // ========================================
    // リテンション分析（簡易版）
    // ========================================
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // 過去7日間に登録したユーザー
    const newUsersLast7Days = usersWithItemCounts.filter((u: UserWithItems) => u.createdAt >= sevenDaysAgo).length;
    // 7-14日前に登録したユーザー
    const usersFrom7To14Days = usersWithItemCounts.filter((u: UserWithItems) => u.createdAt >= fourteenDaysAgo && u.createdAt < sevenDaysAgo);
    // その中で過去7日間にアイテムを追加したユーザー
    const activeUsersFrom7To14Days = usersFrom7To14Days.filter((u: UserWithItems) => {
      const userItems = items.filter((i: ItemWithDate) => i.userId === u.id);
      return userItems.some((i: ItemWithDate) => i.createdAt >= sevenDaysAgo);
    }).length;

    const retention = {
      newUsersLast7Days,
      week1Retention: {
        cohortSize: usersFrom7To14Days.length,
        retained: activeUsersFrom7To14Days,
        rate: usersFrom7To14Days.length > 0 ? Math.round((activeUsersFrom7To14Days / usersFrom7To14Days.length) * 100) : 0,
      },
    };

    // ========================================
    // 成長トレンド
    // ========================================
    const usersCreatedThisWeek = usersWithItemCounts.filter((u: UserWithItems) => u.createdAt >= oneWeekAgo).length;
    const usersCreatedLastWeek = usersWithItemCounts.filter((u: UserWithItems) => u.createdAt >= twoWeeksAgo && u.createdAt < oneWeekAgo).length;
    const userGrowthRate = usersCreatedLastWeek > 0
      ? Math.round(((usersCreatedThisWeek - usersCreatedLastWeek) / usersCreatedLastWeek) * 100)
      : usersCreatedThisWeek > 0 ? 100 : 0;

    const growth = {
      users: {
        thisWeek: usersCreatedThisWeek,
        lastWeek: usersCreatedLastWeek,
        growthRate: userGrowthRate,
      },
      items: {
        thisWeek: weeklyActivity.thisWeek,
        lastWeek: weeklyActivity.lastWeek,
        growthRate: weeklyActivity.lastWeek > 0
          ? Math.round(((weeklyActivity.thisWeek - weeklyActivity.lastWeek) / weeklyActivity.lastWeek) * 100)
          : weeklyActivity.thisWeek > 0 ? 100 : 0,
      },
    };

    // ========================================
    // インサイト生成
    // ========================================
    const insights = [];
    const registeredRate = totalUsers > 0 ? Math.round(((totalUsers - guestUsers) / totalUsers) * 100) : 0;
    const dropOffRate = usersWithItems > 0 ? Math.round(((usersWithItems - usersWithMultipleItems) / usersWithItems) * 100) : 0;

    // ゲスト→登録転換率のインサイト
    if (registeredRate < 30) {
      insights.push({
        type: 'warning' as const,
        category: 'conversion',
        title: 'ゲスト→登録の転換率が低め',
        message: `登録率${registeredRate}%。「データを永久保存」などのメリット訴求で改善の余地あり`,
        metric: { label: '登録率', value: registeredRate, unit: '%' },
      });
    } else if (registeredRate >= 50) {
      insights.push({
        type: 'success' as const,
        category: 'conversion',
        title: '登録転換率が好調',
        message: `${registeredRate}%のユーザーが登録済み。UXが効いている証拠`,
        metric: { label: '登録率', value: registeredRate, unit: '%' },
      });
    }

    // 1件登録後の離脱率インサイト
    if (dropOffRate > 40 && usersWithItems >= 3) {
      insights.push({
        type: 'warning' as const,
        category: 'engagement',
        title: '1件登録後の離脱が多い',
        message: `${dropOffRate}%が1件で止まっている。振り返りリマインドや「シリーズ登録」提案が効くかも`,
        metric: { label: '離脱率', value: dropOffRate, unit: '%' },
      });
    }

    // パワーユーザー集中のインサイト
    const powerUserPercent = engagement.powerUsers.percentOfTotalItems;
    if (powerUserPercent >= 70 && usersWithItems >= 5) {
      insights.push({
        type: 'info' as const,
        category: 'pareto',
        title: 'パレート則が顕著',
        message: `上位${top10PercentCount}人が全アイテムの${powerUserPercent}%を登録。このユーザーからフィードバックを得るべき`,
        metric: { label: 'パワーユーザー貢献', value: powerUserPercent, unit: '%' },
      });
    }

    // リテンション率のインサイト
    if (retention.week1Retention.cohortSize >= 3 && retention.week1Retention.rate < 20) {
      insights.push({
        type: 'warning' as const,
        category: 'retention',
        title: '週1リテンションが低い',
        message: `7日後のリテンション率${retention.week1Retention.rate}%。プッシュ通知や振り返り機能の導入を検討`,
        metric: { label: 'リテンション', value: retention.week1Retention.rate, unit: '%' },
      });
    }

    // 成長トレンドのインサイト
    if (growth.users.growthRate >= 50 && growth.users.thisWeek >= 3) {
      insights.push({
        type: 'success' as const,
        category: 'growth',
        title: 'ユーザー成長が加速中',
        message: `今週+${growth.users.growthRate}%の成長。この勢いを維持しよう`,
        metric: { label: '成長率', value: growth.users.growthRate, unit: '%' },
      });
    }

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
      // 新しい分析データ
      funnel,
      engagement,
      retention,
      growth,
      insights,
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
