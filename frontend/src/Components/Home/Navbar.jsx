import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserData } from '../api/user';
import { logoutUser } from '../api/auth'; // Import the logout function

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const navigate = useNavigate();

  // Check if the user is logged in by checking local storage for the token
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set the state based on the presence of the token
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token'); // Get refresh token if needed
    const accessToken = localStorage.getItem('token'); // Get access token if needed

    try {
      await logoutUser(refreshToken, accessToken); // Call logout API
      localStorage.removeItem('token'); // Clear the token from local storage
      localStorage.removeItem('refresh_token'); // Clear refresh token from local storage
      setIsLoggedIn(false); // Update the state to logged out
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const [user, setUser] = useState(null); // State to store user data

  // Fetch user data when the component mounts
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUser(data); // Set the fetched user data
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    getUserData();
  }, []);

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            {user && user.role === 'admin' && (
              <li><Link to="/manage-requests">manage role</Link></li>
            )}
            {user && user.role === 'customer' && (
              <li><Link to="/request-role">request role</Link></li>
            )}
            {user && user.role === 'seller' && (
              <>
                <li><Link to="/seller/products">My Products</Link></li>
                <li><Link to="/seller/add-product">Add Product</Link></li>
              </>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
