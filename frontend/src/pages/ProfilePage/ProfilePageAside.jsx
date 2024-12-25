import { Link, useLocation } from 'react-router-dom';

const DashboardAside = ({ handleLogout, setActiveTab }) => {
    const location = useLocation(); // Get the current URL path

    const navItems = [
        { id: "dashboard", label: "داشبورد", href: "/dashboard" },
        { id: "orders", label: "سفارشات", href: "/orders" },
        { id: "address", label: "آدرس‌ها", href: "#tab-address" }, 
        { id: "account", label: "جزئیات حساب", href: "#tab-account" },
    ];

    const handleTabClick = (id) => {
        setActiveTab(id); // This will update the active tab
    };

    const isActive = (href) => {
        // Check if the current URL is either the absolute path or a hash-based URL
        if (href.startsWith('#')) {
            return location.hash === href; // For hash-based links, match the hash part of the URL
        } else {
            return location.pathname === href; // For normal links, match the full URL
        }
    };

    return (
        <aside className="col-md-4 col-lg-3">
            <ul className="nav nav-dashboard flex-column mb-3 mb-md-0" role="tablist">
                {navItems.map(({ id, label, href }) => (
                    <li key={id || label} className="nav-item">
                        <a
                            className={`nav-link ${isActive(href) ? 'active' : ''}`} // Apply 'active' class if current path matches href
                            id={id ? `tab-${id}-link` : undefined}
                            data-toggle={id ? "tab" : undefined}
                            href={href}
                            role={id ? "tab" : undefined}
                            aria-controls={id ? `tab-${id}` : undefined}
                            onClick={() => handleTabClick(id)}
                        >
                            {label}
                        </a>
                    </li>
                ))}
                <li className="nav-item">
                    <Link to='/' className='nav-link' onClick={handleLogout}>خروج</Link>
                </li>  
            </ul>
        </aside>
    );
};

export default DashboardAside;
