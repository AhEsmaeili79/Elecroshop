import { Link } from 'react-router-dom';
import Wishlist from './Wishlist';
import Favorites from './Favorites';
import Cart from './Cart';
import Logo from '../../../assets/images/logo.png';
import SearchComponent from './Search';


const HeaderMiddle = () => {
    return (
        <div className="header-middle">
            <div className="container">
                <div className="header-left">
                    <button className="mobile-menu-toggler">
                        <span className="sr-only">تنظیم منوی موبایل</span>
                        <i className="icon-bars"></i>
                    </button>
                    <Link to='/' className="logo" >
                        <img src={Logo} alt="لوگوی اکتروشاپ" width="105" height="25" />
                    </Link>
                </div>
                <SearchComponent />
                <div className="header-right">
                    {/* Wishlist, Favorites, and Cart sections */}
                    <Wishlist />
                    <Favorites />
                    <Cart />
                </div>
            </div>
        </div>
    );
};

export default HeaderMiddle;
