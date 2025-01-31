import { useState } from 'react';
import { Link } from 'react-router-dom';

import '../css/AdminSidebar.module.css';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button onClick={toggleSidebar} className="toggle-btn">
            {isSidebarOpen ? 'Close' : 'Open'} Sidebar
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="admin/orders">Orders</Link>
          </li>
          <li>
            <Link to="admin/products">Products</Link>
          </li>
          <li>
            <Link to="admin/profiles">Profile</Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
