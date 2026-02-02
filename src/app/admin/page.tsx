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
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/stats');
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

  useEffect(() => {
    fetchStats();
  }, []);

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
            onClick={fetchStats}
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
            <button
              onClick={fetchStats}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
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
                className="flex-1 flex flex-col items-center group"
              >
                <div className="relative w-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / maxDailyCount) * 100}%` }}
                    transition={{ delay: index * 0.02, duration: 0.3 }}
                    className="w-full bg-blue-500 dark:bg-blue-600 rounded-t min-h-[2px]"
                    style={{
                      height: `${Math.max((day.count / maxDailyCount) * 128, day.count > 0 ? 8 : 2)}px`
                    }}
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
