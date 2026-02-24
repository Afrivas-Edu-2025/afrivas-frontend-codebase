import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API response and form data types (reuse from your file)
type ApiResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export type SignupFormData = {
  fullname: string;
  email: string;
  sex: string;
  dob: string;
  role: string;
  username: string;
  password: string;
  year?: string;
  semester?: string;
  faculty?: string;
  department?: string;
};

// Create the API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050', // Base URL
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<ApiResponse, SignupFormData>({
      query: (formData) => {
        // Split fullname into firstName and lastName
        const nameParts = formData.fullname.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // Format date and gender
        const dob = formData.dob;
        const gender = formData.sex.toUpperCase();
        const institutionId = '550e8400-e29b-41d4-a716-446655440000';

        // Prepare request based on role
        let url = '';
        let requestData = {};

        if (formData.role.toLowerCase() === 'student') {
          url = '/api/v1/auth/signup';
          requestData = {
            email: formData.email,
            password: formData.password,
            firstName,
            lastName,
            gender,
            dob,
            role: 'STUDENT',
            institutionId,
          };
        } else if (formData.role.toLowerCase() === 'lecturer') {
          url = '/api/v1/lecturer/signup';
          requestData = {
            firstName,
            lastName,
            email: formData.email,
            password: formData.password,
            gender,
            dob,
            department: formData.department,
            institutionId,
          };
        } else {
          throw new Error('Invalid role selected');
        }

        return {
          url,
          method: 'POST',
          body: requestData,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      transformResponse: (response: any): ApiResponse => ({
        success: true,
        message: 'Registration successful',
        data: response,
      }),
      transformErrorResponse: (response: any): ApiResponse => ({
        success: false,
        message: response.data?.message || 'Registration failed',
      }),
    }),
    // Add more endpoints (e.g., login) as needed
    loginUser: builder.mutation<ApiResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/api/v1/auth/login', // Adjust URL based on your API
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
export const { useRegisterUserMutation, useLoginUserMutation } = authApi;