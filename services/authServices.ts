import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useAuth } from '../components/auth-context';

// Define types for API responses
type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

// Define types for request payloads
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
};

// Create the API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signupUser: builder.mutation<ApiResponse, SignupUserRequest>({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
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
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any): ApiResponse => ({
        success: response.success,
        message: response.message || 'Login successful',
        data: response.data,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        // Backend sends { error: { message, details } }
        message: response.data?.error?.message || response.data?.message || 'Login failed',
        data: response.data?.error?.details || response.data?.errors || [],
      }),
    }),
  }),
});

export const { useSignupUserMutation, useLoginUserMutation } = authApi;
