import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import authService from '../services/authService';

export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTokenRef = useRef(null);
  const logoutRef = useRef(null);

  // Initialize Axios interceptors once
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        
        // If 401 error and not a refresh request
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url.includes('/refresh')) {
          originalRequest._retry = true;
          
          try {
            // Attempt token refresh using ref
            const newTokens = await refreshTokenRef.current();
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed - force logout using ref
            logoutRef.current();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Create stable function references
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      const response = await authService.refreshToken(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Update tokens in storage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      // Update Axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Token refresh failed', error);
      logoutRef.current();
      throw error;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password);
    const { accessToken, refreshToken } = response.data;
    
    // Store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Set Axios headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    // Fetch user data
    const userResponse = await authService.getCurrentUser();
    setUser(userResponse.data);
    
    return userResponse.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    
    // Optional: Call backend logout endpoint
    authService.logout().catch(console.error);
  }, []);

  const register = useCallback(async (userData) => {
    const response = await authService.register(userData);
    return response.data;
  }, []);

  // Update refs when functions change
  useEffect(() => {
    refreshTokenRef.current = refreshToken;
    logoutRef.current = logout;
  }, [refreshToken, logout]);

  // Check authentication state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (accessToken && refreshToken) {
          try {
            const response = await authService.getCurrentUser();
            setUser(response.data);
          } catch (error) {
            if (error.response?.status === 401) {
              // Token might be expired, try to refresh
              await refreshTokenRef.current();
              const userResponse = await authService.getCurrentUser();
              setUser(userResponse.data);
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed', error);
        if (error.response?.status === 401) {
          logoutRef.current();
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);