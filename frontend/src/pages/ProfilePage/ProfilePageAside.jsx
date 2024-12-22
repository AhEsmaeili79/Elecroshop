import { Link } from 'react-router-dom';

const DashboardAside = ({ handleLogout, setActiveTab }) => {
    const navItems = [
        { id: "dashboard", label: "داشبورد", href: "#tab-dashboard" },
        { id: "orders", label: "سفارشات", href: "#tab-orders" },
        { id: "address", label: "آدرس‌ها", href: "#tab-address" }, 
        { id: "account", label: "جزئیات حساب", href: "#tab-account" },
    ];

    const handleTabClick = (id) => {
        setActiveTab(id); // This will update the active tab
    };

    return (
        <aside className="col-md-4 col-lg-3">
            <ul className="nav nav-dashboard flex-column mb-3 mb-md-0" role="tablist">
                {navItems.map(({ id, label, href }) => (
                    <li key={id || label} className="nav-item">
                        <a
                            className="nav-link"
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
