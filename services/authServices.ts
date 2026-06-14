import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export type SignupUserRequest = {
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

// login now uses username, not email
export type LoginUserRequest = {
  username: string;
  password: string;
  clientContext?: Record<string, unknown>;
};

// forgot password requires username + role
export type ForgotPasswordRequest = {
  username: string;
  role: 'ADMIN' | 'LECTURER' | 'STUDENT';
};

// reset password requires code (from email link), password, and role
export type ResetPasswordRequest = {
  code: string;
  password: string;
  role: 'ADMIN' | 'LECTURER' | 'STUDENT';
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signupUser: builder.mutation<ApiResponse, SignupUserRequest>({
      query: (data) => ({ url: '/auth/signup', method: 'POST', body: data }),
      transformResponse: (response: any): ApiResponse => ({
        success: response.success,
        message: response.message || 'User registration successful',
        data: response.data,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        message: response.data?.message || 'User registration failed',
        data: response.data?.errors || [],
      }),
    }),

    loginUser: builder.mutation<ApiResponse, LoginUserRequest>({
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
      transformResponse: (response: any): ApiResponse => ({
        success: response.status === 'success',
        message: response.message || 'Login successful',
        data: response.data,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        message: response.data?.message || 'Login failed',
        data: [],
      }),
    }),

    // endpoint changed: /auth/forgot-password → /password/forget-password
    // body changed: { email } → { username, role }
    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: (data) => ({ url: '/password/forget-password', method: 'POST', body: data }),
      transformResponse: (response: any): ApiResponse => ({
        success: true,
        message: response.message || 'Reset code sent',
        data: null,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        message: response.data?.message || 'Failed to send reset code',
        data: [],
      }),
    }),

    // endpoint changed: /auth/reset-password → /password/update-password
    // body changed: { token, newPassword } → { code, password, role }
    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (data) => ({ url: '/password/update-password', method: 'POST', body: data }),
      transformResponse: (response: any): ApiResponse => ({
        success: true,
        message: response.message || 'Password updated',
        data: null,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        message: response.data?.message || 'Failed to reset password',
        data: [],
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
