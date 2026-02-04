import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemKeys } from './useItems';

interface GuestInfo {
  exists: boolean;
  guestName?: string;
  itemCount?: number;
  createdAt?: string;
}

interface MigrationResult {
  message: string;
  migratedItems: number;
}

async function fetchGuestInfo(guestId: string): Promise<GuestInfo> {
  const response = await fetch(`/api/auth/link-guest?guestId=${encodeURIComponent(guestId)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch guest info');
  }
  return response.json();
}

async function migrateGuestData(guestId: string): Promise<MigrationResult> {
  const response = await fetch('/api/auth/link-guest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guestId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to migrate guest data');
  }

  return data;
}

export const guestMigrationKeys = {
  all: ['guestMigration'] as const,
  info: (guestId: string) => [...guestMigrationKeys.all, 'info', guestId] as const,
};

export function useGuestInfo(guestId: string | null, enabled = true) {
  return useQuery({
    queryKey: guestMigrationKeys.info(guestId || ''),
    queryFn: () => fetchGuestInfo(guestId!),
    enabled: enabled && !!guestId,
  });
}

export function useGuestMigration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: migrateGuestData,
    onSuccess: () => {
      // アイテム関連のクエリを無効化してリフレッシュ
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: guestMigrationKeys.all });
    },
  });
}

export type { GuestInfo, MigrationResult };
