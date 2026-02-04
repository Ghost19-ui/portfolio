import React, { createContext, useState, useEffect, useContext } from 'react'; // 👈 Added useContext
import API from '../api/axios'; 

export const AuthContext = createContext();

// --- 🛑 THIS WAS MISSING 🛑 ---
export const useAuth = () => {
  return useContext(AuthContext);
};
// -------------------------------

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
        const { data } = await API.get('/auth/me');
        setUser(data.data || data.user); 
      } catch (err) {
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
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      
      if (data.user) {
        setUser(data.user);
      } else {
        await checkUserLoggedIn();
      }
      return true; 
    } catch (error) {
      console.error("Login failed:", error);
      throw error; 
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin'); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};