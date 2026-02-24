export type UniversityOnboardingProfile = {
  universityName: string
  description: string
  logoDataUrl?: string
  termsAccepted: boolean
  completedAt: string
}

const keyFor = (userId: string | number) => `university_onboarding_${String(userId)}`

export const getUniversityOnboardingProfile = (
  userId: string | number | undefined,
): UniversityOnboardingProfile | null => {
  if (typeof window === "undefined" || userId === undefined) return null
  const raw = localStorage.getItem(keyFor(userId))
  if (!raw) return null

  try {
    return JSON.parse(raw) as UniversityOnboardingProfile
  } catch {
    return null
  }
}

export const isUniversityOnboardingComplete = (userId: string | number | undefined): boolean => {
  const profile = getUniversityOnboardingProfile(userId)
  return Boolean(profile?.termsAccepted && profile?.completedAt)
}

export const saveUniversityOnboardingProfile = (
  userId: string | number,
  profile: UniversityOnboardingProfile,
): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(keyFor(userId), JSON.stringify(profile))
}

