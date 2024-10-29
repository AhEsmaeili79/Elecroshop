// src/components/Navbar/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../api/user';
import { logoutUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getUserData = async () => {
    try {
      const data = await fetchUserData();
      setUser(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser(localStorage.getItem('refresh_token'), localStorage.getItem('token'));
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <NavLinks isLoggedIn={isLoggedIn} user={user} />
      <AuthButtons isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
    </nav>
  );
};

export default Navbar;
