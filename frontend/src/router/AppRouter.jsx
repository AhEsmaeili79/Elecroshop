import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchUserData } from '../components/api/user';
import Cart from '../components/Cart/Cart';
import HomePage from '../components/Home/HomePage';
import ProductDetail from '../components/ProductDetail/ProductDetail';
import WishlistPage from '../components/Wishlist/WishlistPage';
import ProductList from '../components/ProductList/Productlist';
import UserDetail from '../components/UserDetail/Components/UserDetail';
import Checkout from '../components/Checkout/Checkout';
import OrdersList from '../components/UserDetail/Components/Orders/OrdersList';
import OrderDetail from '../components/OrderDetail/OrderDetail';
import NotFound from '../pages/NotFound/NotFound';

const AppRouter = () => {
  const [user, setUser] = useState(null); // State to store user data

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

  const renderRoleSpecificRoutes = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'customer':
        return (
          <>
            {/* Add customer specific routes here */}
          </>
        );
      case 'admin':
        return (
          <>
            {/* Add admin specific routes here */}
          </>
        );
      case 'seller':
        return (
          <>
            {/* Add seller specific routes here */}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Routes>
      <Route path="/cart" element={<Cart />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/product" element={<ProductList />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/dashboard/myaccount" element={<UserDetail/>} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/orders" element={<OrdersList/>} />
      <Route path="/orders/:orderCode" element={<OrderDetail/>} />
      <Route path="*" element={<NotFound />} />
      {/* Add more routes for different roles */}
      {renderRoleSpecificRoutes()}
    </Routes>
  );
}

export default AppRouter;
