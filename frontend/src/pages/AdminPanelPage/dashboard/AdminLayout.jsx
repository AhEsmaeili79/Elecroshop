import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from '../css/AdminSidebar.module.css';
import { FaBars, FaTimes, FaFilter, FaSignOutAlt } from 'react-icons/fa';
import { FaTachometerAlt, FaBox, FaUserAlt, FaFirstOrder } from 'react-icons/fa';
import { logoutUser } from '../../../api/admin/auth';

const MenuItem = ({ to, icon, label, isSidebarOpen }) => (
  <li className={`${style.menuItem} list-group-item bg-dark border-0 text-center`}>
    <Link to={to} className="text-light text-decoration-none d-flex align-items-center justify-content-center">
      {icon}
      {isSidebarOpen && <span className="ms-2">{label}</span>}
    </Link>
  </li>
);

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(prevState => !prevState);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={style.adminPanel_wrapper}>
      <div className={`${style.adminPanel_sidebar} ${isSidebarOpen ? '' : 'closed'}`}>
        <button onClick={toggleSidebar} className={style.toggleBtn}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        {isSidebarOpen && <h4 className="fw-bold title-sidebar text-light">پنل مدیریت</h4>}
        <ul className="list-group list-group-flush w-100">
          <MenuItem to="/admin" icon={<FaTachometerAlt />} label="داشبورد" isSidebarOpen={isSidebarOpen} />
          <MenuItem to="/admin/users" icon={<FaUserAlt />} label="کاربران" isSidebarOpen={isSidebarOpen} />
          <MenuItem to="/admin/rolerequest" icon={<FaFilter />} label="درخواست ها" isSidebarOpen={isSidebarOpen} />
          <MenuItem to="/admin/orders" icon={<FaBox />} label="سفارشات" isSidebarOpen={isSidebarOpen} />
          <MenuItem to="/admin/products" icon={<FaFirstOrder />} label="محصولات" isSidebarOpen={isSidebarOpen} />
          <MenuItem to="/admin/category" icon={<FaFirstOrder />} label="دسته بندی ها" isSidebarOpen={isSidebarOpen} />
          <li className={`${style.menuItem} list-group-item bg-dark border-0 text-center`}>
            <Link onClick={handleLogout} className="text-light text-decoration-none">
              <FaSignOutAlt />
              {isSidebarOpen && <span className="ms-2">خروج</span>}
            </Link>
          </li>
        </ul>
      </div>

      <div className={style.adminPanel_content}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
