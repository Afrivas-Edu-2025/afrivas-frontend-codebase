// Utility functions for testing admin authentication
// This is for development/testing purposes only

export const setMockAdminToken = () => {
  // Intentionally avoid writing a fake JWT token: backend rejects malformed tokens.
  const mockAdminUser = {
    id: "admin-1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@afrivas.com",
    role: "ADMIN",
    isActive: true
  };
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('accessToken');
  localStorage.setItem('user', JSON.stringify(mockAdminUser));
  
  console.log('Mock admin user set without token. Please login to get a valid JWT.');
};

export const clearAuthTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  console.log('Auth tokens cleared');
};

export const getStoredAuthInfo = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  
  return {
    token,
    user: user ? JSON.parse(user) : null
  };
};
