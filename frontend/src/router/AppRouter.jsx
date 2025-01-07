import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchUserData } from '../api/user';
import HomePage from '../pages/HomePage/HomePage'
import CartPage from '../pages/CartPage/CartPage.jsx';
import ProductDetail from '../pages/ProductDetailPage/ProductDetail.jsx';
import WishlistPage from '../pages/WishlistPage/WishlistPage.jsx';
import ProductList from '../pages/ProductListPage/Productlist.jsx';
import ProfilePage from '../pages/ProfilePage/ProfilePage.jsx';
import Checkout from '../pages/CheckoutPage/Checkout.jsx';
import OrderDetail from '../pages/OrderDetailPage/OrderDetail.jsx';
import PaymentStatus from '../pages/Payment/paymentStatus.jsx';
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
      <Route path="/cart" element={<CartPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/product" element={<ProductList />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/dashboard/" element={<ProfilePage/>} />
      <Route path="/address" element={<ProfilePage/>}/>
      <Route path="/account" element={<ProfilePage/>}/>
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/orders" element={<ProfilePage/>} />
      <Route path="/orders/:orderCode" element={<OrderDetail/>} />
      <Route path="/payment/callback" element={<PaymentStatus/>} />
      <Route path="*" element={<NotFound />} />
      {/* Add more routes for different roles */}
      {renderRoleSpecificRoutes()}
    </Routes>
  );
}

export default AppRouter;
