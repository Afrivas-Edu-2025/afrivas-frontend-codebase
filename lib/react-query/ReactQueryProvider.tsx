'use client';

// lib/react-query/ReactQueryProvider.tsx
import { ReactNode, useState, useEffect } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { onlineManager } from '@tanstack/react-query';
import { getQueryClient, getPersister, PERSIST_MAX_AGE } from './queryClient';

interface ReactQueryProviderProps {
  children: ReactNode;
}

/**
 * ReactQueryProvider with IndexedDB persistence
 * 
 * Features:
 * - Restores cached data from IndexedDB on app load
 * - Shows loading skeleton while restoring
 * - Syncs with browser online/offline events
 * - Includes devtools in development mode
 */
export default function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const queryClient = getQueryClient();
  const persister = getPersister();

  // Set up online/offline event listeners
  useEffect(() => {
    // Initialize with current online state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      onlineManager.setOnline(true);
      
      // Invalidate all queries to trigger refetch when back online
      queryClient.invalidateQueries();
    };

    const handleOffline = () => {
      setIsOnline(false);
      onlineManager.setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sync TanStack Query's online manager with browser state
    onlineManager.setOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: PERSIST_MAX_AGE,
        // Burst mode helps with slow networks by saving less frequently
        buster: 'v1',
      }}
      onSuccess={() => {
        // Called when the persisted cache has been restored
        // You can add analytics or logging here
        console.log('[ReactQuery] Cache restored from IndexedDB');
      }}
    >
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </PersistQueryClientProvider>
  );
}

/**
 * Hook to check if the app is currently restoring from cache
 * Use this to show loading states during initial restore
 */
export { useIsRestoring } from '@tanstack/react-query';
