import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from '../css/AdminSidebar.module.css'; 
import { FaBars, FaTimes } from 'react-icons/fa'; 
import { FaTachometerAlt, FaBox, FaUserAlt } from 'react-icons/fa'; 

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

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  return (
    <div className={`container-fluid ${style.adminPanel_wrapper}`}>
      <div className="row">

        <div className={`col-auto ${isSidebarOpen ? 'col-md-3' : 'col-md-1'} ${style.adminPanel_sidebar} ${isSidebarOpen ? '' : 'closed'}`}>
          <div className="d-flex justify-content-between align-items-center">
            {isSidebarOpen && (
              <h4 className="fw-bold title-sidebar text-light">پنل مدیریت</h4>
            )}
            <button onClick={toggleSidebar} className={`${style.toggleBtn}`}>
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <hr />
          <ul className="list-group list-group-flush">

            <MenuItem to="/admin/dashboard" icon={<FaTachometerAlt className="me-2" />} label="داشبورد" isSidebarOpen={isSidebarOpen} />
            <MenuItem to="/admin/orders" icon={<FaBox className="me-2" />} label="سفارشات" isSidebarOpen={isSidebarOpen} />
            <MenuItem to="/admin/products" icon={<FaBox className="me-2" />} label="محصولات" isSidebarOpen={isSidebarOpen} />
            <MenuItem to="/admin/profiles" icon={<FaUserAlt className="me-2" />} label="پروفایل" isSidebarOpen={isSidebarOpen} />
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
