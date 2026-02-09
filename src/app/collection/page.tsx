'use client';

import { useState, useEffect, useRef } from 'react';
import { Item } from '@/lib/db';
import Header from '@/components/Header';
import CategoryBar from '@/components/CategoryBar';
import ItemGrid from '@/components/ItemGrid';
import FloatingActionButton from '@/components/FloatingActionButton';
import AddItemModal from '@/components/AddItemModal';
import SettingsModal from '@/components/SettingsModal';
import CollectionPanel from '@/components/CollectionPanel';
import GuestDataMigrationDialog from '@/components/GuestDataMigrationDialog';
import MemoryReminderPopup from '@/components/MemoryReminderPopup';
import GuestSignupPrompt from '@/components/GuestSignupPrompt';
import PushNotificationPrompt from '@/components/PushNotificationPrompt';
import NotificationChecker from '@/components/NotificationChecker';
import FirstItemCelebration from '@/components/FirstItemCelebration';
import MilestoneCelebration from '@/components/MilestoneCelebration';
import MemoriesSection from '@/components/MemoriesSection';
import OnboardingTutorial, {
  useOnboardingStore,
  useCurrentStep,
  OnboardingCelebration,
} from '@/components/OnboardingTutorial';
import { useItems } from '@/hooks/useItems';

// 新しいリテンション施策コンポーネント
import NextItemSuggestion from '@/components/NextItemSuggestion';
import StreakBanner from '@/components/StreakBanner';
import RoomProgress from '@/components/RoomProgress';
import WeeklyDigestBanner from '@/components/WeeklyDigestBanner';
import CollectionValueCard from '@/components/CollectionValueCard';

export default function CollectionPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const { isActive, nextStep, waitingForRegistration, showCompleteCelebration, hasCompleted, complete } = useOnboardingStore();
  const currentStep = useCurrentStep();

  // アイテム数を監視してオンボーディング完了を検知
  const { data: items = [], isFetched } = useItems();
  const prevItemCount = useRef(items.length);

  // 既にアイテムがある場合はオンボーディングを自動完了（既存ユーザー対応）
  useEffect(() => {
    if (isFetched && items.length > 0 && !hasCompleted) {
      complete();
    }
  }, [isFetched, items.length, hasCompleted, complete]);

  useEffect(() => {
    // 登録待ち状態でアイテムが追加された場合、お祝い画面を表示
    if (waitingForRegistration && items.length > prevItemCount.current) {
      showCompleteCelebration();
    }
    prevItemCount.current = items.length;
  }, [items.length, waitingForRegistration, showCompleteCelebration]);

  const handleEdit = (item: Item) => {
    setEditItem(item);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditItem(null);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // FABクリック時の処理（オンボーディング対応）
  const handleFabClick = () => {
    if (isActive && currentStep?.id === 'fab') {
      nextStep();
    }
    setIsAddModalOpen(true);
  };

  return (
    <main className="min-h-screen pb-24">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      <CollectionPanel />

      {/* コレクション価値カード（5件以上で表示） */}
      <CollectionValueCard />

      {/* ストリークバナー（毎日の習慣形成） */}
      <StreakBanner onAddItem={handleOpenAddModal} />

      {/* 週間ダイジェスト（週1回の振り返り） */}
      <WeeklyDigestBanner />

      {/* 次のアイテム提案（1〜4件の間で表示） */}
      <NextItemSuggestion onAddItem={handleOpenAddModal} />

      <div className="px-4">
        <MemoriesSection />
      </div>

      {/* おうちマップ（場所別進捗、3件以上で表示） */}
      <RoomProgress onAddItem={handleOpenAddModal} />

      <CategoryBar />
      <ItemGrid onEdit={handleEdit} />

      <FloatingActionButton onClick={handleFabClick} />

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        editItem={editItem}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <GuestDataMigrationDialog />
      <MemoryReminderPopup />
      <GuestSignupPrompt />
      <PushNotificationPrompt />
      <NotificationChecker />
      {/* オンボーディング完了後のみFirstItemCelebrationを表示 */}
      {hasCompleted && <FirstItemCelebration onAddAnother={handleOpenAddModal} />}
      <MilestoneCelebration onAddAnother={handleOpenAddModal} />
      <OnboardingTutorial />
      <OnboardingCelebration />
    </main>
  );
}
