import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for admin API responses
type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

type PaginatedApiResponse<T = any> = ApiResponse<T> & {
  currentPage?: number;
  totalPages?: number;
  total?: number;
  hasMore?: boolean;
  nextCursor?: number | null;
  prevCursor?: number | null;
};

const toNumber = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const safeArray = <T = any>(value: unknown): T[] => {
  return Array.isArray(value) ? (value as T[]) : [];
};

const isExpiredJwt = (token: string): boolean => {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    // JWT uses base64URL encoding — replace chars before decoding
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (typeof payload?.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      return payload.exp <= now;
    }
    return false;
  } catch {
    return false;
  }
};

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('authToken') ||
    null;

  if (!token || isExpiredJwt(token)) return null;

  return token;
};

const mapFaculty = (faculty: any): Faculty => ({
  id: String(faculty?.id ?? ''),
  name: faculty?.facultyName ?? faculty?.name ?? 'Unnamed Faculty',
  description: faculty?.description,
  createdAt: faculty?.createdAt ?? new Date().toISOString(),
  updatedAt: faculty?.updatedAt ?? faculty?.createdAt ?? new Date().toISOString(),
  departmentCount: faculty?.departmentCount ?? 0,
  studentCount: faculty?.studentCount ?? 0,
  lecturerCount: faculty?.lecturerCount ?? safeArray(faculty?.lecturer).length,
});

const mapDepartment = (department: any): Department => ({
  id: String(department?.id ?? ''),
  name: department?.deptName ?? department?.name ?? 'Unnamed Department',
  facultyId: String(department?.facultyId ?? ''),
  faculty: department?.faculty
    ? mapFaculty(department.faculty)
    : undefined,
  createdAt: department?.createdAt ?? new Date().toISOString(),
  updatedAt: department?.updatedAt ?? department?.createdAt ?? new Date().toISOString(),
});

const mapLecturer = (lecturer: any) => {
  const user = lecturer?.user ?? {};
  const profile = user?.userProfile ?? {};
  return {
    id: String(lecturer?.id ?? user?.id ?? ''),
    userId: String(user?.id ?? lecturer?.userId ?? ''),
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    username: user?.username ?? '',
    email: user?.email ?? '',
    role: user?.role ?? 'LECTURER',
    isActive: user?.isApproved ?? true,
    createdAt: user?.createdAt ?? lecturer?.createdAt ?? new Date().toISOString(),
    updatedAt: user?.updatedAt ?? lecturer?.updatedAt ?? new Date().toISOString(),
    gender: profile?.gender ?? 'N/A',
    dateOfBirth: profile?.birthDate ?? '',
    phoneNumber: profile?.phoneNumber ?? '',
    address: profile?.address ?? '',
    employeeId: lecturer?.employeeId ?? `L-${lecturer?.id ?? ''}`,
    department: user?.department?.deptName ?? '',
    position: lecturer?.position ?? 'LECTURER',
    qualifications: safeArray<string>(lecturer?.qualifications),
    specialization: safeArray<string>(lecturer?.specialization),
    officeLocation: lecturer?.officeLocation ?? '',
    officeHours: lecturer?.officeHours ?? '',
    assignedCourses: lecturer?.assignedCourses ?? 0,
    totalStudents: lecturer?.totalStudents ?? 0,
    averageRating: lecturer?.averageRating ?? 0,
  };
};

const mapStudent = (student: any) => {
  const user = student?.user ?? {};
  const profile = user?.userProfile ?? {};
  const facultyId = student?.facultyId ?? user?.facultyId ?? user?.faculty?.id;
  const departmentId = student?.deptId ?? student?.departmentId ?? user?.deptId ?? user?.department?.id;
  const levelId = student?.levelId ?? student?.level?.id;
  const semesterId = student?.semesterId ?? student?.semester?.id;
  return {
    id: String(student?.id ?? user?.id ?? ''),
    userId: String(user?.id ?? student?.userId ?? ''),
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    username: user?.username ?? '',
    email: user?.email ?? '',
    role: user?.role ?? 'STUDENT',
    isActive: user?.isApproved ?? true,
    createdAt: user?.createdAt ?? student?.createdAt ?? new Date().toISOString(),
    updatedAt: user?.updatedAt ?? student?.updatedAt ?? new Date().toISOString(),
    gender: profile?.gender ?? 'N/A',
    dateOfBirth: profile?.birthDate ?? '',
    phoneNumber: profile?.phoneNumber ?? '',
    address: profile?.address ?? '',
    studentId: String(student?.studentId ?? ''),
    facultyId: facultyId !== undefined && facultyId !== null ? String(facultyId) : '',
    departmentId: departmentId !== undefined && departmentId !== null ? String(departmentId) : '',
    levelId: levelId !== undefined && levelId !== null ? String(levelId) : '',
    semesterId: semesterId !== undefined && semesterId !== null ? String(semesterId) : '',
    program: user?.department?.deptName ?? '',
    yearOfStudy: levelId ?? 1,
    semester: student?.semester?.semesterName ?? student?.semester ?? '',
    gpa: student?.gpa ?? 0,
    credits: student?.credits ?? 0,
    guardianName: student?.guardianName ?? '',
    guardianContact: student?.guardianContact ?? '',
    enrollmentDate: student?.createdAt ?? user?.createdAt ?? new Date().toISOString(),
    enrolledCourses: student?.enrolledCourses ?? 0,
    completedCourses: student?.completedCourses ?? 0,
    pendingFees: student?.pendingFees ?? 0,
  };
};

