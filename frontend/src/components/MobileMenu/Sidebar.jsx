import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./sidebar.module-rtl.css";
import Logo from "../../assets/images/logo.png";

const Sidebar = ({ isOpen, toggleSidebar, username, isLoggedIn, handleLogout, toggleModal }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const sidebarRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        if (sidebarRef.current && btnRef.current) {
            if (sidebarRef.current.classList.contains("open")) {
                btnRef.current.classList.replace("bx-menu", "bx-menu-alt-right");
            } else {
                btnRef.current.classList.replace("bx-menu-alt-right", "bx-menu");
            }
        }
    }, [isOpen]); 

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/product?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className={`sidebarr-containerr ${isOpen ? "open" : ""}`}>
            <div className={`sidebarr ${isOpen ? "open" : ""}`} ref={sidebarRef}>
                <div className="logo-details">
                    <Link to="/" className="logo_name">
                        <img src={Logo} alt="لوگوی اکتروشاپ" width="105" height="25" />
                    </Link>
                    <i className="bx bx-menu" id="btn" onClick={toggleSidebar} ref={btnRef}></i>
                </div>
                <ul className="nav-list">
                    <li>
                        <form onSubmit={handleSearch}>
                            <i className="bx bx-search"></i>
                            <input
                                type="text"
                                placeholder="جستجو..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <span className="tooltip">جستجو</span>
                        </form>
                    </li>
                    <li>
                        <Link to="/" onClick={toggleSidebar}>
                            <i className="bx bx-home-alt"></i>
                            <span className="links_name">صفحه اصلی</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/product" onClick={toggleSidebar}>
                            <i className="bx bx-grid-alt"></i>
                            <span className="links_name">محصولات</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/wishlist" onClick={toggleSidebar}>
                            <i className="bx bx-heart"></i>
                            <span className="links_name">لیست علاقه‌مندی‌ها</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard" onClick={toggleSidebar}>
                            <i className="bx bx-user-circle"></i>
                            <span className="links_name">داشبورد</span>
                        </Link>
                    </li>
                    <li className="profile">
                        {isLoggedIn ? (
                            <>
                                <div className="profile-details">
                                    <Link to="/dashboard">
                                        <img src={username.profile_image} alt="profileImg" />
                                        <div className="name_job">
                                            <div className="name">{username.first_name}</div>
                                            <div className="job">{username.role}</div>
                                        </div>
                                    </Link>
                                </div>
                                <Link onClick={handleLogout}>
                                    <i className="bx bx-log-out" id="log_out"></i>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link onClick={toggleModal}>
                                    <i className="bx bx-log-in" id="log_out"></i>
                                    <span className="links_name">ورود</span>
                                </Link>
                            </>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
