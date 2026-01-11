import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for admin API responses
type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

// Admin Dashboard Stats Types
export type DashboardStats = {
  totalStudents: number;
  totalLecturers: number;
  totalDepartments: number;
  totalFaculties: number;
  recentRegistrations: number;
};

// Faculty Types
export type Faculty = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  departmentCount?: number;
  studentCount?: number;
  lecturerCount?: number;
};

export type FacultyWithStats = Faculty & {
  statistics: {
    totalDepartments: number;
    totalStudents: number;
    totalLecturers: number;
    totalCourses: number;
  };
};

export type CreateFacultyRequest = {
  name: string;
  description?: string;
};

// Department Types
export type Department = {
  id: string;
  name: string;
  facultyId: string;
  faculty?: Faculty;
  createdAt: string;
  updatedAt: string;
};

export type CreateDepartmentRequest = {
  name: string;
  facultyId: string;
};

// User Types
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
};

// Student Types
export type Student = User & {
  studentId: string;
  departmentId: string;
  department?: Department;
  enrollmentDate: string;
  status: string;
  academicYear: string;
  level: string;
  isApproved: boolean;
};

export type CreateStudentRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  dob: string;
  role: string;
  year?: string;
  semester?: string;
  faculty?: string;
  department?: string;
  institutionId: string;
};

// Lecturer Types
export type Lecturer = User & {
  staffId: string;
  departmentId: string;
  department?: Department;
  employmentDate: string;
  specialization: string;
  qualification: string;
  isApproved: boolean;
};

export type CreateLecturerRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  dob: string;
  role: string;
  faculty?: string;
  department?: string;
  institutionId: string;
};

