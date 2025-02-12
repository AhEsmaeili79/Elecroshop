import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage/HomePage';
import CartPage from '../../pages/CartPage/CartPage.jsx';
import ProductDetail from '../../pages/ProductDetailPage/ProductDetail.jsx';
import WishlistPage from '../../pages/WishlistPage/WishlistPage.jsx';
import ProductList from '../../pages/ProductListPage/Productlist.jsx';
import ProfilePage from '../../pages/ProfilePage/ProfilePage.jsx';
import Checkout from '../../pages/CheckoutPage/Checkout.jsx';
import OrderDetail from '../../pages/OrderDetailPage/OrderDetail.jsx';
import PaymentStatus from '../../pages/Payment/paymentStatus.jsx';
import AboutUs from '../../pages/AboutUsPage/AboutUs.jsx';
import ContactUs from '../../pages/ContactUsPage/ContactUs.jsx';

const MainRoutes = () => {
  return (
    <div className="layout-space">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/dashboard" element={<ProfilePage />} />
        <Route path="/address" element={<ProfilePage />} />
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<ProfilePage />} />
        <Route path="/orders/:orderCode" element={<OrderDetail />} />
        <Route path="/payment/callback" element={<PaymentStatus />} />
        <Route path="/role-request" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};

export default MainRoutes;
