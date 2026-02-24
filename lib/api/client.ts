// lib/api/client.ts

/**
 * Base API client for making HTTP requests
 * Configured for slow/unreliable networks with:
 * - Request timeout
 * - Error handling
 * - JSON parsing
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Default timeout for requests (30 seconds - generous for slow networks)
const DEFAULT_TIMEOUT = 30000;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Base fetch wrapper with timeout and error handling
 */
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Generic API request function
 */
export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetchWithTimeout(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// ============================================
// API Fetcher Functions
// ============================================

/**
 * User types and API
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'educator' | 'admin';
  avatar?: string;
  createdAt: string;
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    return await apiRequest<User>('/auth/me');
  } catch (error) {
    // Return null for unauthenticated users
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

/**
 * App configuration types and API
 */
export interface AppConfig {
  maintenanceMode: boolean;
  features: {
    courses: boolean;
    assessments: boolean;
    community: boolean;
    certificates: boolean;
  };
  version: string;
}

export async function fetchAppConfig(): Promise<AppConfig> {
  return apiRequest<AppConfig>('/config');
}

/**
 * Dashboard summary types and API
 */
export interface DashboardSummary {
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalStudyHours: number;
  currentStreak: number;
  certificates: number;
  recentActivity: {
    id: string;
    type: 'course_progress' | 'assessment_completed' | 'certificate_earned';
    title: string;
    timestamp: string;
  }[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>('/dashboard/summary');
}

/**
 * Courses types and API
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  enrolledCount: number;
  rating: number;
}

export async function fetchCourses(params?: {
  category?: string;
  level?: string;
  search?: string;
}): Promise<Course[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.level) searchParams.set('level', params.level);
  if (params?.search) searchParams.set('search', params.search);

  const query = searchParams.toString();
  return apiRequest<Course[]>(`/courses${query ? `?${query}` : ''}`);
}

export async function fetchCourseById(id: string): Promise<Course> {
  return apiRequest<Course>(`/courses/${id}`);
}

/**
 * Mutation functions
 */
export interface EnrollmentResult {
  success: boolean;
  enrollmentId: string;
  message: string;
}

export async function enrollInCourse(courseId: string): Promise<EnrollmentResult> {
  return apiRequest<EnrollmentResult>(`/courses/${courseId}/enroll`, {
    method: 'POST',
  });
}

export interface UpdateProgressPayload {
  lessonId: string;
  completed: boolean;
  timeSpent: number;
}

export async function updateCourseProgress(
  courseId: string,
  payload: UpdateProgressPayload
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/courses/${courseId}/progress`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
