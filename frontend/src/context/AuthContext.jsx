import React, { createContext, useState, useEffect } from 'react';
// Import the custom Axios instance you just shared
import API from '../api/axios'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Check if a user is already logged in when the app starts
  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // We use API.get() so it automatically attaches the token from localStorage
        // This assumes your backend has a GET /api/auth/me route
        const { data } = await API.get('/auth/me');
        setUser(data.data || data.user); 
      } catch (err) {
        // If the token is invalid or expired, clear it
        console.error("Session expired:", err);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  // Login function
  const login = async (email, password) => {
    try {
      // Calls POST /api/auth/login
      const { data } = await API.post('/auth/login', { email, password });
      
      // Save token
      localStorage.setItem('token', data.token);
      
      // If the backend returns the user object directly, use it
      if (data.user) {
        setUser(data.user);
      } else {
        // Otherwise, fetch user details
        await checkUserLoggedIn();
      }
      return true; // Login success
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Let the Login component handle the error message
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin'); 
    setUser(null);
    // We don't need to delete headers manually because the API interceptor 
    // checks localStorage every time a request is made.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};