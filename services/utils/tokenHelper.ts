// Token storage keys
const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"

// Get access token from localStorage
export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }
  return null
}

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }
  return null
}

// Set both tokens in localStorage
export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

// Clear all auth tokens from localStorage
export const clearAuthTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}
