import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CategoryWithCount {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ItemWithDate {
  id: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string | null;
  tags: string[];
  location: string;
  iconStyle: string | null;
  iconColors: string[];
  isCollected: boolean;
  image: Uint8Array | null;
}

interface UserWithItems {
  id: string;
  isGuest: boolean;
  createdAt: Date;
  _count: { items: number };
}

// GET /api/admin/stats - Get admin statistics (no personal info)
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || '30'; // 7, 14, 30, or 'all'
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
          id: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          tags: true,
          location: true,
          iconStyle: true,
          iconColors: true,
          isCollected: true,
          image: true,
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

    // ========================================
    // コンテンツ統計（新規追加）
    // ========================================

    // タグ人気度の集計
    const tagCounts: Record<string, number> = {};
    items.forEach((item: ItemWithDate) => {
      item.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const popularTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count, percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0 }));

    const itemsWithTags = items.filter((i: ItemWithDate) => i.tags.length > 0).length;
    const tagUsageRate = totalItems > 0 ? Math.round((itemsWithTags / totalItems) * 100) : 0;

    // ロケーション分布
    const locationCounts: Record<string, number> = {};
    items.forEach((item: ItemWithDate) => {
      if (item.location) {
        locationCounts[item.location] = (locationCounts[item.location] || 0) + 1;
      }
    });
    const popularLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([location, count]) => ({ location, count, percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0 }));

    const uniqueLocations = Object.keys(locationCounts).length;

    // アイコンスタイル統計
    const styleCounts: Record<string, number> = {};
    items.forEach((item: ItemWithDate) => {
      const style = item.iconStyle || 'default';
      styleCounts[style] = (styleCounts[style] || 0) + 1;
    });
    const iconStyleStats = Object.entries(styleCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([style, count]) => ({ style, count, percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0 }));

    // カラーパレット統計
    const colorCounts: Record<string, number> = {};
    items.forEach((item: ItemWithDate) => {
      item.iconColors.forEach((color) => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      });
    });
    const popularColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([color, count]) => ({ color, count }));

    const contentStats = {
      tags: {
        popularTags,
        totalUniqueTags: Object.keys(tagCounts).length,
        itemsWithTags,
        tagUsageRate,
        avgTagsPerItem: totalItems > 0 ? Math.round((Object.values(tagCounts).reduce((a, b) => a + b, 0) / totalItems) * 10) / 10 : 0,
      },
      locations: {
        popularLocations,
        uniqueLocations,
      },
      iconStyles: iconStyleStats,
      colors: popularColors,
    };

    // ========================================
    // アイテムライフサイクル分析（新規追加）
    // ========================================

    // 回収率
    const collectedItems = items.filter((i: ItemWithDate) => i.isCollected).length;
    const collectionRate = totalItems > 0 ? Math.round((collectedItems / totalItems) * 100) : 0;

    // 更新率（作成日と更新日が異なるアイテム）
    const updatedItems = items.filter((i: ItemWithDate) => {
      const created = new Date(i.createdAt).getTime();
      const updated = new Date(i.updatedAt).getTime();
      return updated - created > 60000; // 1分以上の差がある場合を「更新」とみなす
    }).length;
    const updateRate = totalItems > 0 ? Math.round((updatedItems / totalItems) * 100) : 0;

    // アイテムの平均寿命（作成からの日数）
    const itemAges = items.map((i: ItemWithDate) => {
      const created = new Date(i.createdAt).getTime();
      return Math.floor((now.getTime() - created) / (24 * 60 * 60 * 1000));
    });
    const avgItemAge = itemAges.length > 0 ? Math.round(itemAges.reduce((a: number, b: number) => a + b, 0) / itemAges.length) : 0;

    // 最近7日間に作成されたアイテムの割合
    const recentItems = items.filter((i: ItemWithDate) => i.createdAt >= sevenDaysAgo).length;
    const recentItemsRate = totalItems > 0 ? Math.round((recentItems / totalItems) * 100) : 0;

    // 30日以上更新されていない「放置アイテム」
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const staleItems = items.filter((i: ItemWithDate) => {
      const updated = new Date(i.updatedAt).getTime();
      return now.getTime() - updated > thirtyDaysInMs;
    }).length;
    const staleItemsRate = totalItems > 0 ? Math.round((staleItems / totalItems) * 100) : 0;

    const itemLifecycle = {
      collection: {
        collected: collectedItems,
        uncollected: totalItems - collectedItems,
        rate: collectionRate,
      },
      updates: {
        updated: updatedItems,
        unchanged: totalItems - updatedItems,
        rate: updateRate,
      },
      age: {
        avgDays: avgItemAge,
        recentItems,
        recentItemsRate,
        staleItems,
        staleItemsRate,
      },
    };

    // ========================================
    // アクティブ時間帯分析（新規追加）
    // ========================================

    // 時間帯別のアイテム作成数（0-23時）
    const hourlyActivity: number[] = new Array(24).fill(0);
    items.forEach((item: ItemWithDate) => {
      const hour = new Date(item.createdAt).getHours();
      hourlyActivity[hour]++;
    });

    // ピーク時間の特定
    const maxHourlyCount = Math.max(...hourlyActivity);
    const peakHours = hourlyActivity
      .map((count, hour) => ({ hour, count }))
      .filter((h) => h.count === maxHourlyCount)
      .map((h) => h.hour);

    // 曜日別のアイテム作成数
    const dailyOfWeek: number[] = new Array(7).fill(0);
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    items.forEach((item: ItemWithDate) => {
      const day = new Date(item.createdAt).getDay();
      dailyOfWeek[day]++;
    });

    // 時間帯カテゴリ（朝/昼/夜/深夜）
    const timeOfDayStats = {
      morning: hourlyActivity.slice(6, 12).reduce((a, b) => a + b, 0), // 6-11時
      afternoon: hourlyActivity.slice(12, 18).reduce((a, b) => a + b, 0), // 12-17時
      evening: hourlyActivity.slice(18, 24).reduce((a, b) => a + b, 0), // 18-23時
      night: hourlyActivity.slice(0, 6).reduce((a, b) => a + b, 0), // 0-5時
    };

    const activeHours = {
      hourly: hourlyActivity.map((count, hour) => ({ hour, count })),
      peakHours,
      daily: dailyOfWeek.map((count, day) => ({ day: dayNames[day], count })),
      timeOfDay: timeOfDayStats,
    };

    // ========================================
    // ストレージ統計（新規追加）
    // ========================================

    // 画像データの合計サイズ
    let totalImageSize = 0;
    items.forEach((item: ItemWithDate) => {
      if (item.image) {
        totalImageSize += item.image.length;
      }
    });

    const avgImageSize = totalItems > 0 ? Math.round(totalImageSize / totalItems) : 0;
    const itemsWithImages = items.filter((i: ItemWithDate) => i.image && i.image.length > 0).length;

    const storage = {
      totalSize: totalImageSize,
      totalSizeMB: Math.round((totalImageSize / (1024 * 1024)) * 100) / 100,
      avgSizePerItem: avgImageSize,
      avgSizePerItemKB: Math.round((avgImageSize / 1024) * 100) / 100,
      itemsWithImages,
      imageUsageRate: totalItems > 0 ? Math.round((itemsWithImages / totalItems) * 100) : 0,
    };

    // コンテンツ関連のインサイト追加
    if (tagUsageRate < 20 && totalItems >= 10) {
      insights.push({
        type: 'info' as const,
        category: 'content',
        title: 'タグの活用率が低め',
        message: `タグ使用率${tagUsageRate}%。タグ付けを促すUIや自動タグ提案で整理しやすくなるかも`,
        metric: { label: 'タグ使用率', value: tagUsageRate, unit: '%' },
      });
    }

    if (collectionRate >= 30 && totalItems >= 5) {
      insights.push({
        type: 'success' as const,
        category: 'lifecycle',
        title: '回収機能が活用されている',
        message: `${collectionRate}%のアイテムが「回収済み」。ユーザーが実際にコレクションを管理している証拠`,
        metric: { label: '回収率', value: collectionRate, unit: '%' },
      });
    }

    if (staleItemsRate >= 50 && totalItems >= 10) {
      insights.push({
        type: 'warning' as const,
        category: 'lifecycle',
        title: '放置アイテムが多い',
        message: `${staleItemsRate}%のアイテムが30日以上更新なし。リマインド通知で再エンゲージメントを促せるかも`,
        metric: { label: '放置率', value: staleItemsRate, unit: '%' },
      });
    }

    // ========================================
    // コホート分析（登録週ごとのリテンション）
    // ========================================
    const cohortAnalysis = [];
    for (let weeksAgo = 0; weeksAgo < 8; weeksAgo++) {
      const cohortStart = new Date(now.getTime() - (weeksAgo + 1) * 7 * 24 * 60 * 60 * 1000);
      const cohortEnd = new Date(now.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000);

      const cohortUsers = usersWithItemCounts.filter((u: UserWithItems) =>
        u.createdAt >= cohortStart && u.createdAt < cohortEnd
      );

      if (cohortUsers.length === 0) continue;

      // このコホートのユーザーのうち、登録後もアイテムを追加したユーザー
      const activeInCohort = cohortUsers.filter((u: UserWithItems) => u._count.items > 0).length;

      // このコホートのユーザーのうち、複数アイテムを持つユーザー
      const engagedInCohort = cohortUsers.filter((u: UserWithItems) => u._count.items >= 3).length;

      cohortAnalysis.push({
        weekLabel: weeksAgo === 0 ? '今週' : `${weeksAgo}週前`,
        weeksAgo,
        totalUsers: cohortUsers.length,
        activeUsers: activeInCohort,
        engagedUsers: engagedInCohort,
        activationRate: Math.round((activeInCohort / cohortUsers.length) * 100),
        engagementRate: Math.round((engagedInCohort / cohortUsers.length) * 100),
      });
    }

    // ========================================
    // 時間×曜日ヒートマップデータ
    // ========================================
    const heatmapData: number[][] = Array(7).fill(null).map(() => Array(24).fill(0));
    items.forEach((item: ItemWithDate) => {
      const date = new Date(item.createdAt);
      const day = date.getDay();
      const hour = date.getHours();
      heatmapData[day][hour]++;
    });

    // ========================================
    // 最近のアクティビティフィード
    // ========================================
    const recentActivity = items.slice(0, 20).map((item: ItemWithDate) => {
      const category = categories.find((c: CategoryWithCount) => c.id === item.category);
      return {
        type: 'item_created',
        timestamp: item.createdAt,
        category: category ? { name: category.name, icon: category.icon, color: category.color } : null,
        location: item.location,
        hasImage: item.image && item.image.length > 0,
        tagsCount: item.tags.length,
      };
    });

    // ========================================
    // 月次トレンド（過去6ヶ月）
    // ========================================
    const monthlyTrends = [];
    for (let monthsAgo = 0; monthsAgo < 6; monthsAgo++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0);

      const monthItems = items.filter((i: ItemWithDate) =>
        i.createdAt >= monthStart && i.createdAt <= monthEnd
      ).length;

      const monthUsers = usersWithItemCounts.filter((u: UserWithItems) =>
        u.createdAt >= monthStart && u.createdAt <= monthEnd
      ).length;

      monthlyTrends.unshift({
        month: monthStart.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }),
        items: monthItems,
        users: monthUsers,
      });
    }

    // ========================================
    // 期間フィルター適用後の統計
    // ========================================
    const periodDays = period === 'all' ? Infinity : parseInt(period, 10);
    const periodStart = period === 'all'
      ? new Date(0)
      : new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const filteredItems = period === 'all'
      ? items
      : items.filter((i: ItemWithDate) => i.createdAt >= periodStart);

    const filteredUsers = period === 'all'
      ? usersWithItemCounts
      : usersWithItemCounts.filter((u: UserWithItems) => u.createdAt >= periodStart);

    const periodStats = {
      period,
      itemsInPeriod: filteredItems.length,
      usersInPeriod: filteredUsers.length,
      avgItemsPerDay: periodDays !== Infinity
        ? Math.round((filteredItems.length / periodDays) * 10) / 10
        : Math.round((items.length / 365) * 10) / 10,
    };

    // ========================================
    // システムステータス
    // ========================================
    const responseTime = Date.now() - startTime;
    const systemStatus = {
      lastUpdated: now.toISOString(),
      responseTimeMs: responseTime,
      dataFreshness: 'realtime',
      totalRecords: {
        users: totalUsers,
        items: totalItems,
        categories: categories.length,
      },
    };

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
      // 追加の分析データ
      contentStats,
      itemLifecycle,
      activeHours,
      storage,
      // 新規追加: 強化データ
      cohortAnalysis,
      heatmapData,
      recentActivity,
      monthlyTrends,
      periodStats,
      systemStatus,
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
