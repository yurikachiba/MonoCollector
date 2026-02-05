'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowLeft,
  RefreshCw,
  UserCheck,
  UserX,
  Filter,
  Zap,
  Target,
  Repeat,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Info,
  Crown,
  PieChart,
  Tag,
  MapPin,
  Palette,
  Clock,
  HardDrive,
  Calendar,
  CheckSquare,
  Edit3,
  Sun,
  Moon,
  Sunset,
  Sunrise,
  Download,
  Activity,
  Timer,
  Grid3X3,
  ChevronDown,
  Play,
  Pause,
  LineChart,
  Image,
} from 'lucide-react';

interface AdminStats {
  users: {
    total: number;
    guests: number;
    registered: number;
    active: number;
  };
  items: {
    total: number;
    avgPerUser: number;
  };
  categoryBreakdown: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    count: number;
  }>;
  activity: {
    daily: Array<{ date: string; count: number }>;
    weekly: {
      thisWeek: number;
      lastWeek: number;
    };
  };
  funnel: {
    stages: Array<{
      name: string;
      from: number;
      to: number;
      rate: number;
    }>;
    guestToRegistered: {
      guests: number;
      registered: number;
      conversionRate: number;
    };
  };
  engagement: {
    distribution: {
      zero: number;
      one: number;
      twoToFive: number;
      sixToTen: number;
      elevenPlus: number;
    };
    powerUsers: {
      count: number;
      itemCount: number;
      percentOfTotalItems: number;
      avgItemsPerPowerUser: number;
    };
    averageItemsPerActiveUser: number;
    paretoData: Array<{ userPercent: number; itemPercent: number }>;
    topUsers: Array<{
      rank: number;
      itemCount: number;
      isGuest: boolean;
      percentOfTotal: number;
    }>;
  };
  retention: {
    newUsersLast7Days: number;
    week1Retention: {
      cohortSize: number;
      retained: number;
      rate: number;
    };
  };
  growth: {
    users: {
      thisWeek: number;
      lastWeek: number;
      growthRate: number;
    };
    items: {
      thisWeek: number;
      lastWeek: number;
      growthRate: number;
    };
  };
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    category: string;
    title: string;
    message: string;
    metric: { label: string; value: number; unit: string };
  }>;
  contentStats: {
    tags: {
      popularTags: Array<{ tag: string; count: number; percentage: number }>;
      totalUniqueTags: number;
      itemsWithTags: number;
      tagUsageRate: number;
      avgTagsPerItem: number;
    };
    locations: {
      popularLocations: Array<{ location: string; count: number; percentage: number }>;
      uniqueLocations: number;
    };
    iconStyles: Array<{ style: string; count: number; percentage: number }>;
    colors: Array<{ color: string; count: number }>;
  };
  itemLifecycle: {
    collection: {
      collected: number;
      uncollected: number;
      rate: number;
    };
    updates: {
      updated: number;
      unchanged: number;
      rate: number;
    };
    age: {
      avgDays: number;
      recentItems: number;
      recentItemsRate: number;
      staleItems: number;
      staleItemsRate: number;
    };
  };
  activeHours: {
    hourly: Array<{ hour: number; count: number }>;
    peakHours: number[];
    daily: Array<{ day: string; count: number }>;
    timeOfDay: {
      morning: number;
      afternoon: number;
      evening: number;
      night: number;
    };
  };
  storage: {
    totalSize: number;
    totalSizeMB: number;
    avgSizePerItem: number;
    avgSizePerItemKB: number;
    itemsWithImages: number;
    imageUsageRate: number;
  };
  cohortAnalysis: Array<{
    weekLabel: string;
    weeksAgo: number;
    totalUsers: number;
    activeUsers: number;
    engagedUsers: number;
    activationRate: number;
    engagementRate: number;
  }>;
  heatmapData: number[][];
  recentActivity: Array<{
    type: string;
    timestamp: string;
    category: { name: string; icon: string; color: string } | null;
    location: string;
    hasImage: boolean;
    tagsCount: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    items: number;
    users: number;
  }>;
  periodStats: {
    period: string;
    itemsInPeriod: number;
    usersInPeriod: number;
    avgItemsPerDay: number;
  };
  systemStatus: {
    lastUpdated: string;
    responseTimeMs: number;
    dataFreshness: string;
    totalRecords: {
      users: number;
      items: number;
      categories: number;
    };
  };
}