// Grade Types
export type Grade = {
  id: string;
  name: string;
  code: string;
  description?: string;
  minScore: number;
  maxScore: number;
  gpa: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateGradeRequest = {
  name: string;
  code: string;
  description?: string;
  minScore: number;
  maxScore: number;
  gpa: number;
};

export type GradeStatistics = {
  totalGrades: number;
  averageGPA: number;
  gradeDistribution: Record<string, number>;
  passRate: number;
  failRate: number;
};

export type BulkGradeRequest = {
  grades: CreateGradeRequest[];
};

// Semester Types
export type Semester = {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSemesterRequest = {
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  academicYear: string;
};

// Course Types
export type Course = {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  level: string;
  semester: string;
  departmentId: string;
  department?: Department;
  lecturerId?: string;
  lecturer?: Lecturer;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCourseRequest = {
  name: string;
  code: string;
  description?: string;
  credits: number;
  level: string;
  semester: string;
  departmentId: string;
  lecturerId?: string;
};

// Class Types
export type Class = {
  id: string;
  name: string;
  code: string;
  courseId: string;
  course?: Course;
  lecturerId: string;
  lecturer?: Lecturer;
  academicYear: string;
  semester: string;
  room?: string;
  schedule?: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateClassRequest = {
  name: string;
  code: string;
  courseId: string;
  lecturerId: string;
  academicYear: string;
  semester: string;
  room?: string;
  schedule?: string;
  capacity: number;
};

// Analytics Types
export type FacultyAnalytics = {
  facultyId: string;
  facultyName: string;
  studentCount: number;
  lecturerCount: number;
  departmentCount: number;
};

export type DepartmentAnalytics = {
  departmentId: string;
  departmentName: string;
  studentCount: number;
  lecturerCount: number;
  facultyName: string;
};

// Create the Admin API slice
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api/v1'}/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('authToken');
      console.log('Admin API - Token from localStorage:', token ? `Bearer ${token.substring(0, 20)}...` : 'No token found');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Faculty', 'Department', 'User', 'Stats', 'Grade', 'Course', 'Class', 'Student', 'Lecturer', 'Semester'],
  endpoints: (builder) => ({
    // Dashboard Stats
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Stats'],
    }),

    // Faculty Management
    getFaculties: builder.query<ApiResponse<Faculty[]>, void>({
      query: () => '/faculty',
      providesTags: ['Faculty'],
    }),

    getFacultyById: builder.query<ApiResponse<Faculty>, string>({
      query: (id) => `/faculty/${id}`,
      providesTags: (result, error, id) => [{ type: 'Faculty', id }],
    }),

    createFaculty: builder.mutation<ApiResponse<Faculty>, CreateFacultyRequest>({
      query: (data) => ({
        url: '/faculty',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Faculty', 'Stats'],
    }),

    updateFaculty: builder.mutation<ApiResponse<Faculty>, { id: string; data: Partial<CreateFacultyRequest> }>({
      query: ({ id, data }) => ({
        url: `/faculty/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Faculty', id }, 'Faculty'],
    }),

    deleteFaculty: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/faculty/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faculty', 'Department', 'Stats'],
    }),

    getFacultyAnalytics: builder.query<ApiResponse<FacultyAnalytics[]>, void>({
      // Backend route: GET /api/v1/admin/faculty/analytics/performance
      query: () => '/faculty/analytics/performance',
      providesTags: ['Faculty'],
    }),

    // Department Management
    getDepartments: builder.query<ApiResponse<Department[]>, void>({
      // Backend route: GET /api/v1/admin/departments
      query: () => '/departments',
      providesTags: ['Department'],
    }),

    getDepartmentById: builder.query<ApiResponse<Department>, string>({
      query: (id) => `/departments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Department', id }],
    }),

    getDepartmentsByFaculty: builder.query<ApiResponse<Department[]>, string>({
      // Backend route uses facultyId as query param: /departments?facultyId=<id>
      query: (facultyId) => `/departments?facultyId=${facultyId}`,
      providesTags: ['Department'],
    }),

    createDepartment: builder.mutation<ApiResponse<Department>, CreateDepartmentRequest>({
      query: (data) => ({
        url: '/departments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Department', 'Stats'],
    }),

    updateDepartment: builder.mutation<ApiResponse<Department>, { id: string; data: Partial<CreateDepartmentRequest> }>({
      query: ({ id, data }) => ({
        url: `/departments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Department', id }, 'Department'],
    }),

    deleteDepartment: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department', 'Stats'],
    }),

    getDepartmentAnalytics: builder.query<ApiResponse<DepartmentAnalytics[]>, void>({
      // Backend route: GET /api/v1/admin/departments/analytics/performance
      query: () => '/departments/analytics/performance',
      providesTags: ['Department'],
    }),

    // User Management
    getUsers: builder.query<ApiResponse<User[]>, { page?: number; limit?: number; role?: string }>({
      query: ({ page = 1, limit = 10, role } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (role) params.append('role', role);
        return `/users?${params.toString()}`;
      },
      providesTags: ['User'],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    updateUser: builder.mutation<ApiResponse<User>, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User', 'Stats'],
    }),

    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Stats'],
    }),

    toggleUserStatus: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }, 'User'],
    }),

    // Grade Management
    getGrades: builder.query<ApiResponse<Grade[]>, void>({
      query: () => '/grades',
      providesTags: ['Grade'],
    }),

    getGradeById: builder.query<ApiResponse<Grade>, string>({
      query: (id) => `/grades/${id}`,
      providesTags: (result, error, id) => [{ type: 'Grade', id }],
    }),

    createGrade: builder.mutation<ApiResponse<Grade>, CreateGradeRequest>({
      query: (data) => ({
        url: '/grades',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Grade'],
    }),

    updateGrade: builder.mutation<ApiResponse<Grade>, { id: string; data: Partial<CreateGradeRequest> }>({
      query: ({ id, data }) => ({
        url: `/grades/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Grade', id }, 'Grade'],
    }),

    deleteGrade: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/grades/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Grade'],
    }),

    // Course Management
    getCourses: builder.query<ApiResponse<Course[]>, void>({
      query: () => '/courses',
      providesTags: ['Course'],
    }),

    getCourseById: builder.query<ApiResponse<Course>, string>({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),

    getCoursesByDepartment: builder.query<ApiResponse<Course[]>, string>({
      query: (departmentId) => `/courses/department/${departmentId}`,
      providesTags: ['Course'],
    }),

    createCourse: builder.mutation<ApiResponse<Course>, CreateCourseRequest>({
      query: (data) => ({
        url: '/courses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),

    updateCourse: builder.mutation<ApiResponse<Course>, { id: string; data: Partial<CreateCourseRequest> }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Course', id }, 'Course'],
    }),

    deleteCourse: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),

    // Class Management
    getClasses: builder.query<ApiResponse<Class[]>, void>({
      query: () => '/classes',
      providesTags: ['Class'],
    }),

    getClassById: builder.query<ApiResponse<Class>, string>({
      query: (id) => `/classes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Class', id }],
    }),

    getClassesByCourse: builder.query<ApiResponse<Class[]>, string>({
      query: (courseId) => `/classes/course/${courseId}`,
      providesTags: ['Class'],
    }),

    createClass: builder.mutation<ApiResponse<Class>, CreateClassRequest>({
      query: (data) => ({
        url: '/classes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Class'],
    }),

    updateClass: builder.mutation<ApiResponse<Class>, { id: string; data: Partial<CreateClassRequest> }>({
      query: ({ id, data }) => ({
        url: `/classes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Class', id }, 'Class'],
    }),

    deleteClass: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/classes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),

    // Student Management
    getStudents: builder.query<ApiResponse<Student[]>, { page?: number; limit?: number; departmentId?: string }>({
      query: ({ page = 1, limit = 10, departmentId } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (departmentId) params.append('departmentId', departmentId);
        // Backend route: GET /api/v1/admin/users/students
        return `/users/students?${params.toString()}`;
      },
      providesTags: ['Student'],
    }),

    // New endpoint for fetching all students from users/students
    getAllStudents: builder.query<ApiResponse<Student[]>, { page?: number; limit?: number; search?: string; program?: string; year?: string; status?: string }>({
      query: ({ page = 1, limit = 10, search, program, year, status } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append('search', search);
        if (program) params.append('program', program);
        if (year) params.append('year', year);
        if (status) params.append('status', status);
        return `/users/students?${params.toString()}`;
      },
      providesTags: ['Student'],
    }),

    getStudentById: builder.query<ApiResponse<Student>, string>({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    createStudent: builder.mutation<ApiResponse<Student>, CreateStudentRequest>({
      query: (body) => ({
        url: '/student/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student', 'Stats'],
    }),

    updateStudent: builder.mutation<ApiResponse<Student>, { id: string; data: Partial<CreateStudentRequest> }>({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),

    deleteStudent: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student', 'Stats'],
    }),

    approveStudent: builder.mutation<ApiResponse<Student>, string>({
      query: (id) => ({
        url: `/students/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Student', id }, 'Student', 'Stats'],
    }),

    rejectStudent: builder.mutation<ApiResponse<Student>, string>({
      query: (id) => ({
        url: `/students/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Student', id }, 'Student', 'Stats'],
    }),

    // Get student details with stats
    getStudentDetails: builder.query<ApiResponse<{ student: Student; stats: any }>, string>({
      query: (id) => `/users/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    // Delete student from users
    deleteStudentFromUsers: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student', 'Stats'],
    }),

    // Lecturer Management
    getLecturers: builder.query<ApiResponse<Lecturer[]>, { page?: number; limit?: number; departmentId?: string }>({
      query: ({ page = 1, limit = 10, departmentId } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (departmentId) params.append('departmentId', departmentId);
        // Backend route: GET /api/v1/admin/users/lecturers
        return `/users/lecturers?${params.toString()}`;
      },
      providesTags: ['Lecturer'],
    }),

    // New endpoint for fetching all lecturers from users/lecturers
    getAllLecturers: builder.query<ApiResponse<Lecturer[]>, { page?: number; limit?: number; search?: string; department?: string; status?: string }>({
      query: ({ page = 1, limit = 10, search, department, status } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.append('search', search);
        if (department) params.append('department', department);
        if (status) params.append('status', status);
        return `/users/lecturers?${params.toString()}`;
      },
      providesTags: ['Lecturer'],
    }),

    getLecturerById: builder.query<ApiResponse<Lecturer>, string>({
      query: (id) => `/lecturers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lecturer', id }],
    }),

    createLecturer: builder.mutation<ApiResponse<Lecturer>, CreateLecturerRequest>({
      query: (data) => ({
        url: '/lecturers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Lecturer', 'Stats'],
    }),

    updateLecturer: builder.mutation<ApiResponse<Lecturer>, { id: string; data: Partial<CreateLecturerRequest> }>({
      query: ({ id, data }) => ({
        url: `/lecturers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lecturer', id }, 'Lecturer'],
    }),

    deleteLecturer: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/lecturers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lecturer', 'Stats'],
    }),

    approveLecturer: builder.mutation<ApiResponse<Lecturer>, string>({
      query: (id) => ({
        url: `/lecturers/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Lecturer', id }, 'Lecturer', 'Stats'],
    }),

    rejectLecturer: builder.mutation<ApiResponse<Lecturer>, string>({
      query: (id) => ({
        url: `/lecturers/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Lecturer', id }, 'Lecturer', 'Stats'],
    }),

    // Get lecturer details with stats
    getLecturerDetails: builder.query<ApiResponse<{ lecturer: Lecturer; stats: any }>, string>({
      query: (id) => `/users/lecturers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lecturer', id }],
    }),

    // Delete lecturer from users
    deleteLecturerFromUsers: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lecturer', 'Stats'],
    }),

    // Grade Statistics
    getGradeStatistics: builder.query<ApiResponse<GradeStatistics>, void>({
      query: () => '/grades/statistics',
      providesTags: ['Grade'],
    }),

    // Bulk Grade Operations
    createBulkGrades: builder.mutation<ApiResponse<Grade[]>, BulkGradeRequest>({
      query: (data) => ({
        url: '/grades/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Grade'],
    }),

    // Semester Management
    getSemesters: builder.query<ApiResponse<Semester[]>, void>({
      query: () => '/semesters',
      providesTags: ['Semester'],
    }),

    getSemesterById: builder.query<ApiResponse<Semester>, string>({
      query: (id) => `/semesters/${id}`,
      providesTags: (result, error, id) => [{ type: 'Semester', id }],
    }),

    createSemester: builder.mutation<ApiResponse<Semester>, CreateSemesterRequest>({
      query: (data) => ({
        url: '/semesters',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Semester'],
    }),

    updateSemester: builder.mutation<ApiResponse<Semester>, { id: string; data: Partial<CreateSemesterRequest> }>({
      query: ({ id, data }) => ({
        url: `/semesters/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Semester', id }, 'Semester'],
    }),

    deleteSemester: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/semesters/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Semester'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Dashboard
  useGetDashboardStatsQuery,

  // Faculty hooks
  useGetFacultiesQuery,
  useGetFacultyByIdQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useGetFacultyAnalyticsQuery,

  // Department hooks
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useGetDepartmentsByFacultyQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentAnalyticsQuery,

  // User hooks
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,

  // Grade hooks
  useGetGradesQuery,
  useGetGradeByIdQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,

  // Course hooks
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCoursesByDepartmentQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,

  // Class hooks
  useGetClassesQuery,
  useGetClassByIdQuery,
  useGetClassesByCourseQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,

  // Student hooks
  useGetStudentsQuery,
  useGetAllStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useApproveStudentMutation,
  useRejectStudentMutation,
  useGetStudentDetailsQuery,
  useDeleteStudentFromUsersMutation,

  // Lecturer hooks
  useGetLecturersQuery,
  useGetAllLecturersQuery,
  useGetLecturerByIdQuery,
  useCreateLecturerMutation,
  useUpdateLecturerMutation,
  useDeleteLecturerMutation,
  useApproveLecturerMutation,
  useRejectLecturerMutation,
  useGetLecturerDetailsQuery,
  useDeleteLecturerFromUsersMutation,

  // Grade statistics hooks
  useGetGradeStatisticsQuery,
  useCreateBulkGradesMutation,

  // Semester management hooks
  useGetSemestersQuery,
  useGetSemesterByIdQuery,
  useCreateSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
} = adminApi;
