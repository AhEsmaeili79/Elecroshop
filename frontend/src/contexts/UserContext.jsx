import { createContext, useState, useEffect } from 'react';
import { fetchUserData } from '../api/user';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const getUserData = async () => {
        try {
          const userData = await fetchUserData();
          setUser(userData); 
          setIsLoggedIn(true); 
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
      setLoading(false); 
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
