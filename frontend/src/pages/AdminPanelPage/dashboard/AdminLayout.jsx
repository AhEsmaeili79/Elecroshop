import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import style from '../css/AdminSidebar.module.css'; 
import { FaBars, FaTimes, FaFilter, FaSignOutAlt } from 'react-icons/fa'; 
import { FaTachometerAlt, FaBox, FaUserAlt, FaFirstOrder } from 'react-icons/fa'; 
import { logoutUser } from '../../../api/admin/auth'; // Import logoutUser

const MenuItem = ({ to, icon, label, isSidebarOpen }) => (
  <li className={`${style.menuItem} list-group-item bg-dark border-0`}>
    <Link to={to} className="text-light text-decoration-none fs-5">
      {icon}
      {isSidebarOpen && label}
    </Link>
  </li>
);

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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
    <div className={`container-fluid ${style.adminPanel_wrapper}`}>
      <div className="row">
        <div className={`col-auto ${isSidebarOpen ? 'col-md-3' : 'col-md-1'} ${style.adminPanel_sidebar} ${isSidebarOpen ? '' : 'closed'}`}>
          <div className="d-flex justify-content-between align-items-center">
            {isSidebarOpen && <h4 className="fw-bold title-sidebar text-light">پنل مدیریت</h4>}
            <button onClick={toggleSidebar} className={`${style.toggleBtn}`}>
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <hr />
          <ul className="list-group list-group-flush">
            <MenuItem to="/admin/dashboard" icon={<FaTachometerAlt className="me-2" />} label="داشبورد" isSidebarOpen={isSidebarOpen} />
            <MenuItem to="/admin/users" icon={<FaUserAlt className="me-2" />} label="کاربران" isSidebarOpen={isSidebarOpen} />
            <MenuItem to="/admin/rolerequest" icon={<FaFilter className="me-2" />} label="درخواست ها" isSidebarOpen={isSidebarOpen} />
            <MenuItem to="/admin/orders" icon={<FaBox className="me-2" />} label="سفارشات" isSidebarOpen={isSidebarOpen} />
            <MenuItem to="/admin/products" icon={<FaFirstOrder className="me-2" />} label="محصولات" isSidebarOpen={isSidebarOpen} />
            <MenuItem to="/admin/categories" icon={<FaFirstOrder className="me-2" />} label="دسته بندی ها " isSidebarOpen={isSidebarOpen} />
            <li className={`${style.menuItem} list-group-item bg-dark border-0`}>
              <Link onClick={handleLogout} className={`${style.noHover} text-light bg-dark text-decoration-none fs-5`}>
                <FaSignOutAlt className="me-2" />
                {isSidebarOpen && 'خروج'}
              </Link>
            </li>
          </ul>
        </div>

        <div className={`col ${style.adminPanel_content} p-4`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
