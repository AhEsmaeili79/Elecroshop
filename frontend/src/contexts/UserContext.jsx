// src/contexts/UserContext.js
import { createContext, useState, useEffect } from 'react';
import { fetchUserData } from '../api/user';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user data
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login status
  const [loading, setLoading] = useState(true);  // Loading state for initial fetch
  const [error, setError] = useState(null);  // Handle errors

  // Fetch user data if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const getUserData = async () => {
        try {
          const userData = await fetchUserData();
          setUser(userData); // Store user data
          setIsLoggedIn(true); // Set login status to true
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          setError('Failed to load user data');
          setIsLoggedIn(false);
        } finally {
          setLoading(false);
        }
      };
      getUserData();
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []); // Run only once on mount

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
