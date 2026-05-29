import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { getErrorMessage } from '../utils/errors';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      });
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid login response');
      }
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error, 'Login failed')
      };
    }
  };

  const register = async (userData) => {
    try {
      let dataToSubmit;
      
      if (userData instanceof FormData) {
        dataToSubmit = userData;
      } else {
        dataToSubmit = {
          ...userData,
          first_name: userData.first_name?.trim(),
          last_name: userData.last_name?.trim(),
          email: userData.email?.trim().toLowerCase(),
          phone: userData.phone?.trim(),
          address: userData.address?.trim(),
        };
      }

      const response = await authAPI.register(dataToSubmit);
      if (!response.data?.user) {
        throw new Error('Invalid registration response');
      }
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid registration response');
      }
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error, 'Registration failed')
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
