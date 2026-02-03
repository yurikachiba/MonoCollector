'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  NotificationSettings,
  getNotificationSettings,
  saveNotificationSettings,
  defaultNotificationSettings,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  showNotification,
  createBadgeNotification,
  createLevelUpNotification,
  createAchievementNotification,
} from '@/lib/notifications';
import { CollectionBadge, Achievement, LevelInfo } from '@/lib/collection-system';

// バッジ獲得ポップアップ用の型
export interface BadgePopupData {
  type: 'badge' | 'achievement' | 'levelup';
  badge?: CollectionBadge;
  achievement?: Achievement;
  levelInfo?: LevelInfo;
}

interface NotificationContextType {
  // 設定
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => void;

  // 権限
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermission>;

  // バッジ獲得ポップアップ
  badgePopupData: BadgePopupData | null;
  showBadgePopup: (data: BadgePopupData) => void;
  closeBadgePopup: () => void;

  // 通知トリガー
  notifyBadgeUnlocked: (badge: CollectionBadge) => void;
  notifyAchievementUnlocked: (achievement: Achievement) => void;
  notifyLevelUp: (levelInfo: LevelInfo) => void;

  // 前回の状態保存（新しいバッジ/実績の検出用）
  previousBadges: string[];
  previousAchievements: string[];
  previousLevel: number;
  setPreviousState: (badges: string[], achievements: string[], level: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const PREVIOUS_STATE_KEY = 'monocollector_previous_gamification_state';

interface PreviousState {
  badges: string[];
  achievements: string[];
  level: number;
}

function loadPreviousState(): PreviousState {
  if (typeof window === 'undefined') {
    return { badges: [], achievements: [], level: 1 };
  }

  try {
    const stored = localStorage.getItem(PREVIOUS_STATE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load previous state:', error);
  }

  return { badges: [], achievements: [], level: 1 };
}

function savePreviousState(state: PreviousState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PREVIOUS_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save previous state:', error);
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Lazy initialization - 初期レンダリング時に一度だけ実行
  const [settings, setSettings] = useState<NotificationSettings>(() => getNotificationSettings());
  const [permission, setPermission] = useState<NotificationPermission>(() => getNotificationPermission());
  const [isSupported] = useState(() => isNotificationSupported());
  const [badgePopupData, setBadgePopupData] = useState<BadgePopupData | null>(null);

  const [previousBadges, setPreviousBadges] = useState<string[]>(() => loadPreviousState().badges);
  const [previousAchievements, setPreviousAchievements] = useState<string[]>(() => loadPreviousState().achievements);
  const [previousLevel, setPreviousLevel] = useState(() => loadPreviousState().level);

  // 設定の更新
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveNotificationSettings(updated);
      return updated;
    });
  }, []);

  // 権限のリクエスト
  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  }, []);

  // バッジポップアップ
  const showBadgePopup = useCallback((data: BadgePopupData) => {
    setBadgePopupData(data);
  }, []);

  const closeBadgePopup = useCallback(() => {
    setBadgePopupData(null);
  }, []);

  // バッジ獲得通知
  const notifyBadgeUnlocked = useCallback((badge: CollectionBadge) => {
    // ポップアップを表示
    showBadgePopup({ type: 'badge', badge });

    // プッシュ通知
    if (settings.enabled && settings.achievementAlert) {
      const notification = createBadgeNotification(badge.name, badge.icon);
      showNotification(notification);
    }
  }, [settings, showBadgePopup]);

  // 実績解除通知
  const notifyAchievementUnlocked = useCallback((achievement: Achievement) => {
    // ポップアップを表示
    showBadgePopup({ type: 'achievement', achievement });

    // プッシュ通知
    if (settings.enabled && settings.achievementAlert) {
      const notification = createAchievementNotification(achievement.name, achievement.icon);
      showNotification(notification);
    }
  }, [settings, showBadgePopup]);

  // レベルアップ通知
  const notifyLevelUp = useCallback((levelInfo: LevelInfo) => {
    // ポップアップを表示
    showBadgePopup({ type: 'levelup', levelInfo });

    // プッシュ通知
    if (settings.enabled && settings.achievementAlert) {
      const notification = createLevelUpNotification(levelInfo.level, levelInfo.title);
      showNotification(notification);
    }
  }, [settings, showBadgePopup]);

  // 前回の状態を保存
  const setPreviousState = useCallback((badges: string[], achievements: string[], level: number) => {
    setPreviousBadges(badges);
    setPreviousAchievements(achievements);
    setPreviousLevel(level);
    savePreviousState({ badges, achievements, level });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        settings,
        updateSettings,
        permission,
        isSupported,
        requestPermission,
        badgePopupData,
        showBadgePopup,
        closeBadgePopup,
        notifyBadgeUnlocked,
        notifyAchievementUnlocked,
        notifyLevelUp,
        previousBadges,
        previousAchievements,
        previousLevel,
        setPreviousState,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
