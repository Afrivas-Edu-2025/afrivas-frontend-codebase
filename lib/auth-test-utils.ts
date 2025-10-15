// Utility functions for testing admin authentication
// This is for development/testing purposes only

export const setMockAdminToken = () => {
  // This is a mock token for testing - replace with actual admin token
  const mockAdminToken = "mock-admin-token-for-testing";
  const mockAdminUser = {
    id: "admin-1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@afrivas.com",
    role: "ADMIN",
    isActive: true
  };
  
  localStorage.setItem('authToken', mockAdminToken);
  localStorage.setItem('user', JSON.stringify(mockAdminUser));
  
  console.log('Mock admin token set:', mockAdminToken);
  console.log('Mock admin user set:', mockAdminUser);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  console.log('Auth tokens cleared');
};

export const getStoredAuthInfo = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  return {
    token,
    user: user ? JSON.parse(user) : null
  };
};
