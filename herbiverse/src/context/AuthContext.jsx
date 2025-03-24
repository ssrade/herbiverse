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

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      
      const response = await axios.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Check if user is authenticated when the app loads
    const checkAuthStatus = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Fetch user profile directly instead of verifying
          const userData = await fetchUserProfile();
          
          if (userData) {
            setUser(userData);
            // Also update localStorage backup
            localStorage.setItem('userData', JSON.stringify(userData));
            setIsAuthenticated(true);
          } else {
            // If we can't get the profile, try to fall back to stored data
            const storedUserData = localStorage.getItem('userData');
            if (storedUserData) {
              try {
                const parsedUserData = JSON.parse(storedUserData);
                setUser(parsedUserData);
                setIsAuthenticated(true);
                console.log("Retrieved user data from localStorage:", parsedUserData);
              } catch (e) {
                console.error('Error parsing stored user data', e);
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
              }
            } else {
              // No stored data, logout
              setIsAuthenticated(false);
              setUser(null);
              localStorage.removeItem('token');
            }
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          
          // Don't immediately remove token on error - check error type
          if (error.response && error.response.status === 401) {
            // Only clear for unauthorized errors
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('userData');
          } else {
            // For other errors (like network issues), keep user logged in
            // Just assume token is valid if server is unreachable
            setIsAuthenticated(true);
            // Try to get user from localStorage if available
            try {
              const userData = localStorage.getItem('userData');
              if (userData) {
                const parsedUserData = JSON.parse(userData);
                setUser(parsedUserData);
                console.log("Retrieved user data from localStorage:", parsedUserData);
              }
            } catch (e) {
              console.error('Error parsing stored user data', e);
            }
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('userData');
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
        
        // After successful login, fetch the full profile
        const profileData = await fetchUserProfile();
        let userData;
        
        if (profileData) {
          userData = profileData;
        } else {
          // Create a proper user object from login response if profile fetch fails
          userData = response.data;
          
          // If user data is missing or incomplete, add email at minimum
          if (!userData || Object.keys(userData).length === 0) {
            userData = { email: email };
          }
          
          // Make sure email is included
          if (!userData.email) {
            userData.email = email;
          }
        }
        
        // Store enhanced user data
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        console.log("User logged in with data:", userData);
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
        
        // After successful signup, fetch the full profile
        const profileData = await fetchUserProfile();
        let userData;
        
        if (profileData) {
          userData = profileData;
        } else {
          // Create a proper user object from signup response if profile fetch fails
          userData = response.data;
          
          // If user data is missing or incomplete, construct minimum info
          if (!userData || Object.keys(userData).length === 0) {
            userData = { 
              name: name,
              email: email
            };
          }
          
          // Make sure name and email are included
          if (!userData.name) userData.name = name;
          if (!userData.email) userData.email = email;
        }
        
        // Store enhanced user data
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        console.log("User signed up with data:", userData);
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

  const logout = async () => {
    try {
      // Call the logout endpoint if you want to invalidate the token on server
      if (isAuthenticated) {
        await axios.post('/users/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state regardless of server response
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshUserProfile = async () => {
    if (isAuthenticated) {
      try {
        const userData = await fetchUserProfile();
        if (userData) {
          setUser(userData);
          localStorage.setItem('userData', JSON.stringify(userData));
          return true;
        }
      } catch (error) {
        console.error('Error refreshing user profile:', error);
      }
    }
    return false;
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
      refreshUserProfile,
      addToFavorites
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;