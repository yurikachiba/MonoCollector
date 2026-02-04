import { useQuery } from '@tanstack/react-query';

interface MemoryItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  generatedIcon: string | null;
  createdAt: string;
}

interface Memory {
  period: string;
  days: number;
  items: MemoryItem[];
}

interface MemoriesData {
  memories: Memory[];
  hasRecentActivity: boolean;
  totalItems: number;
}

async function fetchMemories(): Promise<MemoriesData> {
  const response = await fetch('/api/items/memories');
  if (!response.ok) {
    throw new Error('Failed to fetch memories');
  }
  return response.json();
}

export const memoriesKeys = {
  all: ['memories'] as const,
  list: () => [...memoriesKeys.all, 'list'] as const,
};

export function useMemories(enabled = true) {
  return useQuery({
    queryKey: memoriesKeys.list(),
    queryFn: fetchMemories,
    enabled,
    staleTime: 5 * 60 * 1000, // 5分間はstaleにならない
  });
}

export type { MemoriesData, Memory, MemoryItem };
