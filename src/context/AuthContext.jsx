import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('gearGridToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('gearGridToken');
          setIsAuthenticated(false);
          setUser(null);
        } else {
          setUser(decoded);
          setIsAuthenticated(true);
          // Optionally fetch fresh user data
          fetchUserProfile(token);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('gearGridToken');
      }
    }
    setIsLoading(false);
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(prev => ({ ...prev, ...userData }));
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

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
      setUser({ ...decoded, ...data.user });
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${data.user.firstName}!`);
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
      setUser({ ...decoded, ...data.user });
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
    toast.info('Logged out successfully');
  }, []);

  const updateProfile = async (updates) => {
    const token = localStorage.getItem('gearGridToken');
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(prev => ({ ...prev, ...updatedUser }));
        toast.success('Profile updated successfully');
        return true;
      }
    } catch (error) {
      toast.error('Failed to update profile');
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    authError,
    login,
    register,
    logout,
    updateProfile,
    setAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};