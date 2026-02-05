'use client';

import { useState } from 'react';
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
} from '@/components/OnboardingTutorial';

export default function CollectionPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  const { isActive, nextStep } = useOnboardingStore();
  const currentStep = useCurrentStep();

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
      <FirstItemCelebration onAddAnother={() => setIsAddModalOpen(true)} />
      <MilestoneCelebration onAddAnother={() => setIsAddModalOpen(true)} />
      <OnboardingTutorial />
    </main>
  );
}
