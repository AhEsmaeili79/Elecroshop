import { Link, useLocation } from 'react-router-dom';

const DashboardAside = ({ handleLogout, setActiveTab }) => {
    const location = useLocation(); 

    const navItems = [
        { id: "dashboard", label: "داشبورد", href: "/dashboard" },
        { id: "orders", label: "سفارشات", href: "/orders" },
        { id: "account", label: "جزئیات حساب", href: "#tab-account" },
        { id: "address", label: "آدرس‌ها", href: "#tab-address" }, 
        { id: "rolerequest", label: "تغییر نقش", href: "/role-request" },
    ];

    const handleTabClick = (id) => {
        setActiveTab(id); 
    };

    const isActive = (href) => {
        if (href.startsWith('#')) {
            return location.hash === href; 
        } else {
            return location.pathname === href; 
        }
    };

    return (
        <aside className="col-md-4 col-lg-3">
            <ul className="nav nav-dashboard flex-column mb-3 mb-md-0" role="tablist">
                {navItems.map(({ id, label, href }) => (
                    <li key={id || label} className="nav-item">
                        <a
                            className={`nav-link ${isActive(href) ? 'active' : ''}`} 
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
