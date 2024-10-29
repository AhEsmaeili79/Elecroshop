// src/components/Navbar/AuthButtons.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AuthButtons = ({ isLoggedIn, handleLogout }) => (
  <div className="auth-buttons">
    {isLoggedIn ? (
      <button onClick={handleLogout}>Logout</button>
    ) : (
      <>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
      </>
    )}
  </div>
);

export default AuthButtons;
