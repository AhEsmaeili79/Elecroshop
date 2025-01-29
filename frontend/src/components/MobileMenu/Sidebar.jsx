import { useState } from 'react';
import './sidebar.module-rtl.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';

const Sidebar = ({ username , isLoggedIn ,handleLogout ,toggleModal }) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

   
    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/product?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="sidebarr-containerr">
            <div className={`sidebarr ${isOpen ? 'open' : ''}`}>
                <div className="logo-details">
                    <Link to="/" className="logo_name">
                        <img src={Logo} alt="لوگوی اکتروشاپ" width="105" height="25" />
                    </Link>
                    <i
                        className={`bx ${isOpen ? 'bx-menu-alt-right' : 'bx-menu'}`}
                        id="btn"
                        onClick={toggleSidebar}
                    ></i>
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
                        <Link to="/">
                            <i className="bx bx-home-alt"></i>
                            <span className="links_name">صفحه اصلی</span>
                        </Link>
                        <span className="tooltip">صفحه اصلی</span>
                    </li>
                    <li>
                        <Link to="/product">
                            <i className="bx bx-grid-alt"></i>
                            <span className="links_name">محصولات</span>
                        </Link>
                        <span className="tooltip">محصولات</span>
                    </li>
                    <li>
                        <Link to="/wishlist">
                            <i className="bx bx-heart"></i>
                            <span className="links_name">لیست علاقه‌مندی‌ها</span>
                        </Link>
                        <span className="tooltip">لیست علاقه‌مندی‌ها</span>
                    </li>
                    <li>
                        <Link to="/dashboard">
                            <i className="bx bx-user-circle"></i>
                            <span className="links_name">داشبورد</span>
                        </Link>
                        <span className="tooltip">داشبورد</span>
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
                        ):
                        <>
                        <Link onClick={toggleModal}>
                            <i className="bx bx-log-in" id="log_out"></i>
                            <span className="links_name">ورود</span>
                        </Link>
                        <span className="tooltip">ورود</span>
                        </>
                        }
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
