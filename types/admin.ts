// Admin Dashboard Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'STUDENT' | 'LECTURER' | 'ADMIN';
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: 'STUDENT';
  studentId?: string;
  courseId?: number;
  departmentId?: number;
  course?: Course;
  department?: Department;
  grades?: Grade[];
  classes?: Class[];
}

export interface Lecturer extends User {
  role: 'LECTURER';
  lecturerId?: string;
  departmentId?: number;
  department?: Department;
  courses?: Course[];
  classes?: Class[];
}

export interface Faculty {
  id: number;
  name: string;
  description?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  departments?: Department[];
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  facultyId: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  faculty?: Faculty;
  courses?: Course[];
  users?: User[];
}

export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  departmentId: number;
  lecturerId?: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  lecturer?: Lecturer;
  classes?: Class[];
  grades?: Grade[];
}

export interface Class {
  id: number;
  name: string;
  courseId: number;
  lecturerId?: number;
  schedule?: string;
  location?: string;
  capacity?: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  course?: Course;
  lecturer?: Lecturer;
  students?: Student[];
  grades?: Grade[];
}

export interface Grade {
  id: number;
  value: number;
  grade: string;
  studentId: number;
  courseId: number;
  classId?: number;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  course?: Course;
  class?: Class;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
}

// Form Types
export interface StudentForm {
  username: string;
  email: string;
  password?: string;
  studentId?: string;
  courseId?: number;
  departmentId?: number;
}

export interface LecturerForm {
  username: string;
  email: string;
  password?: string;
  lecturerId?: string;
  departmentId?: number;
}

export interface CourseForm {
  code: string;
  name: string;
  description?: string;
  credits: number;
  departmentId: number;
  lecturerId?: number;
}

export interface ClassForm {
  name: string;
  courseId: number;
  lecturerId?: number;
  schedule?: string;
  location?: string;
  capacity?: number;
}

export interface GradeForm {
  value: number;
  grade: string;
  studentId: number;
  courseId: number;
  classId?: number;
}

export interface FacultyForm {
  name: string;
  description?: string;
}

export interface DepartmentForm {
  name: string;
  description?: string;
  facultyId: number;
}

// Search and Filter Types
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  approved?: boolean;
}

export interface FilterOptions {
  departments?: number[];
  courses?: number[];
  faculties?: number[];
  roles?: string[];
  approved?: boolean;
}
