# TanStack Query Data Layer

This document describes the client-side data layer implementation using TanStack Query with IndexedDB persistence, optimized for users with slow and unreliable internet connections.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
├─────────────────────────────────────────────────────────────┤
│  ReactQueryProvider (with PersistQueryClientProvider)        │
│  ├─ QueryClient (configured for slow networks)               │
│  ├─ IndexedDB Persister (idb-keyval)                         │
│  └─ Online/Offline Manager                                   │
├─────────────────────────────────────────────────────────────┤
│  BootstrapQueries (prefetches critical data)                 │
├─────────────────────────────────────────────────────────────┤
│  Custom Hooks (useCurrentUser, useDashboardSummary, etc.)    │
├─────────────────────────────────────────────────────────────┤
│  API Client (fetcher functions with timeout/retry)           │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `lib/react-query/queryClient.ts` | QueryClient configuration and IndexedDB persister |
| `lib/react-query/ReactQueryProvider.tsx` | Provider with persistence and online/offline sync |
| `lib/api/client.ts` | API fetcher functions with error handling |
| `app/_components/BootstrapQueries.tsx` | Prefetches critical data on app load |
| `app/_components/OfflineBanner.tsx` | UI feedback for network status |
| `hooks/useCurrentUser.ts` | User data hook with optimistic updates |
| `hooks/useDashboardSummary.ts` | Dashboard data hook |
| `hooks/useCourses.ts` | Course data and mutations |

## Configuration for Slow Networks

### Default Query Settings

```typescript
{
  staleTime: 5 * 60 * 1000,        // 5 minutes - reduces refetches
  gcTime: 24 * 60 * 60 * 1000,     // 24 hours - survives offline
  retry: 3,                         // 3 retries with exponential backoff
  refetchOnWindowFocus: false,      // Saves bandwidth
  refetchOnMount: false,            // Uses cache on remount
  refetchOnReconnect: true,         // Refreshes when back online
  networkMode: 'offlineFirst',      // Uses cache when offline
}
```

### Tuning staleTime and gcTime

| Data Type | staleTime | gcTime | Rationale |
|-----------|-----------|--------|-----------|
| User profile | 10 min | 24 hr | Rarely changes, critical for auth |
| App config | 30 min | 24 hr | Static, needed for feature flags |
| Dashboard | 5 min | 24 hr | Balance freshness vs bandwidth |
| Course list | 10 min | 24 hr | Updates infrequently |
| Course detail | 15 min | 24 hr | Content is relatively static |

### When to Adjust

- **Increase staleTime** when:
  - Data changes rarely
  - Users have very slow connections
  - Bandwidth is expensive

- **Decrease staleTime** when:
  - Data changes frequently
  - Real-time accuracy is critical
  - Users have good connections

## Bootstrap Queries

Critical queries that run on app load:

1. **fetchCurrentUser** - Required for auth-dependent UI
2. **fetchAppConfig** - Feature flags and maintenance mode
3. **fetchDashboardSummary** - Main dashboard metrics (only if logged in)

### Adding New Bootstrap Queries

Edit `app/_components/BootstrapQueries.tsx`:

```typescript
// Add query key
export const queryKeys = {
  // ... existing keys
  newData: ['newData'] as const,
};

// Add useQuery in component
useQuery({
  queryKey: queryKeys.newData,
  queryFn: fetchNewData,
  staleTime: 10 * 60 * 1000,
  networkMode: 'offlineFirst',
});
```

## Offline Behavior

### Reading Data
- Queries use `networkMode: 'offlineFirst'` 
- Data is served from cache when offline
- No retry loops when network is unavailable

### Writing Data (Mutations)
- Mutations pause when offline
- Resume automatically when back online
- Optimistic updates provide immediate feedback

### Network Status Detection
- Browser `online`/`offline` events are monitored
- TanStack Query's `onlineManager` syncs with browser state
- `OfflineBanner` provides visual feedback

## Cache Invalidation Strategy

### Automatic Invalidation
- Coming back online triggers `invalidateQueries` for critical data
- Successful mutations invalidate related queries

### Manual Invalidation
```typescript
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });

// Invalidate all queries matching prefix
queryClient.invalidateQueries({ queryKey: ['courses'] });

// Force immediate refetch
queryClient.refetchQueries({ queryKey: queryKeys.currentUser });
```

## IndexedDB Persistence

### How It Works
1. On app load, cache is restored from IndexedDB
2. UI renders immediately with cached data
3. Background refetches update stale data
4. Cache is persisted on changes (debounced)

### Cache Key
The cache is stored under key: `afrivas-react-query-cache`

### Max Age
Cached data older than 24 hours is discarded on restore.

### Clearing Cache
```typescript
import { del } from 'idb-keyval';
await del('afrivas-react-query-cache');
```

## Usage Examples

### Basic Query
```typescript
import { useDashboardSummary } from '@/hooks/useDashboardSummary';

function Dashboard() {
  const { data, isLoading, isFetching, isStale } = useDashboardSummary();

  return (
    <div>
      {isStale && <RefreshingIndicator />}
      <Stats data={data} />
    </div>
  );
}
```

### Mutation with Optimistic Update
```typescript
import { useEnrollInCourse } from '@/hooks/useCourses';

function EnrollButton({ courseId }) {
  const { mutate, isPending } = useEnrollInCourse();

  return (
    <button 
      onClick={() => mutate(courseId)}
      disabled={isPending}
    >
      {isPending ? 'Enrolling...' : 'Enroll'}
    </button>
  );
}
```

### Prefetch on Hover
```typescript
import { usePrefetchCourse } from '@/hooks/useCourses';

function CourseCard({ course }) {
  const { prefetch } = usePrefetchCourse();

  return (
    <Link 
      href={`/courses/${course.id}`}
      onMouseEnter={() => prefetch(course.id)}
    >
      {course.title}
    </Link>
  );
}
```

## Performance Tips

1. **Use `select` for derived data** - Reduces re-renders
   ```typescript
   useQuery({
     queryKey: ['courses'],
     queryFn: fetchCourses,
     select: (data) => data.filter(c => c.level === 'beginner'),
   });
   ```

2. **Prefetch on navigation intent** - Link hover, button focus
   ```typescript
   onMouseEnter={() => queryClient.prefetchQuery(...)}
   ```

3. **Use placeholder data** - Show stale data immediately
   ```typescript
   placeholderData: (previousData) => previousData,
   ```

4. **Batch related queries** - Fetch together in BootstrapQueries

5. **Avoid over-fetching** - Don't include rarely-used data in bootstrap

## Debugging

Enable React Query Devtools in development:
- Click the floating button (bottom-left corner)
- Inspect query states, cache contents, and network requests

## Dependencies

```json
{
  "@tanstack/react-query": "^5.x",
  "@tanstack/react-query-devtools": "^5.x",
  "@tanstack/react-query-persist-client": "^5.x",
  "idb-keyval": "^6.x"
}
```