export type Activity = {
  id: string;
  action: string;
  name: string;
  time: string;
};

export type DashboardStats = {
  overview: {
    totalStudents: number;
    totalLecturers: number;
    totalCourses: number;
    totalDepartments: number;
    totalFaculties: number;
    totalEnrollments: number;
    completionRate: number;
  };
  recentActivity: Activity[];
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
  facultyId?: string;
  levelId?: string;
  semesterId?: string;
  yearOfStudy?: number | string;
  semester?: string;
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
  lecturers?: { id: string; firstName: string; lastName: string }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCourseRequest = {
  name: string;
  code: string;
  description?: string;
  lecturerIds?: string[];
};

// Class Types
export type Class = {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  departmentId: string;
  levelId: string;
  semesterId?: string;
  capacity: number;
  faculty?: { id: string; facultyName: string };
  department?: { id: string; deptName: string };
  level?: { id: string; levelName: string };
  semester?: { id: string; semesterName: string; year: string };
  _count?: { timeTable: number };
  timeTable?: Timetable[];
  createdAt: string;
  updatedAt: string;
};

export type CreateClassRequest = {
  name: string;
  code: string;
  facultyId: number | string;
  departmentId: number | string;
  levelName: string;
  semesterName?: string;
  capacity: number;
};

// Timetable Types
export type Timetable = {
  id: string;
  classId: string;
  moduleId: string;
  lecturerId?: string;
  classroomId?: string;
  day: string;
  startTime: string;
  endTime: string;
  module?: Course;
  lecturer?: { id: string; user: { firstName: string; lastName: string } };
  classroom?: Classroom;
  createdAt: string;
  updatedAt: string;
};

export type CreateTimetableRequest = {
  classId: number | string;
  moduleId: number | string;
  lecturerId?: number | string;
  classroomId?: number | string;
  day: string;
  startTime: string;
  endTime: string;
};

// Classroom Types
export type Classroom = {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateClassroomRequest = {
  name: string;
  location?: string;
  capacity?: number;
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

// Communication Types
export type MessageRecipient = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'LECTURER';
  studentRecordId: number | null;
  lecturerRecordId: number | null;
};

export type AdminMessage = {
  id: string;
  senderAdminId: number;
  recipientUserId: number;
  recipientEmail: string;
  recipientRole: 'STUDENT' | 'LECTURER';
  subject?: string | null;
  body: string;
  createdAt: string;
};

export type CalendarEvent = {
  id: string;
  createdByAdminId: number;
  title: string;
  description?: string | null;
  startAt: string;
  endAt?: string | null;
  reminderAt?: string | null;
  visibility: 'ALL' | 'STUDENT' | 'LECTURER' | 'CUSTOM';
  isActive: boolean;
  targetUserIds: number[];
  targetRoles: Array<'ADMIN' | 'STUDENT' | 'LECTURER'>;
  createdAt: string;
  updatedAt: string;
};

export type SendAdminMessageRequest = {
  recipientId?: number | string;
  recipientEmail?: string;
  subject?: string;
  body: string;
};

export type CreateCalendarEventRequest = {
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  reminderAt?: string;
  visibility?: 'ALL' | 'STUDENT' | 'LECTURER' | 'CUSTOM';
  isActive?: boolean;
  targetUserIds?: Array<number | string>;
  targetRoles?: Array<'ADMIN' | 'STUDENT' | 'LECTURER'>;
};

// Create the Admin API slice
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1'}`,
    prepareHeaders: (headers) => {
      const token = getStoredToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Faculty', 'Department', 'User', 'Stats', 'Grade', 'Course', 'Class', 'Student', 'Lecturer', 'Semester', 'Message', 'CalendarEvent', 'Timetable'],
  endpoints: (builder) => ({
    // Dashboard Stats
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Stats'],
    }),

    // Faculty Management
    getFaculties: builder.query<ApiResponse<Faculty[]>, void>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        const pageSize = 50;
        let cursor: number | null = null;
        let hasMore = true;
        let guard = 0;
        const merged: any[] = [];

        while (hasMore && guard < 50) {
          const params = new URLSearchParams({ page: String(pageSize) });
          if (cursor !== null) params.append('cursor', String(cursor));

          const response = await fetchWithBQ(`/faculty?${params.toString()}`);
          if (response.error) {
            return { error: response.error as any };
          }

          const payload = response.data as any;
          const rows = safeArray(payload?.data?.data ?? payload?.data);
          merged.push(...rows);

          const pagination = payload?.data?.pagination ?? {};
          hasMore = Boolean(pagination?.hasMore);
          cursor = typeof pagination?.nextCursor === 'number' ? pagination.nextCursor : null;
          guard += 1;
        }

        return {
          data: {
            success: true,
            message: 'Faculties fetched successfully',
            data: merged.map(mapFaculty),
          },
        };
      },
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
        body: {
          name: data.name,
        },
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
      // Backend route: GET /api/v1/department
      query: () => '/department',
      transformResponse: (response: any): ApiResponse<Department[]> => {
        const rawData = safeArray(response?.data?.data ?? response?.data);
        return {
          success: true,
          message: 'Departments fetched successfully',
          data: rawData.map(mapDepartment),
        };
      },
      providesTags: ['Department'],
    }),

    getDepartmentById: builder.query<ApiResponse<Department>, string>({
      query: (id) => `/department/${id}`,
      providesTags: (result, error, id) => [{ type: 'Department', id }],
    }),

    getDepartmentsByFaculty: builder.query<ApiResponse<Department[]>, string>({
      // Backend route uses facultyId as query param: /department?facultyId=<id>
      query: (facultyId) => `/department?facultyId=${facultyId}`,
      providesTags: ['Department'],
    }),

    createDepartment: builder.mutation<ApiResponse<Department>, CreateDepartmentRequest>({
      query: (data) => ({
        url: '/department',
        method: 'POST',
        body: {
          deptName: data.name,
          facultyId: toNumber(data.facultyId),
        },
      }),
      invalidatesTags: ['Department', 'Stats'],
    }),

    updateDepartment: builder.mutation<ApiResponse<Department>, { id: string; data: Partial<CreateDepartmentRequest> }>({
      query: ({ id, data }) => ({
        url: `/department/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Department', id }, 'Department'],
    }),

    deleteDepartment: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/department/${id}`,
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
        return `/admin/users/all?${params.toString()}`;
      },
      providesTags: ['User'],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/admin/users/all/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    updateUser: builder.mutation<ApiResponse<User>, { id: string; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/admin/users/all/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User', 'Stats'],
    }),

    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/admin/users/all/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Stats'],
    }),

    toggleUserStatus: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/admin/users/all/${id}/toggle-status`,
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

    // Course Management (Modules)
    getCourses: builder.query<ApiResponse<Course[]>, void>({
      query: () => '/module',
      transformResponse: (response: any): ApiResponse<Course[]> => {
        const rawData = safeArray(response?.data?.moduleData ?? response?.data?.data?.moduleData ?? response?.data);
        return {
          success: true,
          message: 'Courses fetched successfully',
          data: rawData.map((module: any) => ({
            id: String(module?.id ?? ''),
            name: module?.moduleName ?? '',
            code: module?.moduleCode ?? '',
            description: module?.description,
            lecturers: (module?.moduleLecturers ?? []).map((ml: any) => ({
              id: String(ml?.lecturer?.id ?? ''),
              firstName: ml?.lecturer?.user?.firstName ?? '',
              lastName: ml?.lecturer?.user?.lastName ?? '',
            })),
            isActive: true,
            createdAt: module?.createdAt ?? new Date().toISOString(),
            updatedAt: module?.updatedAt ?? module?.createdAt ?? new Date().toISOString(),
          })),
        };
      },
      providesTags: ['Course'],
    }),

    getCourseById: builder.query<ApiResponse<Course>, string>({
      query: (id) => `/module/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),

    getCoursesByDepartment: builder.query<ApiResponse<Course[]>, string>({
      query: (departmentId) => `/module/department/${departmentId}`,
      providesTags: ['Course'],
    }),

    createCourse: builder.mutation<ApiResponse<Course>, CreateCourseRequest>({
      query: (data) => ({
        url: '/module',
        method: 'POST',
        body: {
          moduleName: data.name,
          moduleCode: data.code,
          description: data.description,
          lecturerIds: (data.lecturerIds ?? []).map(Number).filter(Boolean),
        },
      }),
      invalidatesTags: ['Course'],
    }),

    updateCourse: builder.mutation<ApiResponse<Course>, { id: string; data: Partial<CreateCourseRequest> }>({
      query: ({ id, data }) => ({
        url: `/module/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Course', id }, 'Course'],
    }),

    deleteCourse: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/module/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),

    // Class Management
    getClasses: builder.query<ApiResponse<Class[]>, void>({
      query: () => '/classes',
      transformResponse: (response: any): ApiResponse<Class[]> => {
        const raw = response?.data;
        const arr = Array.isArray(raw) ? raw : (raw?.data ?? []);
        return {
          success: true,
          message: 'Classes fetched successfully',
          data: arr.map((item: any) => ({
            id: String(item?.id ?? ''),
            name: item?.name ?? '',
            code: item?.code ?? '',
            facultyId: String(item?.facultyId ?? ''),
            departmentId: String(item?.departmentId ?? ''),
            levelId: String(item?.levelId ?? ''),
            semesterId: item?.semesterId ? String(item.semesterId) : undefined,
            capacity: item?.capacity ?? 50,
            faculty: item?.faculty ?? undefined,
            department: item?.department ?? undefined,
            level: item?.level ?? undefined,
            semester: item?.semester ?? undefined,
            _count: item?._count ?? undefined,
            createdAt: item?.createdAt ?? '',
            updatedAt: item?.updatedAt ?? '',
          })),
        };
      },
      providesTags: ['Class'],
    }),

    getClassById: builder.query<ApiResponse<Class>, string>({
      query: (id) => `/classes/${id}`,
      transformResponse: (response: any): ApiResponse<Class> => ({
        success: true,
        message: 'Class fetched',
        data: {
          id: String(response?.data?.id ?? ''),
          name: response?.data?.name ?? '',
          code: response?.data?.code ?? '',
          facultyId: String(response?.data?.facultyId ?? ''),
          departmentId: String(response?.data?.departmentId ?? ''),
          levelId: String(response?.data?.levelId ?? ''),
          semesterId: response?.data?.semesterId ? String(response.data.semesterId) : undefined,
          capacity: response?.data?.capacity ?? 50,
          faculty: response?.data?.faculty,
          department: response?.data?.department,
          level: response?.data?.level,
          semester: response?.data?.semester,
          timeTable: safeArray(response?.data?.timeTable),
          createdAt: response?.data?.createdAt ?? '',
          updatedAt: response?.data?.updatedAt ?? '',
        },
      }),
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
        body: {
          name: data.name,
          code: data.code,
          facultyId: toNumber(data.facultyId),
          departmentId: toNumber(data.departmentId),
          levelName: data.levelName,
          semesterName: data.semesterName || undefined,
          capacity: data.capacity,
        },
      }),
      invalidatesTags: ['Class'],
    }),

    updateClass: builder.mutation<ApiResponse<Class>, { id: string; data: Partial<CreateClassRequest> }>({
      query: ({ id, data }) => ({
        url: `/classes/${id}`,
        method: 'PATCH',
        body: {
          name: data.name,
          code: data.code,
          facultyId: data.facultyId ? toNumber(data.facultyId) : undefined,
          departmentId: data.departmentId ? toNumber(data.departmentId) : undefined,
          levelName: data.levelName || undefined,
          semesterName: data.semesterName,
          capacity: data.capacity,
        },
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

    // Timetable Management
    getTimetablesByClass: builder.query<ApiResponse<Timetable[]>, string>({
      query: (classId) => `/timetable/class/${classId}`,
      transformResponse: (response: any): ApiResponse<Timetable[]> => ({
        success: true,
        message: 'Timetable fetched',
        data: safeArray(response?.data).map((item: any) => ({
          id: String(item.id),
          classId: String(item.classId),
          moduleId: String(item.moduleId ?? ''),
          lecturerId: item.lecturerId ? String(item.lecturerId) : undefined,
          classroomId: item.classroomId ? String(item.classroomId) : undefined,
          day: item.day ?? '',
          startTime: item.startTime ?? '',
          endTime: item.endTime ?? '',
          module: item.module ?? undefined,
          lecturer: item.lecturer ?? undefined,
          classroom: item.classroom ?? undefined,
          createdAt: item.createdAt ?? '',
          updatedAt: item.updatedAt ?? '',
        })),
      }),
      providesTags: (result, error, classId) => [{ type: 'Class', id: `tt-${classId}` }],
    }),

    createTimetable: builder.mutation<ApiResponse<Timetable>, CreateTimetableRequest>({
      query: (data) => ({
        url: '/timetable',
        method: 'POST',
        body: {
          classId: toNumber(data.classId),
          moduleId: toNumber(data.moduleId),
          lecturerId: data.lecturerId ? toNumber(data.lecturerId) : undefined,
          classroomId: data.classroomId ? toNumber(data.classroomId) : undefined,
          day: data.day,
          startTime: data.startTime,
          endTime: data.endTime,
        },
      }),
      invalidatesTags: (result, error, data) => [{ type: 'Class', id: `tt-${data.classId}` }, { type: 'Class', id: String(data.classId) }],
    }),

    updateTimetable: builder.mutation<ApiResponse<Timetable>, { id: string; data: Partial<CreateTimetableRequest> }>({
      query: ({ id, data }) => ({
        url: `/timetable/${id}`,
        method: 'PATCH',
        body: {
          moduleId: data.moduleId ? toNumber(data.moduleId) : undefined,
          lecturerId: data.lecturerId ? toNumber(data.lecturerId) : undefined,
          classroomId: data.classroomId ? toNumber(data.classroomId) : undefined,
          day: data.day,
          startTime: data.startTime,
          endTime: data.endTime,
        },
      }),
      invalidatesTags: (result, error, { data }) => [{ type: 'Class', id: `tt-${data.classId}` }],
    }),

    deleteTimetable: builder.mutation<ApiResponse<void>, { id: string; classId: string }>({
      query: ({ id }) => ({ url: `/timetable/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { classId }) => [{ type: 'Class', id: `tt-${classId}` }],
    }),

    // Classroom Management
    getClassrooms: builder.query<ApiResponse<Classroom[]>, void>({
      query: () => '/classrooms',
      transformResponse: (response: any): ApiResponse<Classroom[]> => ({
        success: true,
        message: 'Classrooms fetched',
        data: safeArray(response?.data).map((item: any) => ({
          id: String(item.id),
          name: item.name ?? '',
          location: item.location ?? '',
          capacity: item.capacity ?? undefined,
          createdAt: item.createdAt ?? '',
          updatedAt: item.updatedAt ?? '',
        })),
      }),
      providesTags: ['Timetable'],
    }),

    createClassroom: builder.mutation<ApiResponse<Classroom>, CreateClassroomRequest>({
      query: (data) => ({ url: '/classrooms', method: 'POST', body: data }),
      invalidatesTags: ['Timetable'],
    }),

    updateClassroom: builder.mutation<ApiResponse<Classroom>, { id: string; data: Partial<CreateClassroomRequest> }>({
      query: ({ id, data }) => ({ url: `/classrooms/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Timetable'],
    }),

    deleteClassroom: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/classrooms/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Timetable'],
    }),

    // Student Management
    getStudents: builder.query<ApiResponse<Student[]>, { page?: number; limit?: number; departmentId?: string }>({
      query: ({ page = 1, limit = 10, departmentId } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (departmentId) params.append('departmentId', departmentId);
        // Backend route: GET /api/v1/admin/users/student
        return `/users/student?${params.toString()}`;
      },
      transformResponse: (response: any): ApiResponse<any[]> => {
        const studentData = response?.studentData ?? response?.data ?? {};
        const students = safeArray(studentData?.studentData ?? studentData?.data);
        return {
          success: true,
          message: 'Students fetched successfully',
          data: students.map(mapStudent),
        };
      },
      providesTags: ['Student'],
    }),

    // Fetch all students by walking backend cursor pagination, then filter on client pages.
    getAllStudents: builder.query<PaginatedApiResponse<any[]>, { limit?: number }>({
      async queryFn({ limit = 200 } = {}, _queryApi, _extraOptions, fetchWithBQ) {
        let cursor: number | null = null;
        let hasMore = true;
        let guard = 0;
        const merged: any[] = [];

        while (hasMore && guard < 100) {
          const params = new URLSearchParams({
            page: String(limit),
          });
          if (cursor !== null) params.append('cursor', String(cursor));

          const response = await fetchWithBQ(`/users/student?${params.toString()}`);
          if (response.error) {
            return { error: response.error as any };
          }

          const payload = response.data as any;
          const studentData = payload?.studentData ?? payload?.data ?? {};
          const rows = safeArray(studentData?.studentData ?? studentData?.data);
          merged.push(...rows);

          const pagination = studentData?.pagination ?? {};
          hasMore = Boolean(pagination?.hasMore);
          cursor = typeof pagination?.nextCursor === 'number' ? pagination.nextCursor : null;
          guard += 1;
        }

        return {
          data: {
            success: true,
            message: 'Students fetched successfully',
            data: merged.map(mapStudent),
            total: merged.length,
            hasMore: false,
            nextCursor: null,
            prevCursor: null,
          },
        };
      },
      providesTags: ['Student'],
    }),

    getStudentById: builder.query<ApiResponse<Student>, string>({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    createStudent: builder.mutation<ApiResponse<Student>, any>({
      query: (body) => ({
        url: '/users/student',
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
    getStudentDetails: builder.query<ApiResponse<{ student: any; stats: any }>, string>({
      query: (id) => `/users/student/${id}`,
      transformResponse: (response: any) => {
        const student = response?.studentData ?? response?.data ?? null;
        return {
          success: true,
          message: 'Student details fetched successfully',
          data: {
            student: student ? mapStudent(student) : null,
            stats: {
              totalCredits: 0,
              completedCredits: 0,
              averageGPA: 0,
              enrolledCourses: 0,
              completedCourses: 0,
              attendanceRate: 0,
            },
          },
        };
      },
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    // Delete student from users
    deleteStudentFromUsers: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/student/${id}`,
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
        // Backend route: GET /api/v1/admin/users/lecturer
        return `/users/lecturer?${params.toString()}`;
      },
      transformResponse: (response: any): ApiResponse<any[]> => {
        const lecturerData = response?.lecturerData ?? response?.data ?? {};
        const lecturers = safeArray(lecturerData?.lecturerData ?? lecturerData?.data);
        return {
          success: true,
          message: 'Lecturers fetched successfully',
          data: lecturers.map(mapLecturer),
        };
      },
      providesTags: ['Lecturer'],
    }),

    // Fetch all lecturers by walking backend cursor pagination, then filter on client pages.
    getAllLecturers: builder.query<PaginatedApiResponse<any[]>, { limit?: number }>({
      async queryFn({ limit = 200 } = {}, _queryApi, _extraOptions, fetchWithBQ) {
        let cursor: number | null = null;
        let hasMore = true;
        let guard = 0;
        const merged: any[] = [];

        while (hasMore && guard < 100) {
          const params = new URLSearchParams({
            page: String(limit),
          });
          if (cursor !== null) params.append('cursor', String(cursor));

          const response = await fetchWithBQ(`/users/lecturer?${params.toString()}`);
          if (response.error) {
            return { error: response.error as any };
          }

          const payload = response.data as any;
          const lecturerData = payload?.lecturerData ?? payload?.data ?? {};
          const rows = safeArray(lecturerData?.lecturerData ?? lecturerData?.data);
          merged.push(...rows);

          const pagination = lecturerData?.pagination ?? {};
          hasMore = Boolean(pagination?.hasMore);
          cursor = typeof pagination?.nextCursor === 'number' ? pagination.nextCursor : null;
          guard += 1;
        }

        return {
          data: {
            success: true,
            message: 'Lecturers fetched successfully',
            data: merged.map(mapLecturer),
            total: merged.length,
            hasMore: false,
            nextCursor: null,
            prevCursor: null,
          },
        };
      },
      providesTags: ['Lecturer'],
    }),

    getLecturerById: builder.query<ApiResponse<Lecturer>, string>({
      query: (id) => `/lecturers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lecturer', id }],
    }),

    createLecturer: builder.mutation<ApiResponse<Lecturer>, any>({
      query: (data) => ({
        url: '/users/lecturer',
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
    getLecturerDetails: builder.query<ApiResponse<{ lecturer: any; stats: any }>, string>({
      query: (id) => `/users/lecturer/${id}`,
      transformResponse: (response: any) => {
        const lecturer = response?.lecturerData ?? response?.data ?? null;
        return {
          success: true,
          message: 'Lecturer details fetched successfully',
          data: {
            lecturer: lecturer ? mapLecturer(lecturer) : null,
            stats: {
              totalCourses: 0,
              totalStudents: 0,
              averageRating: 0,
              yearsOfExperience: 0,
            },
          },
        };
      },
      providesTags: (result, error, id) => [{ type: 'Lecturer', id }],
    }),

    // Delete lecturer from users
    deleteLecturerFromUsers: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/users/lecturer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lecturer', 'Stats'],
    }),

    // Get lecturer's students (students enrolled in modules they teach)
    getMyStudents: builder.query<ApiResponse<{ students: any[]; classes: any[] }>, void>({
      query: () => '/users/lecturer/my-students',
      transformResponse: (response: any) => ({
        success: true,
        message: response?.message || 'Students fetched successfully',
        data: response?.data || { students: [], classes: [] },
      }),
    }),

    // Get lecturer's classes (classes for modules they teach)
    getMyClasses: builder.query<ApiResponse<any[]>, void>({
      query: () => '/users/lecturer/my-classes',
      transformResponse: (response: any) => ({
        success: true,
        message: response?.message || 'Classes fetched successfully',
        data: response?.data || [],
      }),
    }),

    // Get modules assigned to the authenticated lecturer
    getLecturerAssignedModules: builder.query<ApiResponse<any[]>, void>({
      query: () => '/users/lecturer/assign-module',
      transformResponse: (response: any) => ({
        success: true,
        message: response?.message || 'Modules fetched successfully',
        data: response?.data || [],
      }),
    }),

    // Get timetable/schedule for the authenticated lecturer
    getLecturerSchedule: builder.query<ApiResponse<any[]>, void>({
      query: () => '/users/lecturer/lecturer-timetable',
      transformResponse: (response: any) => ({
        success: true,
        message: response?.message || 'Timetable fetched successfully',
        data: response?.data || [],
      }),
    }),

    // Level Management
    getLevels: builder.query<ApiResponse<Array<{ id: number; levelName: string }>>, void>({
      query: () => '/level',
      transformResponse: (response: any) => ({
        success: true,
        message: 'Levels fetched successfully',
        data: safeArray(response?.data),
      }),
      providesTags: ['Student'],
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
      query: () => '/semester',
      providesTags: ['Semester'],
    }),

    getSemesterById: builder.query<ApiResponse<Semester>, string>({
      query: (id) => `/semester/${id}`,
      providesTags: (result, error, id) => [{ type: 'Semester', id }],
    }),

    createSemester: builder.mutation<ApiResponse<Semester>, CreateSemesterRequest>({
      query: (data) => ({
        url: '/semester',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Semester'],
    }),

    updateSemester: builder.mutation<ApiResponse<Semester>, { id: string; data: Partial<CreateSemesterRequest> }>({
      query: ({ id, data }) => ({
        url: `/semester/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Semester', id }, 'Semester'],
    }),

    deleteSemester: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/semester/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Semester'],
    }),

    // Communication: Messages
    getMessageRecipients: builder.query<ApiResponse<MessageRecipient[]>, { query?: string } | void>({
      query: (params) => {
        const query = params?.query?.trim();
        return query
          ? `/communication/admin/messages/recipients?query=${encodeURIComponent(query)}`
          : '/communication/admin/messages/recipients';
      },
      transformResponse: (response: any): ApiResponse<MessageRecipient[]> => ({
        success: true,
        message: 'Recipients fetched successfully',
        data: safeArray(response?.data),
      }),
      providesTags: ['Message'],
    }),

    getAdminMessages: builder.query<ApiResponse<AdminMessage[]>, { recipientUserId?: number | string } | void>({
      query: (params) => {
        const recipientUserId = params?.recipientUserId;
        return recipientUserId !== undefined && recipientUserId !== null && String(recipientUserId) !== ''
          ? `/communication/admin/messages?recipientUserId=${encodeURIComponent(String(recipientUserId))}`
          : '/communication/admin/messages';
      },
      transformResponse: (response: any): ApiResponse<AdminMessage[]> => ({
        success: true,
        message: 'Messages fetched successfully',
        data: safeArray(response?.data),
      }),
      providesTags: ['Message'],
    }),

    sendAdminMessage: builder.mutation<ApiResponse<AdminMessage>, SendAdminMessageRequest>({
      query: (data) => ({
        url: '/communication/admin/messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message'],
    }),

    // ---- Attendance Management ----
    markAttendance: builder.mutation<ApiResponse<any[]>, { classId: number; date: string; records: Array<{ studentId: number; status: string; note?: string }> }>({
      query: (data) => ({ url: '/attendance', method: 'POST', body: data }),
      invalidatesTags: ['Student'],
    }),

    getAllAttendance: builder.query<ApiResponse<any[]>, { classId?: number; studentId?: number; date?: string } | void>({
      query: (params) => {
        const p = new URLSearchParams();
        if (params?.classId) p.set('classId', String(params.classId));
        if (params?.studentId) p.set('studentId', String(params.studentId));
        if (params?.date) p.set('date', params.date);
        const qs = p.toString();
        return `/attendance${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Student'],
    }),

    getAttendanceByClass: builder.query<ApiResponse<any[]>, { classId: number; date?: string }>({
      query: ({ classId, date }) => `/attendance/class/${classId}${date ? `?date=${date}` : ''}`,
      providesTags: ['Student'],
    }),

    getClassStudentsForAttendance: builder.query<ApiResponse<any[]>, number>({
      query: (classId) => `/attendance/class/${classId}/students`,
      providesTags: ['Student'],
    }),

    getStudentAttendance: builder.query<ApiResponse<any[]>, number>({
      query: (studentId) => `/attendance/student/${studentId}`,
      providesTags: ['Student'],
    }),

    updateAttendanceRecord: builder.mutation<ApiResponse<any>, { id: number; status: string; note?: string }>({
      query: ({ id, ...data }) => ({ url: `/attendance/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Student'],
    }),

    // ---- Assignment Management ----
    createAssignment: builder.mutation<ApiResponse<any>, { moduleId: number; title: string; description?: string; dueDate: string; maxScore?: number }>({
      query: (data) => ({ url: '/assignment', method: 'POST', body: data }),
      invalidatesTags: ['Course'],
    }),

    getAdminAssignments: builder.query<ApiResponse<any[]>, void>({
      query: () => '/assignment',
      providesTags: ['Course'],
    }),

    getAssignmentsByModule: builder.query<ApiResponse<any[]>, number>({
      query: (moduleId) => `/assignment/module/${moduleId}`,
      providesTags: ['Course'],
    }),

    updateAssignment: builder.mutation<ApiResponse<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/assignment/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Course'],
    }),

    deleteAssignment: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/assignment/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Course'],
    }),

    // ---- Notice Management ----
    createNotice: builder.mutation<ApiResponse<any>, { title: string; body: string; moduleId?: number; visibility?: string }>({
      query: (data) => ({ url: '/notice', method: 'POST', body: data }),
      invalidatesTags: ['Stats'],
    }),

    getAdminNotices: builder.query<ApiResponse<any[]>, void>({
      query: () => '/notice',
      providesTags: ['Stats'],
    }),

    getNoticesByModule: builder.query<ApiResponse<any[]>, number>({
      query: (moduleId) => `/notice/module/${moduleId}`,
      providesTags: ['Stats'],
    }),

    updateNotice: builder.mutation<ApiResponse<any>, { id: number; data: any }>({
      query: ({ id, data }) => ({ url: `/notice/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Stats'],
    }),

    deleteNotice: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({ url: `/notice/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Stats'],
    }),

    // Communication: Calendar Events
    getAdminCalendarEvents: builder.query<ApiResponse<CalendarEvent[]>, void>({
      query: () => '/communication/admin/events',
      transformResponse: (response: any): ApiResponse<CalendarEvent[]> => ({
        success: true,
        message: 'Calendar events fetched successfully',
        data: safeArray(response?.data),
      }),
      providesTags: ['CalendarEvent'],
    }),

    createAdminCalendarEvent: builder.mutation<ApiResponse<CalendarEvent>, CreateCalendarEventRequest>({
      query: (data) => ({
        url: '/communication/admin/events',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CalendarEvent'],
    }),

    updateAdminCalendarEvent: builder.mutation<ApiResponse<CalendarEvent>, { id: string; data: Partial<CreateCalendarEventRequest> }>({
      query: ({ id, data }) => ({
        url: `/communication/admin/events/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['CalendarEvent'],
    }),

    getVisibleCalendarEvents: builder.query<ApiResponse<CalendarEvent[]>, void>({
      query: () => '/communication/events/me',
      transformResponse: (response: any): ApiResponse<CalendarEvent[]> => ({
        success: true,
        message: 'Visible events fetched successfully',
        data: safeArray(response?.data),
      }),
      providesTags: ['CalendarEvent'],
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

  // Timetable hooks
  useGetTimetablesByClassQuery,
  useCreateTimetableMutation,
  useUpdateTimetableMutation,
  useDeleteTimetableMutation,

  // Classroom hooks
  useGetClassroomsQuery,
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,

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
  useGetMyStudentsQuery,
  useGetMyClassesQuery,
  useGetLecturerAssignedModulesQuery,
  useGetLecturerScheduleQuery,
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
  useGetLevelsQuery,

  // Communication hooks
  useGetMessageRecipientsQuery,
  useGetAdminMessagesQuery,
  useSendAdminMessageMutation,
  useGetAdminCalendarEventsQuery,
  useCreateAdminCalendarEventMutation,
  useUpdateAdminCalendarEventMutation,
  useGetVisibleCalendarEventsQuery,

  // Attendance hooks
  useMarkAttendanceMutation,
  useGetAllAttendanceQuery,
  useGetAttendanceByClassQuery,
  useGetClassStudentsForAttendanceQuery,
  useGetStudentAttendanceQuery,
  useUpdateAttendanceRecordMutation,

  // Assignment hooks
  useCreateAssignmentMutation,
  useGetAdminAssignmentsQuery,
  useGetAssignmentsByModuleQuery,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,

  // Notice hooks
  useCreateNoticeMutation,
  useGetAdminNoticesQuery,
  useGetNoticesByModuleQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = adminApi;
