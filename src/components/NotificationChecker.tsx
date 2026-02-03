'use client';

import { useEffect, useRef } from 'react';
import { useItems } from '@/hooks/useItems';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  calculateCollectionStats,
  collectionBadges,
  allAchievements,
} from '@/lib/collection-system';
import {
  showNotification,
  createMemoryNotification,
  createStreakNotification,
  createWeeklySummaryNotification,
  createMotivationNotification,
  shouldShowStreakReminder,
  shouldShowMotivationReminder,
  getNotificationSettings,
} from '@/lib/notifications';
import { defaultCategories } from '@/lib/db';

// ストリークを計算するヘルパー関数
function calculateStreak(items: { createdAt: Date | string }[]): number {
  const today = new Date();
  let streak = 0;
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toDateString();

    const hasItem = sortedItems.some(
      (item) => new Date(item.createdAt).toDateString() === dateStr
    );

    if (hasItem) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

// 今日アイテムを追加したかチェック
function hasAddedToday(items: { createdAt: Date | string }[]): boolean {
  const today = new Date().toDateString();
  return items.some((item) => new Date(item.createdAt).toDateString() === today);
}

// 最後にアイテムを追加してからの日数
function daysSinceLastItem(items: { createdAt: Date | string }[]): number {
  if (items.length === 0) return 999;

  const sortedItems = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const lastDate = new Date(sortedItems[0].createdAt);
  const today = new Date();
  return Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
}

export default function NotificationChecker() {
  const { data: items = [] } = useItems();
  const {
    notifyBadgeUnlocked,
    notifyAchievementUnlocked,
    notifyLevelUp,
    previousBadges,
    previousAchievements,
    previousLevel,
    setPreviousState,
  } = useNotifications();

  const hasChecked = useRef(false);
  const lastItemCount = useRef(0);

  // ページロード時の通知チェック（ストリーク、モチベーション）
  useEffect(() => {
    if (hasChecked.current || items.length === 0) return;
    hasChecked.current = true;

    const settings = getNotificationSettings();
    if (!settings.enabled) return;

    const streak = calculateStreak(items);
    const addedToday = hasAddedToday(items);
    const daysSince = daysSinceLastItem(items);

    // ストリークリマインダー
    if (shouldShowStreakReminder(addedToday, streak)) {
      showNotification(createStreakNotification(streak));
    }

    // モチベーションリマインダー
    if (shouldShowMotivationReminder(daysSince)) {
      showNotification(createMotivationNotification());
    }

    // 週次サマリー（日曜日のみ）
    const today = new Date();
    if (today.getDay() === 0 && settings.weeklySummary) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weeklyItems = items.filter(
        (item) => new Date(item.createdAt) >= weekAgo
      );

      const lastWeeklyCheck = localStorage.getItem('monocollector_last_weekly_check');
      const thisWeek = `${today.getFullYear()}-${today.getMonth()}-${Math.floor(today.getDate() / 7)}`;

      if (lastWeeklyCheck !== thisWeek && weeklyItems.length > 0) {
        localStorage.setItem('monocollector_last_weekly_check', thisWeek);
        showNotification(createWeeklySummaryNotification(weeklyItems.length, streak));
      }
    }
  }, [items]);

  // バッジ・実績・レベルアップの検知
  useEffect(() => {
    if (items.length === 0) return;
    if (items.length === lastItemCount.current) return;

    lastItemCount.current = items.length;

    const streak = calculateStreak(items);
    const collectionStats = calculateCollectionStats(items, defaultCategories, streak);

    const currentBadgeIds = collectionStats.unlockedBadges.map((b) => b.id);
    const currentAchievementIds = collectionStats.unlockedAchievements.map((a) => a.id);
    const currentLevel = collectionStats.level.level;

    // 新しいバッジの検出
    const newBadgeIds = currentBadgeIds.filter((id) => !previousBadges.includes(id));
    if (newBadgeIds.length > 0) {
      const newBadge = collectionBadges.find((b) => b.id === newBadgeIds[0]);
      if (newBadge) {
        // バッジ獲得通知を遅延表示（アイテム保存後に表示）
        setTimeout(() => {
          notifyBadgeUnlocked(newBadge);
        }, 500);
      }
    }

    // 新しい実績の検出（バッジと同時に表示しない）
    if (newBadgeIds.length === 0) {
      const newAchievementIds = currentAchievementIds.filter(
        (id) => !previousAchievements.includes(id)
      );
      if (newAchievementIds.length > 0) {
        const newAchievement = allAchievements.find((a) => a.id === newAchievementIds[0]);
        if (newAchievement) {
          setTimeout(() => {
            notifyAchievementUnlocked(newAchievement);
          }, 500);
        }
      }
    }

    // レベルアップの検出（バッジ・実績と同時に表示しない）
    if (newBadgeIds.length === 0 && currentLevel > previousLevel && previousLevel > 0) {
      const newAchievementIds = currentAchievementIds.filter(
        (id) => !previousAchievements.includes(id)
      );
      if (newAchievementIds.length === 0) {
        setTimeout(() => {
          notifyLevelUp(collectionStats.level);
        }, 500);
      }
    }

    // 状態を保存
    setPreviousState(currentBadgeIds, currentAchievementIds, currentLevel);
  }, [
    items,
    previousBadges,
    previousAchievements,
    previousLevel,
    notifyBadgeUnlocked,
    notifyAchievementUnlocked,
    notifyLevelUp,
    setPreviousState,
  ]);

  // 思い出リマインダー（プッシュ通知版）
  useEffect(() => {
    if (items.length === 0) return;

    const settings = getNotificationSettings();
    if (!settings.enabled || !settings.memoryReminder) return;

    // 思い出チェック（1年前、1ヶ月前、1週間前）
    const checkMemoryDates = [
      { days: 365, period: '1年前' },
      { days: 30, period: '1ヶ月前' },
      { days: 7, period: '1週間前' },
    ];

    const today = new Date();
    const lastMemoryPushCheck = localStorage.getItem('monocollector_last_memory_push_check');

    if (lastMemoryPushCheck === today.toDateString()) return;

    for (const { days, period } of checkMemoryDates) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - days);
      const targetDateStr = targetDate.toDateString();

      const memoryItems = items.filter(
        (item) => new Date(item.createdAt).toDateString() === targetDateStr
      );

      if (memoryItems.length > 0) {
        localStorage.setItem('monocollector_last_memory_push_check', today.toDateString());
        showNotification(createMemoryNotification(memoryItems[0].name, period));
        break; // 1つだけ通知
      }
    }
  }, [items]);

  return null;
}
