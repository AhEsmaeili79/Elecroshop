import { useState } from 'react';
import { Link } from 'react-router-dom';
import Wishlist from './Wishlist';
import Cart from './Cart';
import Logo from '../../../assets/images/logo.png';
import SearchComponent from './Search';
import Sidebar from '../../MobileMenu/Sidebar';

const HeaderMiddle = ({isLoggedIn, handleLogout ,username,toggleModal}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className="header-middle">
                <div className="container">
                    <div className="header-left">
                        <button className="mobile-menu-toggler" onClick={toggleSidebar}>
                            <span className="sr-only">تنظیم منوی موبایل</span>
                            <i className="icon-bars"></i>
                        </button>
                        <Link to='/' className="logo">
                            <img src={Logo} alt="لوگوی اکتروشاپ" width="105" height="25" />
                        </Link>
                    </div>
                    <SearchComponent />
                    <div className="header-right">
                        <Wishlist />
                        <Cart />
                    </div>
                </div>
            </div>
            <Sidebar username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} toggleModal={toggleModal}/>
        </>
    );
};

export default HeaderMiddle;
