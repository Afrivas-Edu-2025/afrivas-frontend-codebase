import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
    baseUrl: 'http://0.0.0.0:3303/api/v1', // Base URL for API
  }),
  endpoints: (builder) => ({
    // General signup mutation
    signupUser: builder.mutation<ApiResponse, SignupUserRequest>({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
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
    // Login mutation
    loginUser: builder.mutation<ApiResponse, LoginUserRequest>({
      query: (data) => ({
        url: '/auth/signin',
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
      }),
      transformResponse: (response: any): ApiResponse => ({
        success: response.success,
        message: response.message || 'Login successful',
        data: response.data,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        message: response.data?.message || 'Login failed',
        data: response.data?.errors || [],
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useSignupUserMutation, useLoginUserMutation } = authApi;