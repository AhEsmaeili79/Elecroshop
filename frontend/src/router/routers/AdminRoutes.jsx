import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute.jsx';
import DashboardPage from '../../pages/AdminPanelPage/DashboardPage.jsx';
import AdminLoginPage from '../../pages/AdminPanelPage/login/adminLoginPage.jsx';
import AdminRoleRequests from '../../pages/AdminPanelPage/RoleRequestPage/AdminRoleRequests.jsx';
import SellerProductList from '../../pages/AdminPanelPage/Seller/Products/ProductList.jsx';
import AddProductPage from '../../pages/AdminPanelPage/Seller/Products/ProductAdd.jsx';
import EditProductPage from '../../pages/AdminPanelPage/Seller/Products/ProductEdit.jsx';
import AddCategoryPage from '../../pages/AdminPanelPage/Seller/Categories/CategoryAdd.jsx';
import EditCategoryPage from '../../pages/AdminPanelPage/Seller/Categories/CategoryEdit.jsx';
import CategoryList from '../../pages/AdminPanelPage/Seller/Categories/CategoryList.jsx';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={<DashboardPage />} roles={['admin', 'seller']} />} />
      <Route path="/RoleRequest" element={<PrivateRoute element={<AdminRoleRequests />} roles={['admin']} />} />
      <Route path="/products" element={<PrivateRoute element={<SellerProductList />} roles={['admin', 'seller']} />} />
      <Route path="/category" element={<PrivateRoute element={<CategoryList />} roles={['admin', 'seller']} />} />
      <Route path="/products/add" element={<PrivateRoute element={<AddProductPage />} roles={['admin', 'seller']} />} />
      <Route path="/category/add" element={<PrivateRoute element={<AddCategoryPage />} roles={['admin', 'seller']} />} />
      <Route path="/products/edit/:productId" element={<PrivateRoute element={<EditProductPage />} roles={['admin', 'seller']} />} />
      <Route path="/category/edit/:categoryId" element={<PrivateRoute element={<EditCategoryPage />} roles={['admin', 'seller']} />} />
      <Route path="/login" element={<AdminLoginPage />} />
    </Routes>
  );
};

export default AdminRoutes;
