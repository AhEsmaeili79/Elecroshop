import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../api/user';
import { fetchLatestProducts } from './api';
import WelcomeMessage from './WelcomeMessage';
import UserProfileImage from './UserProfileImage';
import { Link } from 'react-router-dom';
import './css/Home.css';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  const getUserData = async () => {
    try {
      const data = await fetchUserData();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Do not set error state; allow page to render without user data
    }
  };

  // Fetch latest products
  const getLatestProducts = async () => {
    try {
      const products = await fetchLatestProducts();
      setLatestProducts(products);
    } catch (error) {
      setError('Failed to fetch latest products.');
    } finally {
      setLoading(false); // Ensure loading is false after fetching products
    }
  };

  useEffect(() => {
    getUserData();
    getLatestProducts();
  }, []);

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="home-container">
      {/* Only show welcome message and profile image if userData is available */}
      {userData && (
        <>
          <WelcomeMessage username={userData.username} role={userData.role} />
          {userData.profile_image && (
          <UserProfileImage profileImage={userData.profile_image} />
          )}
          </>
      )}
      <div className="latest-products">
        <h2>Latest Products</h2>
        {latestProducts.length === 0 ? (
          <p>No products available at the moment.</p>
        ) : (
          <div className="product-grid">
            {latestProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-link">
                <div className="product-card">
                  <img src={product.main_photo} alt={product.name} className="product-image" />
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">قیمت: {product.price} تومان</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Home;
