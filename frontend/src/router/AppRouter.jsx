import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
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
import AboutUs from '../pages/AboutUsPage/AboutUs.jsx';
import ContactUs from '../pages/ContactUsPage/ContactUs.jsx';
import DashboardPage from '../pages/AdminPanelPage/DashboardPage.jsx';
import AdminLoginPage from '../pages/AdminPanelPage/login/adminLoginPage.jsx';
import AdminRoleRequests from '../pages/AdminPanelPage/RoleRequestPage/AdminRoleRequests.jsx';
import SellerProductList from '../pages/AdminPanelPage/Seller/Products/ProductList.jsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
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
      <Route path="/admin" element={<PrivateRoute element={<DashboardPage />} roles={['admin', 'seller']} />} />
      <Route path="/admin/*" element={<PrivateRoute element={<DashboardPage />} roles={['admin', 'seller']} />} />
      <Route path="/admin/RoleRequest" element={<PrivateRoute element={<AdminRoleRequests />} roles={['admin']} />} />
      <Route path="/admin/products" element={<PrivateRoute element={<SellerProductList />} roles={['admin', 'seller']} />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
