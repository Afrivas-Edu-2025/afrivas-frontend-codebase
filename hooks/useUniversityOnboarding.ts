'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/auth-context'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api/v1'

export type UniversityOnboardingProfile = {
  universityName: string
  description: string
  logoUrl: string
  logoDataUrl?: string
  termsAccepted: boolean
  completedAt: string | null
}

type GetProfileResponse = {
  status: 'success'
  data: {
    profile: UniversityOnboardingProfile
    isComplete: boolean
  }
}

export const universityOnboardingQueryKey = ['admin', 'onboardingProfile'] as const
export const universityOnboardingQueryKeyFor = (universityId: string | number | undefined | null) =>
  ['admin', 'onboardingProfile', String(universityId ?? '')] as const

const getBearer = (token: string | null) => (token ? `Bearer ${token}` : '')

async function fetchOnboardingProfile(token: string): Promise<GetProfileResponse['data']> {
  const res = await fetch(`${API_BASE_URL}/admin/onboarding/profile`, {
    method: 'GET',
    headers: {
      Authorization: getBearer(token),
    },
  })

  const payload = (await res.json().catch(() => null)) as GetProfileResponse | null
  if (!res.ok) {
    const message = (payload as any)?.message || (payload as any)?.error?.message || `HTTP ${res.status}`
    throw new Error(message)
  }

  if (!payload?.data?.profile) {
    throw new Error('Invalid onboarding profile response')
  }

  return payload.data
}

export type UpdateUniversityOnboardingInput = Partial<{
  universityName: string
  description: string
  logoDataUrl: string
  termsAccepted: boolean
}>

async function updateOnboardingProfile(token: string, input: UpdateUniversityOnboardingInput) {
  const res = await fetch(`${API_BASE_URL}/admin/onboarding/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBearer(token),
    },
    body: JSON.stringify(input),
  })

  const payload = (await res.json().catch(() => null)) as GetProfileResponse | null
  if (!res.ok) {
    const message = (payload as any)?.message || (payload as any)?.error?.message || `HTTP ${res.status}`
    throw new Error(message)
  }

  return payload?.data
}

export function useUniversityOnboardingProfile(options?: { enabled?: boolean }) {
  const { user, token } = useAuth()
  const isAdmin = String(user?.role || '').toUpperCase() === 'ADMIN'

  return useQuery({
    queryKey: universityOnboardingQueryKeyFor((user as any)?.id),
    queryFn: () => fetchOnboardingProfile(token as string),
    enabled:
      Boolean(options?.enabled ?? true) &&
      Boolean(token) &&
      isAdmin &&
      (user as any)?.id !== undefined &&
      (user as any)?.id !== null,
    staleTime: 0,
    gcTime: 0,
    networkMode: 'always',
    retry: 2,
  })
}

export function useUpdateUniversityOnboardingProfile() {
  const { user, token, updateUser } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateUniversityOnboardingInput) => {
      if (!token) throw new Error('Missing auth token')
      return updateOnboardingProfile(token, input)
    },
    onSuccess: (data) => {
      const profile = data?.profile
      if (profile && user) {
        updateUser({
          universityName: profile.universityName,
          motto: profile.description,
          universityLogoUrl: profile.logoUrl,
          universityLogoDataUrl: profile.logoDataUrl,
          onboardingTermsAccepted: profile.termsAccepted,
          onboardingCompletedAt: profile.completedAt,
        })
      }
      queryClient.invalidateQueries({ queryKey: universityOnboardingQueryKeyFor((user as any)?.id) })
    },
    networkMode: 'offlineFirst',
  })
}
