'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, useSession } from 'next-auth/react';
import { useState, useEffect, ReactNode } from 'react';
import { NotificationProvider } from '@/contexts/NotificationContext';
import BadgePopup from '@/components/BadgePopup';
import ReviewPrompt from '@/components/ReviewPrompt';

interface ProvidersProps {
  children: ReactNode;
}

// ゲストIDをlocalStorageに保存するコンポーネント
function GuestSessionPersister({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.isGuest && session.user.id) {
      // ゲストユーザーのIDをlocalStorageに保存
      localStorage.setItem('guestUserId', session.user.id);
      console.log('[GuestPersist] Saved guest ID to localStorage:', session.user.id);
    }
  }, [session]);

  return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            gcTime: 1000 * 60 * 5,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <GuestSessionPersister>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            {children}
            <BadgePopup />
            <ReviewPrompt />
          </NotificationProvider>
        </QueryClientProvider>
      </GuestSessionPersister>
    </SessionProvider>
  );
}
