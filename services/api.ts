import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API response and form data types (reuse from your file)
type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

// Create the API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1', // Base URL
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<ApiResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login', // Adjust URL based on your API
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response: any): ApiResponse => ({
        success: true,
        message: 'Login successful',
        data: response,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        message: response.data?.message || 'Login failed',
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginUserMutation } = authApi;