import { Routes, Route } from 'react-router-dom';
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
    </Routes>
  );
}

export default AppRouter;
