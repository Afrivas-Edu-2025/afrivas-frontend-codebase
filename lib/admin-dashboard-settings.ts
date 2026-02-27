export type AdminDashboardSettings = {
  institutionName: string
  institutionDescription: string
  timezone: string
  fromEmail: string
  fromName: string
  enableMessageNotifications: boolean
  enableCalendarNotifications: boolean
  enableUserNotifications: boolean
  enableSystemNotifications: boolean
}

const keyFor = (userId: string | number) => `admin_dashboard_settings_${String(userId)}`

export const getDefaultAdminSettings = (params?: {
  institutionName?: string
  institutionDescription?: string
  fromEmail?: string
}): AdminDashboardSettings => ({
  institutionName: params?.institutionName || "Afrivas University",
  institutionDescription: params?.institutionDescription || "",
  timezone: "UTC",
  fromEmail: params?.fromEmail || "noreply@afrivas.com",
  fromName: params?.institutionName || "Afrivas University",
  enableMessageNotifications: true,
  enableCalendarNotifications: true,
  enableUserNotifications: true,
  enableSystemNotifications: true,
})

export const getAdminDashboardSettings = (
  userId: string | number | undefined,
  defaults?: Partial<AdminDashboardSettings>,
): AdminDashboardSettings | null => {
  if (typeof window === "undefined" || userId === undefined) return null
  const raw = localStorage.getItem(keyFor(userId))
  if (!raw) {
    return {
      ...getDefaultAdminSettings(),
      ...defaults,
    }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AdminDashboardSettings>
    return {
      ...getDefaultAdminSettings(),
      ...defaults,
      ...parsed,
    }
  } catch {
    return {
      ...getDefaultAdminSettings(),
      ...defaults,
    }
  }
}

export const saveAdminDashboardSettings = (
  userId: string | number,
  settings: AdminDashboardSettings,
): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(keyFor(userId), JSON.stringify(settings))
}
