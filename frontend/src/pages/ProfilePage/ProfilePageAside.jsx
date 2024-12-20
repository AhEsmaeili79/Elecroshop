import { Link } from 'react-router-dom';

const DashboardAside = ({ handleLogout, setActiveTab }) => {
    const navItems = [
        { id: "dashboard", label: "Dashboard", href: "#tab-dashboard" },
        { id: "orders", label: "Orders", href: "#tab-orders" },
        { id: "address", label: "Addresses", href: "#tab-address" }, // Updated label to "Addresses"
        { id: "account", label: "Account Details", href: "#tab-account" },
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
                    <Link to='/' className='nav-link' onClick={handleLogout}>Sign Out</Link>
                </li>  
            </ul>
        </aside>
    );
};

export default DashboardAside;
