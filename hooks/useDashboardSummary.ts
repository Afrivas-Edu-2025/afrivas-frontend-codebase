'use client';

// hooks/useDashboardSummary.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDashboardSummary, type DashboardSummary } from '@/lib/api/client';
import { queryKeys } from '@/app/_components/BootstrapQueries';
import { useCurrentUser } from './useCurrentUser';

/**
 * useDashboardSummary Hook
 * 
 * Fetches and caches dashboard summary data.
 * Optimized for slow networks:
 * - Only fetches when user is authenticated
 * - Uses cached data for immediate render
 * - Background refetch when stale
 * 
 * @returns Query result with dashboard summary and helper properties
 */
export function useDashboardSummary() {
  const { data: user } = useCurrentUser();

  const query = useQuery({
    queryKey: queryKeys.dashboardSummary,
    queryFn: fetchDashboardSummary,
    // Dashboard data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep in cache for 24 hours
    gcTime: 24 * 60 * 60 * 1000,
    // Only fetch if user is logged in
    enabled: !!user,
    // Use cache first
    networkMode: 'offlineFirst',
    // Retry up to 3 times with backoff
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...query,
    // Helper property to check if showing stale data
    isStale: query.isStale && !query.isFetching,
    // Helper property for empty state
    isEmpty: !query.data || (
      query.data.enrolledCourses === 0 &&
      query.data.completedCourses === 0
    ),
  };
}

/**
 * Hook to prefetch dashboard data
 * Use before navigation to dashboard for instant loading
 */
export function usePrefetchDashboard() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();

  return {
    prefetch: async () => {
      if (!user) return;

      await queryClient.prefetchQuery({
        queryKey: queryKeys.dashboardSummary,
        queryFn: fetchDashboardSummary,
        staleTime: 5 * 60 * 1000,
      });
    },
  };
}

/**
 * Hook to manually refresh dashboard data
 * Use for pull-to-refresh or manual refresh buttons
 */
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });
    },
    // Force immediate refetch (ignores staleTime)
    forceRefresh: () => {
      queryClient.refetchQueries({
        queryKey: queryKeys.dashboardSummary,
        type: 'active',
      });
    },
  };
}

/**
 * Selector hook for specific dashboard metrics
 * Reduces re-renders by only subscribing to specific data
 */
export function useDashboardMetric<T extends keyof DashboardSummary>(
  metric: T
): DashboardSummary[T] | undefined {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<DashboardSummary>(queryKeys.dashboardSummary);
  return data?.[metric];
}
