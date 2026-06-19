import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api/v1';

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const candidates = [localStorage.getItem('authToken'), localStorage.getItem('accessToken')].filter(Boolean);
  for (const t of candidates) {
    if (!t) continue;
    try {
      const parts = t.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (typeof payload?.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000)) return t;
      }
    } catch {}
  }
  return null;
};

// ---- Types ----

export type EnrolledCourse = {
  id: number;
  moduleId: number;
  status: string;
  finalPercentage: number;
  letterGrade: string;
  gradePoint: number;
  module: {
    id: number;
    moduleName: string;
    moduleCode: string;
    moduleLecturers?: Array<{
      lecturer: { user: { firstName: string; lastName: string } };
    }>;
    timeTable?: Array<{ day: string; startTime: string; endTime: string }>;
  };
  semester: { semesterName: string; year: number };
};

export type GradeRecord = {
  id: number;
  moduleId: number;
  status: string;
  finalPercentage: number;
  letterGrade: string;
  gradePoint: number;
  module: { moduleName: string; moduleCode: string; creditHour: number };
  semester: { semesterName: string; year: number };
  grade: Array<{
    id: number;
    score: number;
    percentage: number;
    status: string;
    assessment: { title: string; type: string; maxScore: number; weight: number; dueDate: string };
  }>;
};

export type AttendanceRecord = {
  id: number;
  classId: number;
  studentId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  note?: string;
  class: {
    id: number;
    day: string;
    module: { moduleName: string; moduleCode: string };
  };
};

export type AttendanceSummary = {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
};

export type Assignment = {
  id: number;
  moduleId: number;
  title: string;
  description?: string;
  dueDate: string;
  filePath?: string;
  fileType?: string;
  maxScore: number;
  createdAt: string;
  module: { moduleName: string; moduleCode: string };
};

export type Notice = {
  id: number;
  moduleId?: number;
  title: string;
  body: string;
  visibility: 'ALL' | 'STUDENTS' | 'LECTURERS';
  createdAt: string;
  module?: { moduleName: string; moduleCode: string };
};

export type Note = {
  id: number;
  moduleId: number;
  title: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  module: { moduleName: string; moduleCode: string };
};

export type TimetableEntry = {
  id: number;
  moduleId: number;
  classId: number;
  day: string;
  startTime: string;
  endTime: string;
  module: {
    id: number;
    moduleName: string;
    moduleCode: string;
    moduleLecturers?: Array<{
      lecturer: { user: { firstName: string; lastName: string } };
    }>;
  };
  class?: { id: number; name: string; code: string };
  classroom?: { name: string; location: string | null } | null;
};

export type StudentDashboardStats = {
  enrolledCourses: number;
  completedCourses: number;
  attendanceRate: number;
  averageGPA: number;
};

// ---- API slice ----

export const studentApi = createApi({
  reducerPath: 'studentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['MyCourses', 'MyGrades', 'MyAttendance', 'MyAssignments', 'MyNotes', 'MyTimetable', 'MyStats', 'MyNotices'],
  endpoints: (builder) => ({
    // Student self-service
    getMyCourses: builder.query<{ status: string; data: EnrolledCourse[] }, void>({
      query: () => '/me/student/courses',
      providesTags: ['MyCourses'],
    }),

    getMyGrades: builder.query<{ status: string; data: GradeRecord[] }, void>({
      query: () => '/me/student/grades',
      providesTags: ['MyGrades'],
    }),

    getMyAttendance: builder.query<{ status: string; data: AttendanceRecord[]; summary: AttendanceSummary }, void>({
      query: () => '/attendance/me',
      providesTags: ['MyAttendance'],
    }),

    getMyAssignments: builder.query<{ status: string; data: Assignment[] }, void>({
      query: () => '/assignment/me/all',
      providesTags: ['MyAssignments'],
    }),

    getMyNotes: builder.query<{ status: string; data: Note[] }, void>({
      query: () => '/me/student/notes',
      providesTags: ['MyNotes'],
    }),

    getMyTimetable: builder.query<{ status: string; data: TimetableEntry[] }, void>({
      query: () => '/me/student/timetable',
      providesTags: ['MyTimetable'],
    }),

    getMyDashboardStats: builder.query<{ status: string; data: StudentDashboardStats }, void>({
      query: () => '/me/student/stats',
      providesTags: ['MyStats'],
    }),

    getMyNotices: builder.query<{ status: string; data: Notice[] }, void>({
      query: () => '/notice/me/all',
      providesTags: ['MyNotices'],
    }),
  }),
});

export const {
  useGetMyCoursesQuery,
  useGetMyGradesQuery,
  useGetMyAttendanceQuery,
  useGetMyAssignmentsQuery,
  useGetMyNotesQuery,
  useGetMyTimetableQuery,
  useGetMyDashboardStatsQuery,
  useGetMyNoticesQuery,
} = studentApi;
