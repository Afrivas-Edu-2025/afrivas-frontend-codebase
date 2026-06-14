'use client';

// app/_components/BootstrapQueries.tsx
import { useEffect } from 'react';
import { useQuery, useQueryClient, onlineManager } from '@tanstack/react-query';
import { fetchCurrentUser, fetchAppConfig, fetchDashboardSummary } from '@/lib/api/client';

// Query keys for type-safe cache access
export const queryKeys = {
  currentUser: ['currentUser'] as const,
  appConfig: ['appConfig'] as const,
  dashboardSummary: ['dashboardSummary'] as const,
} as const;

/**
 * BootstrapQueries Component
 * 
 * Mounts near the root and kicks off critical queries to populate the cache.
 * These queries are configured for slow networks:
 * - Long staleTime to reduce refetches
 * - Uses cache when offline
 * - Retries with exponential backoff
 * 
 * Mount this component in your root layout to ensure data is prefetched early.
 */
export default function BootstrapQueries() {
  const queryClient = useQueryClient();

  // Fetch current user - critical for auth-dependent UI
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: fetchCurrentUser,
    // Keep user data fresh for 10 minutes
    staleTime: 10 * 60 * 1000,
    // Don't retry auth failures
    retry: (failureCount, error) => {
      if (error && 'status' in error && error.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    // Only fetch when online
    enabled: onlineManager.isOnline(),
    // Use cache first for fast initial render
    networkMode: 'offlineFirst',
  });

  // Fetch app configuration - needed for feature flags
  useQuery({
    queryKey: queryKeys.appConfig,
    queryFn: fetchAppConfig,
    // Config rarely changes, keep fresh for 30 minutes
    staleTime: 30 * 60 * 1000,
    // Always try to fetch config (even if user is not logged in)
    networkMode: 'offlineFirst',
  });

  // Fetch dashboard summary - only if user is logged in
  useQuery({
    queryKey: queryKeys.dashboardSummary,
    queryFn: fetchDashboardSummary,
    // Dashboard data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Only fetch if user is logged in
    enabled: !!currentUser && onlineManager.isOnline(),
    networkMode: 'offlineFirst',
  });

  // When coming back online, refresh critical data
  useEffect(() => {
    const handleOnline = () => {
      // Invalidate critical queries to trigger background refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      queryClient.invalidateQueries({ queryKey: queryKeys.appConfig });
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [queryClient, currentUser]);

  // This component renders nothing - it's purely for side effects
  return null;
}

/**
 * Helper function to prefetch bootstrap queries
 * Can be used for manual prefetching (e.g., before navigation)
 */
export async function prefetchBootstrapQueries(queryClient: ReturnType<typeof useQueryClient>) {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.currentUser,
      queryFn: fetchCurrentUser,
      staleTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.appConfig,
      queryFn: fetchAppConfig,
      staleTime: 30 * 60 * 1000,
    }),
  ]);
}