type AutoRefreshInterval = 0 | 30 | 60;
type PeriodFilter = '7' | '14' | '30' | 'all';

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<AutoRefreshInterval>(0);
  const [period, setPeriod] = useState<PeriodFilter>('30');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const fetchStats = async (selectedPeriod: PeriodFilter = period) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/stats?period=${selectedPeriod}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // 自動更新
  useEffect(() => {
    if (autoRefresh === 0) return;

    const interval = setInterval(() => {
      fetchStats();
    }, autoRefresh * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, period]);

  useEffect(() => {
    fetchStats();
  }, []);

  // 期間変更時
  const handlePeriodChange = (newPeriod: PeriodFilter) => {
    setPeriod(newPeriod);
    setShowPeriodDropdown(false);
    fetchStats(newPeriod);
  };

  // エクスポート機能
  const exportData = (format: 'json' | 'csv') => {
    if (!stats) return;

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monocollector-stats-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV形式で主要データをエクスポート
      const rows = [
        ['メトリクス', '値'],
        ['総ユーザー数', stats.users.total.toString()],
        ['アクティブユーザー', stats.users.active.toString()],
        ['ゲストユーザー', stats.users.guests.toString()],
        ['登録ユーザー', stats.users.registered.toString()],
        ['総アイテム数', stats.items.total.toString()],
        ['平均アイテム数/ユーザー', stats.items.avgPerUser.toString()],
        ['今週のアイテム', stats.activity.weekly.thisWeek.toString()],
        ['先週のアイテム', stats.activity.weekly.lastWeek.toString()],
        ['週1リテンション率', `${stats.retention.week1Retention.rate}%`],
        ['ユーザー成長率', `${stats.growth.users.growthRate}%`],
        ['アイテム成長率', `${stats.growth.items.growthRate}%`],
        ['ストレージ使用量(MB)', stats.storage.totalSizeMB.toString()],
      ];
      const csvContent = rows.map(row => row.join(',')).join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monocollector-stats-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setShowExportDropdown(false);
  };

  const periodLabels: Record<PeriodFilter, string> = {
    '7': '過去7日',
    '14': '過去14日',
    '30': '過去30日',
    'all': '全期間',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>読み込み中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchStats()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const weeklyChange = stats.activity.weekly.lastWeek > 0
    ? Math.round(((stats.activity.weekly.thisWeek - stats.activity.weekly.lastWeek) / stats.activity.weekly.lastWeek) * 100)
    : stats.activity.weekly.thisWeek > 0 ? 100 : 0;

  const maxDailyCount = Math.max(...stats.activity.daily.map(d => d.count), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/collection"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  管理ダッシュボード
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  MonoCollector 統計情報
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* 期間フィルター */}
              <div className="relative">
                <button
                  onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                >
                  <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{periodLabels[period]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showPeriodDropdown && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                    {(Object.keys(periodLabels) as PeriodFilter[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePeriodChange(p)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          period === p ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                        } first:rounded-t-lg last:rounded-b-lg`}
                      >
                        {periodLabels[p]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 自動更新 */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setAutoRefresh(0)}
                  className={`p-1.5 rounded transition-colors ${autoRefresh === 0 ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="手動更新"
                >
                  <Pause className={`w-4 h-4 ${autoRefresh === 0 ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`} />
                </button>
                <button
                  onClick={() => setAutoRefresh(30)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${autoRefresh === 30 ? 'bg-green-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="30秒ごとに更新"
                >
                  30s
                </button>
                <button
                  onClick={() => setAutoRefresh(60)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${autoRefresh === 60 ? 'bg-green-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  title="60秒ごとに更新"
                >
                  60s
                </button>
              </div>

              {/* エクスポート */}
              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="データをエクスポート"
                >
                  <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                {showExportDropdown && (
                  <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => exportData('json')}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => exportData('csv')}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                    >
                      CSV
                    </button>
                  </div>
                )}
              </div>

              {/* 手動更新 */}
              <button
                onClick={() => fetchStats()}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${loading ? 'animate-pulse' : ''}`}
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="総ユーザー数"
            value={stats.users.total}
            icon={<Users className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="アクティブユーザー"
            value={stats.users.active}
            subtitle={`${stats.users.total > 0 ? Math.round((stats.users.active / stats.users.total) * 100) : 0}%`}
            icon={<UserCheck className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            title="ゲストユーザー"
            value={stats.users.guests}
            icon={<UserX className="w-5 h-5" />}
            color="orange"
          />
          <StatCard
            title="総アイテム数"
            value={stats.items.total}
            subtitle={`平均 ${stats.items.avgPerUser}/人`}
            icon={<Package className="w-5 h-5" />}
            color="purple"
          />
        </div>

        {/* Insights Section */}
        {stats.insights && stats.insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              インサイト・アクションポイント
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {stats.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    insight.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
                      : insight.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'success'
                        ? 'bg-green-100 dark:bg-green-800/30'
                        : insight.type === 'warning'
                        ? 'bg-amber-100 dark:bg-amber-800/30'
                        : 'bg-blue-100 dark:bg-blue-800/30'
                    }`}>
                      {insight.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : insight.type === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${
                        insight.type === 'success'
                          ? 'text-green-800 dark:text-green-300'
                          : insight.type === 'warning'
                          ? 'text-amber-800 dark:text-amber-300'
                          : 'text-blue-800 dark:text-blue-300'
                      }`}>
                        {insight.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {insight.message}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/50 dark:bg-black/20 text-xs font-medium">
                        <span className="text-gray-500">{insight.metric.label}:</span>
                        <span className={`font-bold ${
                          insight.type === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : insight.type === 'warning'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {insight.metric.value}{insight.metric.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weekly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              週間アクティビティ
            </h2>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              weeklyChange >= 0
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {weeklyChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">今週</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activity.weekly.thisWeek}
                <span className="text-sm font-normal text-gray-500 ml-1">アイテム</span>
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">先週</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activity.weekly.lastWeek}
                <span className="text-sm font-normal text-gray-500 ml-1">アイテム</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Daily Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            過去30日間のアクティビティ
          </h2>
          <div className="flex items-end gap-1 h-40">
            {stats.activity.daily.map((day, index) => (
              <div
                key={day.date}
                className="flex-1 h-full flex flex-col items-center group"
              >
                <div className="relative w-full h-full flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((day.count / maxDailyCount) * 100, day.count > 0 ? 5 : 1)}%` }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
                    className="w-full bg-blue-500 dark:bg-blue-600 rounded-t"
                  />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {day.date}: {day.count}件
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{stats.activity.daily[0]?.date}</span>
            <span>{stats.activity.daily[stats.activity.daily.length - 1]?.date}</span>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            カテゴリ別アイテム数
          </h2>
          {stats.categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {stats.categoryBreakdown.map((category, index) => {
                const percentage = stats.items.total > 0
                  ? Math.round((category.count / stats.items.total) * 100)
                  : 0;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          {category.count}件 ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.4 + index * 0.05, duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              アイテムがありません
            </p>
          )}
        </motion.div>

        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ユーザー分布
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    className="text-gray-100 dark:text-gray-800"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeDasharray={`${((stats.users.registered / Math.max(stats.users.total, 1)) * 352)} 352`}
                    className="text-blue-500"
                    initial={{ strokeDasharray: '0 352' }}
                    animate={{
                      strokeDasharray: `${((stats.users.registered / Math.max(stats.users.total, 1)) * 352)} 352`
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.users.total > 0
                        ? Math.round((stats.users.registered / stats.users.total) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-500">登録済み</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  登録ユーザー: {stats.users.registered}人
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ゲストユーザー: {stats.users.guests}人
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Funnel Analysis */}
        {stats.funnel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-500" />
              ファネル分析
            </h2>
            <div className="space-y-3">
              {stats.funnel.stages.slice(1).map((stage, index) => (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{stage.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {stage.from} → {stage.to}
                      </span>
                      <span className={`text-sm font-bold ${
                        stage.rate >= 50 ? 'text-green-600' : stage.rate >= 25 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {stage.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.rate}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full ${
                        stage.rate >= 50 ? 'bg-green-500' : stage.rate >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Engagement Analysis */}
        {stats.engagement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              エンゲージメント分析
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Item Distribution */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  アイテム数の分布
                </h3>
                <div className="space-y-2">
                  {[
                    { label: '0件', value: stats.engagement.distribution.zero, color: 'bg-gray-400' },
                    { label: '1件', value: stats.engagement.distribution.one, color: 'bg-blue-400' },
                    { label: '2-5件', value: stats.engagement.distribution.twoToFive, color: 'bg-green-400' },
                    { label: '6-10件', value: stats.engagement.distribution.sixToTen, color: 'bg-purple-400' },
                    { label: '11件以上', value: stats.engagement.distribution.elevenPlus, color: 'bg-orange-400' },
                  ].map((item) => {
                    const total = Object.values(stats.engagement.distribution).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                    return (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-16">{item.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-12 text-right">{item.value}人</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Power Users */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  パワーユーザー（上位10%）
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.engagement.powerUsers.count}
                    </p>
                    <p className="text-xs text-gray-500">人</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.engagement.powerUsers.percentOfTotalItems}%
                    </p>
                    <p className="text-xs text-gray-500">全アイテムの割合</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.engagement.powerUsers.avgItemsPerPowerUser}
                    </p>
                    <p className="text-xs text-gray-500">平均アイテム数</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.engagement.averageItemsPerActiveUser}
                    </p>
                    <p className="text-xs text-gray-500">アクティブ平均</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pareto Analysis & Top Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Pareto Chart */}
              {stats.engagement.paretoData && stats.engagement.paretoData.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-indigo-500" />
                    パレート分析（累積分布）
                  </h3>
                  <div className="relative h-40">
                    {/* Background grid */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[100, 75, 50, 25, 0].map((v) => (
                        <div key={v} className="border-b border-gray-200 dark:border-gray-700 h-0">
                          <span className="text-[10px] text-gray-400 -mt-2 block">{v}%</span>
                        </div>
                      ))}
                    </div>
                    {/* Equal distribution line (diagonal) */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <line x1="0" y1="100" x2="100" y2="0" stroke="#ddd" strokeWidth="1" strokeDasharray="4,4" />
                      {/* Pareto curve */}
                      <polyline
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                        points={`0,100 ${stats.engagement.paretoData.map(p => `${p.userPercent},${100 - p.itemPercent}`).join(' ')}`}
                      />
                      {/* Data points */}
                      {stats.engagement.paretoData.map((p, i) => (
                        <circle
                          key={i}
                          cx={p.userPercent}
                          cy={100 - p.itemPercent}
                          r="2"
                          fill="#6366f1"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                    <span>0% ユーザー</span>
                    <span>100%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    曲線が対角線から離れるほど集中度が高い
                  </p>
                </div>
              )}

              {/* Top Users List */}
              {stats.engagement.topUsers && stats.engagement.topUsers.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    トップユーザー
                  </h3>
                  <div className="space-y-2">
                    {stats.engagement.topUsers.map((user) => (
                      <div
                        key={user.rank}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-gray-900/50"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank === 1
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                            : user.rank === 2
                            ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            : user.rank === 3
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400'
                            : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {user.rank}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              User #{user.rank}
                            </span>
                            {user.isGuest && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded">
                                ゲスト
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.itemCount}件（全体の{user.percentOfTotal}%）
                          </div>
                        </div>
                        <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${Math.min(user.percentOfTotal * 2, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Retention & Growth */}
        {stats.retention && stats.growth && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Retention */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Repeat className="w-5 h-5 text-green-500" />
                リテンション
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">新規ユーザー（過去7日）</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.retention.newUsersLast7Days}人
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">週1リテンション率</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats.retention.week1Retention.rate}%
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      ({stats.retention.week1Retention.retained}/{stats.retention.week1Retention.cohortSize}人)
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                成長トレンド
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">ユーザー成長</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stats.growth.users.thisWeek} / {stats.growth.users.lastWeek}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    stats.growth.users.growthRate >= 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {stats.growth.users.growthRate >= 0 ? '+' : ''}{stats.growth.users.growthRate}%
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">アイテム成長</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stats.growth.items.thisWeek} / {stats.growth.items.lastWeek}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    stats.growth.items.growthRate >= 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {stats.growth.items.growthRate >= 0 ? '+' : ''}{stats.growth.items.growthRate}%
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Content Stats - Tags & Locations */}
        {stats.contentStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-cyan-500" />
              コンテンツ統計
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tags */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-500" />
                  人気タグ TOP 10
                </h3>
                {stats.contentStats.tags.popularTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stats.contentStats.tags.popularTags.map((tag, index) => (
                      <span
                        key={tag.tag}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          index === 0
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : index < 3
                            ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {tag.tag} ({tag.count})
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mb-4">タグなし</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">ユニークタグ数</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.contentStats.tags.totalUniqueTags}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">タグ使用率</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.contentStats.tags.tagUsageRate}%</p>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  場所分布 TOP 10
                </h3>
                {stats.contentStats.locations.popularLocations.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {stats.contentStats.locations.popularLocations.slice(0, 5).map((loc) => (
                      <div key={loc.location} className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">{loc.location}</span>
                        <div className="w-20 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-400 rounded-full"
                            style={{ width: `${loc.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{loc.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mb-4">場所データなし</p>
                )}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">ユニークな場所</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.contentStats.locations.uniqueLocations}</p>
                </div>
              </div>
            </div>

            {/* Icon Styles & Colors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Icon Styles */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-500" />
                  アイコンスタイル
                </h3>
                <div className="space-y-2">
                  {stats.contentStats.iconStyles.map((style) => (
                    <div key={style.style} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{style.style}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/50 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${style.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right">{style.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-orange-500" />
                  人気カラー
                </h3>
                {stats.contentStats.colors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {stats.contentStats.colors.map((c) => (
                      <div
                        key={c.color}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/50 dark:bg-gray-800/50"
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{c.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">カラーデータなし</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Item Lifecycle */}
        {stats.itemLifecycle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-500" />
              アイテムライフサイクル
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Collection Status */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  回収状況
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                      <motion.circle
                        cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="8"
                        strokeDasharray={`${stats.itemLifecycle.collection.rate * 1.76} 176`}
                        className="text-green-500"
                        initial={{ strokeDasharray: '0 176' }}
                        animate={{ strokeDasharray: `${stats.itemLifecycle.collection.rate * 1.76} 176` }}
                        transition={{ duration: 1, delay: 1.1 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.itemLifecycle.collection.rate}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">回収済み: <span className="font-semibold">{stats.itemLifecycle.collection.collected}</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">未回収: <span className="font-semibold">{stats.itemLifecycle.collection.uncollected}</span></p>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-500" />
                  更新状況
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
                      <motion.circle
                        cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="8"
                        strokeDasharray={`${stats.itemLifecycle.updates.rate * 1.76} 176`}
                        className="text-blue-500"
                        initial={{ strokeDasharray: '0 176' }}
                        animate={{ strokeDasharray: `${stats.itemLifecycle.updates.rate * 1.76} 176` }}
                        transition={{ duration: 1, delay: 1.1 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{stats.itemLifecycle.updates.rate}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">更新あり: <span className="font-semibold">{stats.itemLifecycle.updates.updated}</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">未更新: <span className="font-semibold">{stats.itemLifecycle.updates.unchanged}</span></p>
                  </div>
                </div>
              </div>

              {/* Age Stats */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  アイテム鮮度
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">平均経過日数</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stats.itemLifecycle.age.avgDays}日</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">7日以内の新規</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{stats.itemLifecycle.age.recentItemsRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">30日以上放置</span>
                    <span className={`font-semibold ${stats.itemLifecycle.age.staleItemsRate >= 50 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {stats.itemLifecycle.age.staleItemsRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Hours */}
        {stats.activeHours && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500" />
              アクティブ時間帯
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hourly Chart */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">時間帯別アクティビティ</h3>
                <div className="flex items-end gap-0.5 h-24">
                  {stats.activeHours.hourly.map((h) => {
                    const maxCount = Math.max(...stats.activeHours.hourly.map(x => x.count), 1);
                    const isPeak = stats.activeHours.peakHours.includes(h.hour);
                    // Calculate height percentage with minimum visibility
                    const heightPercent = h.count > 0
                      ? Math.max((h.count / maxCount) * 100, 5) // Minimum 5% for visibility
                      : 2; // 2% for zero counts
                    return (
                      <div key={h.hour} className="flex-1 flex flex-col items-center group relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ delay: 1.1 + h.hour * 0.02, duration: 0.3 }}
                          className={`w-full rounded-t ${
                            isPeak ? 'bg-violet-500' : 'bg-violet-300 dark:bg-violet-700'
                          }`}
                        />
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-1 py-0.5 rounded whitespace-nowrap z-10">
                          {h.hour}時: {h.count}件
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                  <span>0時</span>
                  <span>12時</span>
                  <span>24時</span>
                </div>
                {stats.activeHours.peakHours.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    ピーク: {stats.activeHours.peakHours.map(h => `${h}時`).join(', ')}
                  </p>
                )}
              </div>

              {/* Time of Day & Day of Week */}
              <div className="space-y-4">
                {/* Time of Day */}
                <div className="bg-gradient-to-r from-orange-50 via-blue-50 to-indigo-50 dark:from-orange-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">時間帯カテゴリ</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: 'morning', label: '朝', icon: <Sunrise className="w-4 h-4" />, color: 'text-orange-500' },
                      { key: 'afternoon', label: '昼', icon: <Sun className="w-4 h-4" />, color: 'text-yellow-500' },
                      { key: 'evening', label: '夜', icon: <Sunset className="w-4 h-4" />, color: 'text-indigo-500' },
                      { key: 'night', label: '深夜', icon: <Moon className="w-4 h-4" />, color: 'text-purple-500' },
                    ].map((period) => {
                      const count = stats.activeHours.timeOfDay[period.key as keyof typeof stats.activeHours.timeOfDay];
                      const total = Object.values(stats.activeHours.timeOfDay).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={period.key} className="text-center">
                          <div className={`${period.color} flex justify-center mb-1`}>{period.icon}</div>
                          <p className="text-xs text-gray-500">{period.label}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{percentage}%</p>
                          <p className="text-[10px] text-gray-400">{count}件</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Day of Week */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">曜日別</h3>
                  <div className="flex items-end gap-1">
                    {stats.activeHours.daily.map((d) => {
                      const maxCount = Math.max(...stats.activeHours.daily.map(x => x.count), 1);
                      return (
                        <div key={d.day} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-teal-400 dark:bg-teal-600 rounded-t"
                            style={{ height: `${Math.max((d.count / maxCount) * 40, d.count > 0 ? 4 : 2)}px` }}
                          />
                          <span className="text-[10px] text-gray-500 mt-1">{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Storage Stats */}
        {stats.storage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-slate-500" />
              ストレージ統計
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30 rounded-xl p-4 text-center">
                <HardDrive className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.storage.totalSizeMB}</p>
                <p className="text-xs text-gray-500">総容量 (MB)</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 text-center">
                <Package className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.storage.avgSizePerItemKB}</p>
                <p className="text-xs text-gray-500">平均 (KB/アイテム)</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.storage.itemsWithImages}</p>
                <p className="text-xs text-gray-500">画像ありアイテム</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 text-center">
                <PieChart className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.storage.imageUsageRate}%</p>
                <p className="text-xs text-gray-500">画像使用率</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* コホート分析 */}
        {stats.cohortAnalysis && stats.cohortAnalysis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              コホート分析（登録週別リテンション）
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">登録週</th>
                    <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">ユーザー数</th>
                    <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">アクティブ</th>
                    <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">活性化率</th>
                    <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">定着率</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.cohortAnalysis.map((cohort, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <td className="py-2 px-3 text-gray-900 dark:text-white font-medium">{cohort.weekLabel}</td>
                      <td className="py-2 px-3 text-right text-gray-600 dark:text-gray-400">{cohort.totalUsers}</td>
                      <td className="py-2 px-3 text-right text-gray-600 dark:text-gray-400">{cohort.activeUsers}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          cohort.activationRate >= 70 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          cohort.activationRate >= 40 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {cohort.activationRate}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          cohort.engagementRate >= 50 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          cohort.engagementRate >= 25 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {cohort.engagementRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              活性化率: 1件以上登録したユーザー / 定着率: 3件以上登録したユーザー
            </p>
          </motion.div>
        )}

        {/* 時間×曜日ヒートマップ */}
        {stats.heatmapData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-emerald-500" />
              アクティビティヒートマップ（曜日×時間）
            </h2>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex">
                  <div className="w-10" />
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] text-gray-400">
                      {i}
                    </div>
                  ))}
                </div>
                {['日', '月', '火', '水', '木', '金', '土'].map((day, dayIndex) => {
                  const maxCount = Math.max(...stats.heatmapData.flat(), 1);
                  return (
                    <div key={day} className="flex items-center">
                      <div className="w-10 text-xs text-gray-500 dark:text-gray-400 text-right pr-2">{day}</div>
                      {stats.heatmapData[dayIndex].map((count, hourIndex) => {
                        const intensity = count / maxCount;
                        return (
                          <div
                            key={hourIndex}
                            className="flex-1 aspect-square m-0.5 rounded-sm group relative"
                            style={{
                              backgroundColor: count === 0
                                ? 'rgba(156, 163, 175, 0.1)'
                                : `rgba(16, 185, 129, ${0.2 + intensity * 0.8})`
                            }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10 pointer-events-none">
                              {day} {hourIndex}時: {count}件
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-xs text-gray-500">少</span>
              <div className="flex gap-0.5">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity) => (
                  <div
                    key={opacity}
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: `rgba(16, 185, 129, ${opacity})` }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">多</span>
            </div>
          </motion.div>
        )}

        {/* 月次トレンド */}
        {stats.monthlyTrends && stats.monthlyTrends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-cyan-500" />
              月次トレンド（過去6ヶ月）
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {stats.monthlyTrends.map((trend, index) => (
                <div key={trend.month} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{trend.month}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">アイテム</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{trend.items}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">新規ユーザー</span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{trend.users}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 最近のアクティビティフィード */}
        {stats.recentActivity && stats.recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-500" />
              最近のアクティビティ
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + index * 0.03 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: activity.category ? `${activity.category.color}20` : '#f3f4f6' }}
                  >
                    {activity.category?.icon || '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.category?.name || '不明なカテゴリ'}
                      </span>
                      {activity.hasImage && (
                        <Image className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      {activity.tagsCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded">
                          {activity.tagsCount}タグ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {activity.location || '場所未設定'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* システムステータス */}
        {stats.systemStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-gray-500" />
              システムステータス
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">最終更新</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(stats.systemStatus.lastUpdated).toLocaleString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">レスポンス時間</p>
                <p className={`text-sm font-medium ${
                  stats.systemStatus.responseTimeMs < 500 ? 'text-green-600 dark:text-green-400' :
                  stats.systemStatus.responseTimeMs < 1000 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {stats.systemStatus.responseTimeMs}ms
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">総レコード数</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {(stats.systemStatus.totalRecords.users + stats.systemStatus.totalRecords.items).toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">自動更新</p>
                <p className={`text-sm font-medium ${autoRefresh > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  {autoRefresh > 0 ? `${autoRefresh}秒` : '無効'}
                </p>
              </div>
            </div>
            {stats.periodStats && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    表示期間: {periodLabels[period as PeriodFilter]}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    期間内: ユーザー <span className="font-semibold">{stats.periodStats.usersInPeriod}</span>人 /
                    アイテム <span className="font-semibold">{stats.periodStats.itemsInPeriod}</span>件
                    （平均 <span className="font-semibold">{stats.periodStats.avgItemsPerDay}</span>件/日）
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

function StatCard({ title, value, subtitle, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    green: 'bg-green-500 text-green-500 bg-green-50 dark:bg-green-900/20',
    orange: 'bg-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    purple: 'bg-purple-500 text-purple-500 bg-purple-50 dark:bg-purple-900/20',
  };

  const iconBgClass = colorClasses[color].split(' ').slice(2).join(' ');
  const iconTextClass = colorClasses[color].split(' ')[1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <span className={iconTextClass}>{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
}
