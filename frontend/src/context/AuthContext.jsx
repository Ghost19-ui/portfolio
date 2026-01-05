import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axiosConfig';

export const AuthContext = createContext();

// --- THIS EXPORT WAS MISSING OR NOT PICKED UP ---
export const useAuth = () => {
  return useContext(AuthContext);
};
// ------------------------------------------------

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token'); 
      
      if (token) {
        // Optimistic update
        setUser({ token }); 

        try {
          const { data } = await API.get('/auth/me');
          // Handle different response structures
          const userData = data.data || data.user || data;
          setUser(userData);
        } catch (error) {
          console.error("Auth check warning:", error);
          // Only logout if 401 Unauthorized
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token }); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/admin/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};