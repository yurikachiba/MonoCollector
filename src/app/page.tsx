'use client';

import { useEffect, useState } from 'react';
import { Item } from '@/lib/db';
import { useStore } from '@/lib/store';
import Header from '@/components/Header';
import CategoryBar from '@/components/CategoryBar';
import ItemGrid from '@/components/ItemGrid';
import FloatingActionButton from '@/components/FloatingActionButton';
import AddItemModal from '@/components/AddItemModal';

export default function Home() {
  const { loadData } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = (item: Item) => {
    setEditItem(item);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setEditItem(null);
  };

  return (
    <main className="min-h-screen pb-24">
      <Header />
      <CategoryBar />
      <ItemGrid onEdit={handleEdit} />

      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        editItem={editItem}
      />
    </main>
  );
}
