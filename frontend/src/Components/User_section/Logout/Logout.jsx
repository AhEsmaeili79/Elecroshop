// src/Logout.jsx
import React from 'react';
import { logoutUser } from '../../api/auth'; // Import the logout function

const Logout = () => {
  const handleLogout = async () => {
    try {
      await logoutUser(); // Call the logout function
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
