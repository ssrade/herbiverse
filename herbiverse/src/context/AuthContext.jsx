import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up axios defaults - adjust the base URL to match your backend
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Add authorization header to all requests if token exists
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle auth errors (like expired token)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid
        logout();
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    // Check if user is authenticated when the app loads
    const checkAuthStatus = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Updated endpoint to match your backend structure
          const response = await axios.get('/api/users/verify');
          
          // Make sure we're correctly handling the response
          if (response.data && response.data.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // If response structure is different, try to adapt
            console.warn('Auth verification response structure unexpected:', response.data);
            // Check if user data might be directly in the response
            setUser(response.data || {});
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          
          // Don't immediately remove token on error - check error type
          if (error.response && error.response.status === 401) {
            // Only clear for unauthorized errors
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          } else {
            // For other errors (like network issues), keep user logged in
            // Just assume token is valid if server is unreachable
            setIsAuthenticated(true);
            // Try to get user from localStorage if available
            try {
              const userData = localStorage.getItem('userData');
              if (userData) {
                setUser(JSON.parse(userData));
              }
            } catch (e) {
              console.error('Error parsing stored user data', e);
            }
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Also store user data in localStorage for backup
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post('/users/signup', { name, email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Also store user data in localStorage for backup
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const addToFavorites = async (plant) => {
    if (!isAuthenticated) {
      return { success: false, reason: 'auth' };
    }

    try {
      const plantData = {
        plantId: plant._id || plant.id,
        name: plant.name,
        scientificName: plant.scientificName,
        description: plant.description,
        modelPath: plant.modelPath
      };

      await axios.post('/api/favourite', plantData);
      return { success: true };
    } catch (error) {
      console.error('Error adding to favourites:', error);
      
      if (error.response?.status === 409) {
        return { success: false, reason: 'duplicate' };
      }
      
      return { success: false, reason: 'error' };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      addToFavorites
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;