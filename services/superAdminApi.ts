import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/lib/store';

export const superAdminApi = createApi({
    reducerPath: 'superAdminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api/v1'}/super-admin`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['University', 'SuperAdmin'],
    endpoints: (builder) => ({
        getUniversities: builder.query<any, void>({
            query: () => '/university',
            providesTags: ['University'],
        }),
        createUniversity: builder.mutation<any, any>({
            query: (data) => ({
                url: '/university',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['University'],
        }),
        getSuperAdmins: builder.query<any, void>({
            query: () => '/',
            providesTags: ['SuperAdmin'],
        }),
        createSuperAdmin: builder.mutation<any, any>({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['SuperAdmin'],
        }),
    }),
});

export const {
    useGetUniversitiesQuery,
    useCreateUniversityMutation,
    useGetSuperAdminsQuery,
    useCreateSuperAdminMutation,
} = superAdminApi;
