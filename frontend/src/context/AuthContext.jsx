import { createContext, useState, useCallback, useEffect } from 'react';
import {
  setCurrentUser,
  getCurrentUser,
  logoutUser as logoutUserAPI,
} from '../api/auth';

// Create Auth Context
export const AuthContext = createContext();

/**
 * Auth Context Provider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // Handle login
  const login = useCallback((userData, authToken) => {
    setCurrentUser(userData, authToken);
    setUser(userData);
    setToken(authToken);
  }, []);

  // Handle logout
  const logout = useCallback(() => {
    logoutUserAPI();
    setUser(null);
    setToken(null);
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
