import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api/v1'

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('authToken')
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['Student', 'Lecturer', 'Faculty', 'Department', 'Level', 'Module', 'Semester'],
    endpoints: (builder) => ({
        getStudents: builder.query<any, { page?: number; cursor?: number }>({
            query: (params) => ({
                url: '/users/student',
                params,
            }),
            providesTags: ['Student'],
        }),
        getLecturers: builder.query<any, { page?: number; cursor?: number }>({
            query: (params) => ({
                url: '/users/lecturer',
                params,
            }),
            providesTags: ['Lecturer'],
        }),
        getFaculties: builder.query<any, void>({
            query: () => '/faculty',
            providesTags: ['Faculty'],
        }),
        getDepartments: builder.query<any, void>({
            query: () => '/department',
            providesTags: ['Department'],
        }),
        getLevels: builder.query<any, void>({
            query: () => '/level',
            providesTags: ['Level'],
        }),
        getModules: builder.query<any, void>({
            query: () => '/module',
            providesTags: ['Module'],
        }),
        getSemesters: builder.query<any, void>({
            query: () => '/semester',
            providesTags: ['Semester'],
        }),
    }),
})

export const {
    useGetStudentsQuery,
    useGetLecturersQuery,
    useGetFacultiesQuery,
    useGetDepartmentsQuery,
    useGetLevelsQuery,
    useGetModulesQuery,
    useGetSemestersQuery,
} = mainApi
