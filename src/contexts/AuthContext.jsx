import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Provide the context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user_v');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user_v', JSON.stringify(userData));
  };

  // Register function (can be different based on API)
  const register = (userData) => {
    // Could be same as login, depends
    setUser(userData);
    localStorage.setItem('user_v', JSON.stringify(userData));
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Replace with your token storage key
  
      const response = await axios.post(
        import.meta.env.VITE_LOGOUT,
        {}, // body empty
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Logged out:', response.data);
      setUser(null);
      // Optional: Clear token from storage
      localStorage.removeItem('authToken');
  
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
