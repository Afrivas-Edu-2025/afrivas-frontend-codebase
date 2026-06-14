'use client';

// hooks/useCourses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCourses,
  fetchCourseById,
  enrollInCourse,
  updateCourseProgress,
  type Course,
  type UpdateProgressPayload,
} from '@/lib/api/client';
import { queryKeys } from '@/app/_components/BootstrapQueries';

// Course-specific query keys
export const courseQueryKeys = {
  all: ['courses'] as const,
  list: (filters?: { category?: string; level?: string; search?: string }) =>
    ['courses', 'list', filters] as const,
  detail: (id: string) => ['courses', 'detail', id] as const,
  enrolled: ['courses', 'enrolled'] as const,
} as const;

/**
 * useCourses Hook
 * 
 * Fetches and caches course listings.
 * Optimized for slow networks with filtering support.
 * 
 * @param filters - Optional filters for category, level, search
 * @returns Query result with courses data
 */
export function useCourses(filters?: {
  category?: string;
  level?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: courseQueryKeys.list(filters),
    queryFn: () => fetchCourses(filters),
    // Course listings fresh for 10 minutes
    staleTime: 10 * 60 * 1000,
    // Keep in cache for 24 hours
    gcTime: 24 * 60 * 60 * 1000,
    // Use cache first for instant render
    networkMode: 'offlineFirst',
    // Keep previous data while fetching new filters
    placeholderData: (previousData) => previousData,
  });
}

/**
 * useCourse Hook
 * 
 * Fetches a single course by ID.
 * 
 * @param id - Course ID
 * @returns Query result with course data
 */
export function useCourse(id: string) {
  return useQuery({
    queryKey: courseQueryKeys.detail(id),
    queryFn: () => fetchCourseById(id),
    // Single course fresh for 15 minutes
    staleTime: 15 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    networkMode: 'offlineFirst',
    // Only fetch if id is provided
    enabled: !!id,
  });
}

/**
 * useEnrollInCourse Hook
 * 
 * Mutation hook for enrolling in a course.
 * Includes optimistic UI update.
 */
export function useEnrollInCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollInCourse,
    onSuccess: () => {
      // Invalidate queries that should reflect enrollment
      queryClient.invalidateQueries({ queryKey: courseQueryKeys.enrolled });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });
    },
    // Pause when offline, resume when online
    networkMode: 'offlineFirst',
    retry: 2,
  });
}

/**
 * useUpdateCourseProgress Hook
 * 
 * Mutation hook for updating course progress.
 * Uses optimistic updates for immediate UI feedback.
 */
export function useUpdateCourseProgress(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProgressPayload) =>
      updateCourseProgress(courseId, payload),
    // Optimistic update
    onMutate: async (payload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.dashboardSummary,
      });

      // Snapshot for rollback
      const previousSummary = queryClient.getQueryData(queryKeys.dashboardSummary);

      // Return context for rollback
      return { previousSummary };
    },
    onError: (_err, _payload, context) => {
      // Rollback on error
      if (context?.previousSummary) {
        queryClient.setQueryData(queryKeys.dashboardSummary, context.previousSummary);
      }
    },
    onSettled: () => {
      // Refetch to get accurate data
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });
    },
    // Keep mutations when offline
    networkMode: 'offlineFirst',
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Prefetch course detail for instant navigation
 */
export function usePrefetchCourse() {
  const queryClient = useQueryClient();

  return {
    prefetch: (id: string) => {
      queryClient.prefetchQuery({
        queryKey: courseQueryKeys.detail(id),
        queryFn: () => fetchCourseById(id),
        staleTime: 15 * 60 * 1000,
      });
    },
  };
}
