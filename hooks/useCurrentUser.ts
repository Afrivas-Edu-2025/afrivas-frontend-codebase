'use client';

// hooks/useCurrentUser.ts
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchCurrentUser, type User } from '@/lib/api/client';
import { queryKeys } from '@/app/_components/BootstrapQueries';

/**
 * useCurrentUser Hook
 * 
 * Fetches and caches the current authenticated user.
 * Optimized for slow networks:
 * - Uses cached data immediately
 * - Refetches in background when stale
 * - Handles offline gracefully
 * 
 * @returns Query result with user data
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: fetchCurrentUser,
    // User data is fresh for 10 minutes
    staleTime: 10 * 60 * 1000,
    // Keep in cache for 24 hours (survives offline periods)
    gcTime: 24 * 60 * 60 * 1000,
    // Use cache first, fetch in background
    networkMode: 'offlineFirst',
    // Don't retry 401 errors
    retry: (failureCount, error) => {
      if (error && 'status' in error && error.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to invalidate and refetch user data
 * Use after login/logout or profile updates
 */
export function useInvalidateUser() {
  const queryClient = useQueryClient();

  return {
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
    setUser: (user: User | null) => {
      queryClient.setQueryData(queryKeys.currentUser, user);
    },
    removeUser: () => {
      queryClient.setQueryData(queryKeys.currentUser, null);
      queryClient.removeQueries({ queryKey: queryKeys.currentUser });
    },
  };
}

/**
 * Optimistic update pattern for user profile updates
 * Shows immediate UI feedback while the API request is in flight
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<User>) => {
      // Replace with actual API call
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json() as Promise<User>;
    },
    // Optimistic update - update cache immediately before API responds
    onMutate: async (updates) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.currentUser });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData<User>(queryKeys.currentUser);

      // Optimistically update the cache
      if (previousUser) {
        queryClient.setQueryData<User>(queryKeys.currentUser, {
          ...previousUser,
          ...updates,
        });
      }

      // Return context with the snapshot
      return { previousUser };
    },
    // If the mutation fails, roll back to the previous value
    onError: (_err, _updates, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.currentUser, context.previousUser);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
    // Pause mutations when offline, resume when back online
    networkMode: 'offlineFirst',
  });
}
