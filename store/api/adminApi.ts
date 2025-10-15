import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define types for admin API responses
export interface AdminDashboardMetrics {
  totalUsers: number
  totalFaculty: number
  totalDepartments: number
  totalStudents: number
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: Date
  }>
}

export interface Faculty {
  id: string
  name: string
  email: string
  department: string
  position: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  facultyCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'faculty' | 'student'
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface FacultyAnalytics {
  totalFaculty: number
  activeCount: number
  inactiveCount: number
  departmentDistribution: Array<{
    department: string
    count: number
  }>
}

export interface DepartmentAnalytics {
  totalDepartments: number
  activeCount: number
  inactiveCount: number
  facultyDistribution: Array<{
    department: string
    facultyCount: number
  }>
}

// Create API slice
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/admin',
    prepareHeaders: (headers, { getState }) => {
      // Add authentication headers
      const token = localStorage.getItem('authToken')
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['AdminMetrics', 'Faculty', 'Department', 'User'],
  endpoints: (builder) => ({
    // Dashboard endpoints
    getDashboardMetrics: builder.query<AdminDashboardMetrics, void>({
      query: () => '/dashboard/metrics',
      providesTags: ['AdminMetrics'],
    }),

    // Faculty endpoints
    getAllFaculty: builder.query<Faculty[], void>({
      query: () => '/faculty',
      providesTags: ['Faculty'],
    }),
    getFacultyById: builder.query<Faculty, string>({
      query: (id) => `/faculty/${id}`,
      providesTags: ['Faculty'],
    }),
    createFaculty: builder.mutation<Faculty, Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (faculty) => ({
        url: '/faculty',
        method: 'POST',
        body: faculty,
      }),
      invalidatesTags: ['Faculty', 'AdminMetrics'],
    }),
    updateFaculty: builder.mutation<Faculty, { id: string; updates: Partial<Faculty> }>({
      query: ({ id, updates }) => ({
        url: `/faculty/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Faculty', 'AdminMetrics'],
    }),
    deleteFaculty: builder.mutation<void, string>({
      query: (id) => ({
        url: `/faculty/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faculty', 'AdminMetrics'],
    }),
    getFacultyAnalytics: builder.query<FacultyAnalytics, void>({
      query: () => '/faculty/analytics',
      providesTags: ['Faculty'],
    }),

    // Department endpoints
    getAllDepartments: builder.query<Department[], void>({
      query: () => '/departments',
      providesTags: ['Department'],
    }),
    getDepartmentById: builder.query<Department, string>({
      query: (id) => `/departments/${id}`,
      providesTags: ['Department'],
    }),
    createDepartment: builder.mutation<Department, Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'facultyCount'>>({
      query: (department) => ({
        url: '/departments',
        method: 'POST',
        body: department,
      }),
      invalidatesTags: ['Department', 'AdminMetrics'],
    }),
    updateDepartment: builder.mutation<Department, { id: string; updates: Partial<Department> }>({
      query: ({ id, updates }) => ({
        url: `/departments/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Department', 'AdminMetrics'],
    }),
    deleteDepartment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department', 'AdminMetrics'],
    }),
    getDepartmentAnalytics: builder.query<DepartmentAnalytics, void>({
      query: () => '/departments/analytics',
      providesTags: ['Department'],
    }),

    // User management endpoints
    getAllUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: string; updates: Partial<User> }>({
      query: ({ id, updates }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User', 'AdminMetrics'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'AdminMetrics'],
    }),
    getUsersByRole: builder.query<User[], 'admin' | 'faculty' | 'student'>({
      query: (role) => `/users/role/${role}`,
      providesTags: ['User'],
    }),
  }),
})

// Export hooks for use in components
export const {
  useGetDashboardMetricsQuery,
  useGetAllFacultyQuery,
  useGetFacultyByIdQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useGetFacultyAnalyticsQuery,
  useGetAllDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentAnalyticsQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUsersByRoleQuery,
} = adminApi
