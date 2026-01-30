import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/db';

export const statsKeys = {
  all: ['stats'] as const,
};

export function useStats() {
  return useQuery({
    queryKey: statsKeys.all,
    queryFn: getStats,
  });
}
