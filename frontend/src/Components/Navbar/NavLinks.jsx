// src/components/Navbar/NavLinks.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ isLoggedIn, user }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      {isLoggedIn && (
        <>
          <li><Link to="/cart">Cart</Link></li>
          <li className="dropdown">
            <button onClick={toggleDropdown} className="dropdown-button">
              {user.role}
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/profile">Profile</Link></li>
                {user && user.role === 'admin' && (
                  <>
                    <li><Link to="/manage-requests">Manage Role</Link></li>
                    <li><Link to="/categories">Categories</Link></li>
                    <li><Link to="/subcategories">SubCategories</Link></li>
                  </>
                )}
                {user && user.role === 'customer' && (
                  <li><Link to="/request-role">Request Role</Link></li>
                )}
                {user && user.role === 'seller' && (
                  <>
                    <li><Link to="/seller/products">My Products</Link></li>
                    <li><Link to="/seller/add-product">Add Product</Link></li>
                    <li><Link to="/categories">Categories</Link></li>
                    <li><Link to="/subcategories">SubCategories</Link></li>
                    <li><Link to="/brands">Brands</Link></li>
                    <li><Link to="/models">Models</Link></li>
                  </>
                )}
              </ul>
            )}
          </li>
        </>
      )}
    </ul>
  );
};

export default NavLinks;
