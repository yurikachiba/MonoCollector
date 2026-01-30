'use client';

import { useEffect, useState } from 'react';
import { Item } from '@/lib/db';
import { useStore } from '@/lib/store';
import Header from '@/components/Header';
import CategoryBar from '@/components/CategoryBar';
import StatsPanel from '@/components/StatsPanel';
import ItemGrid from '@/components/ItemGrid';
import FloatingActionButton from '@/components/FloatingActionButton';
import AddItemModal from '@/components/AddItemModal';
import ShareModal from '@/components/ShareModal';

export default function Home() {
  const { loadData, categories } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [shareItem, setShareItem] = useState<Item | null>(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = (item: Item) => {
    setEditItem(item);
    setIsAddModalOpen(true);
  };

  const handleShare = (item: Item) => {
    setShareItem(item);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditItem(null);
  };

  return (
    <main className="min-h-screen pb-24">
      <Header />
      <StatsPanel />
      <CategoryBar />
      <ItemGrid onEdit={handleEdit} onShare={handleShare} />

      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        editItem={editItem}
      />

      <ShareModal
        isOpen={!!shareItem}
        onClose={() => setShareItem(null)}
        item={shareItem}
        category={categories.find((c) => c.id === shareItem?.category)}
      />
    </main>
  );
}
