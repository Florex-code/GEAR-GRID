import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ADMIN_EMAIL = 'florexstudio.ng@gmail.com';
const isAdminEmail = (email) => email?.toLowerCase() === ADMIN_EMAIL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('gearGridToken');

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('gearGridToken');
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setUser(decoded);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('gearGridToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('gearGridToken', data.token);

      const decoded = jwtDecode(data.token);
      const loggedInUser = { ...decoded, ...data.user };

      setUser(loggedInUser);
      setIsAuthenticated(true);

      toast.success(`Welcome back, ${data.user?.firstName || 'Admin'}!`);
      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('gearGridToken', data.token);

      const decoded = jwtDecode(data.token);
      const registeredUser = { ...decoded, ...data.user };

      setUser(registeredUser);
      setIsAuthenticated(true);

      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('gearGridToken');
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    toast.info('Logged out successfully');
  }, []);

  const updateProfile = async (updates) => {
    const token = localStorage.getItem('gearGridToken');

    if (!token) {
      toast.error('No token found');
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const updatedUser = await response.json();

      if (!response.ok) {
        throw new Error(updatedUser.message || 'Failed to update profile');
      }

      setUser((prev) => ({ ...prev, ...updatedUser }));
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      return false;
    }
  };

  const isAdmin =
    user?.role === 'admin' ||
    user?.isAdmin === true ||
    isAdminEmail(user?.email);

  const value = {
    user,
    isAdmin,
    isAuthenticated,
    isLoading,
    authError,
    login,
    register,
    logout,
    updateProfile,
    setAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
