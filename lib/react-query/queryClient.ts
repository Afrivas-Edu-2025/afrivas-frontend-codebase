// lib/react-query/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { get, set, del } from 'idb-keyval';
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

const CACHE_KEY = 'afrivas-react-query-cache';

/**
 * IndexedDB-based persister for TanStack Query
 * Uses idb-keyval for simple key-value storage
 */
export function createIDBPersister(): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await set(CACHE_KEY, client);
      } catch (error) {
        console.error('Failed to persist query client to IndexedDB:', error);
      }
    },
    restoreClient: async () => {
      try {
        return await get<PersistedClient>(CACHE_KEY);
      } catch (error) {
        console.error('Failed to restore query client from IndexedDB:', error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await del(CACHE_KEY);
      } catch (error) {
        console.error('Failed to remove query client from IndexedDB:', error);
      }
    },
  };
}

/**
 * Creates a QueryClient with defaults optimized for slow/unreliable networks
 * 
 * Key settings:
 * - staleTime: 5 minutes - data is considered fresh for 5 mins (reduces refetches)
 * - gcTime: 24 hours - keeps cached data for 24 hours (survives offline periods)
 * - retry: 3 times with exponential backoff
 * - refetchOnWindowFocus: false - prevents unnecessary refetches on slow networks
 * - networkMode: 'offlineFirst' - uses cache when offline, fetches when online
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        // This reduces unnecessary refetches on slow networks
        staleTime: 5 * 60 * 1000, // 5 minutes
        
        // Keep cached data for 24 hours
        // This is crucial for offline support and slow networks
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        
        // Retry failed requests 3 times with exponential backoff
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Don't refetch when window regains focus (saves bandwidth)
        refetchOnWindowFocus: false,
        
        // Don't refetch when component remounts with existing data
        refetchOnMount: false,
        
        // Refetch when reconnecting to network
        refetchOnReconnect: true,
        
        // Use cache first, then fetch in background when online
        // This ensures immediate response from cache on slow networks
        networkMode: 'offlineFirst',
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
        
        // Keep mutations paused when offline, resume when online
        networkMode: 'offlineFirst',
      },
    },
  });
}

// Singleton instances
let queryClient: QueryClient | null = null;
let persister: Persister | null = null;

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}

export function getPersister(): Persister {
  if (!persister) {
    persister = createIDBPersister();
  }
  return persister;
}

// Maximum age for persisted cache (24 hours)
// Data older than this will be discarded on restore
export const PERSIST_MAX_AGE = 24 * 60 * 60 * 1000;
