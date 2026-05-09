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

export type LoginUserRequest = {
  email: string;
  password: string;
  clientContext?: Record<string, unknown>;
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
        message: response.data?.error?.message || response.data?.message || 'Login failed',
        data: response.data?.error?.details || response.data?.errors || [],
      }),
    }),

    forgotPassword: builder.mutation<ApiResponse, { email: string }>({
      query: (data) => ({ url: '/auth/forgot-password', method: 'POST', body: data }),
      transformResponse: (response: any): ApiResponse => ({
        success: response.status === 'success',
        message: response.message || 'Reset link sent',
        data: null,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        message: response.data?.error?.message || response.data?.message || 'Failed to send reset link',
        data: [],
      }),
    }),

    resetPassword: builder.mutation<ApiResponse, { token: string; newPassword: string }>({
      query: (data) => ({ url: '/auth/reset-password', method: 'POST', body: data }),
      transformResponse: (response: any): ApiResponse => ({
        success: response.status === 'success',
        message: response.message || 'Password updated',
        data: null,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        message: response.data?.error?.message || response.data?.message || 'Failed to reset password',
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
