// src/components/Navbar/NavLinks.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ isLoggedIn, user }) => (
  <ul className="nav-links">
    <li><Link to="/">Home</Link></li>
    {isLoggedIn && (
      <>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/cart">Cart</Link></li>
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
      </>
    )}
  </ul>
);

export default NavLinks;
