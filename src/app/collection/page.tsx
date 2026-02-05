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

export default function CollectionPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const { isActive, nextStep, waitingForRegistration, showCompleteCelebration, hasCompleted } = useOnboardingStore();
  const currentStep = useCurrentStep();

  // アイテム数を監視してオンボーディング完了を検知
  const { data: items = [] } = useItems();
  const prevItemCount = useRef(items.length);

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
      <div className="px-4">
        <MemoriesSection />
      </div>
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
      {hasCompleted && <FirstItemCelebration onAddAnother={() => setIsAddModalOpen(true)} />}
      <MilestoneCelebration onAddAnother={() => setIsAddModalOpen(true)} />
      <OnboardingTutorial />
      <OnboardingCelebration />
    </main>
  );
}
