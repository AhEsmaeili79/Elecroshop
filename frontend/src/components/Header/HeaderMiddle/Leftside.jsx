import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFiltersData } from '../../../api/FilterAsideApi';
import Sidebar from "../../MobileMenu/Sidebar";
import Logo from "../../../assets/images/logo.png";
import BannerImage from "../../../assets/images/menu/banner-1.jpg";
import Spinner from "../../Loading/loading";

const LeftSide = ({isLoggedIn, handleLogout ,username,toggleModal}) => {
  const [filters, setFilters] = useState({ categories: [], brands: [] });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [showLoading, setShowLoading] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(() => {
          setShowLoading(true);
        }, 300); 

        const filtersData = await fetchFiltersData();
        setFilters(filtersData);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching filters data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="header-left">
        <button className="mobile-menu-toggler" onClick={toggleSidebar}>
          <span className="sr-only">تغییر منوی موبایل</span>
          <i className="icon-bars"></i>
        </button>
        <Link to="/" className="logo">
          <img src={Logo} alt="لوگوی اکتروشاپ" width="105" height="25" />
        </Link>
        <nav className="main-nav">
          <ul className="menu sf-arrows">
            <li className="megamenu-container active">
              <Link to="/">خانه</Link>
            </li>
            
            <li>
              <Link to="/product" className="sf-with-ul">فروشگاه</Link>
              <div className="megamenu megamenu-md">
                <div className="row no-gutters">
                  <div className="col-md-8">
                    <div className="menu-col">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="menu-title">صفحات فروشگاه</div>
                          <ul>
                            <li><Link to="/cart">سبد خرید</Link></li>
                            <li><Link to="/dashboard">سفارشات</Link></li>
                            <li><Link to="/wishlist">لیست علاقمندی ها</Link></li>
                            <li><Link to="/dashboard">حساب کاربری من</Link></li>
                          </ul>
                        </div>

                        <div className="col-md-6">
                          <div className="menu-title">دسته‌بندی محصولات</div>
                          <ul>
                            {loading && showLoading ? ( 
                              <li>
                                <Spinner/>
                              </li>
                            ) : (
                              filters.categories.length > 0 ? (
                                filters.categories.map(category => (
                                  <li key={category.id}>
                                    <Link to={`/product/?category=${category.id}`}>
                                      {category.name}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <li>داده ای یافت نشد</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="banner banner-overlay">
                      <Link to="/product" className="banner banner-menu">
                        <img src={BannerImage} alt="بنر"/>
                        <div className="banner-content banner-content-top">
                          <div className="banner-title text-white">
                            آخرین <br/>فرصت<br/><span><strong>فروش</strong></span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <Link to="/product" className="sf-with-ul">برند</Link>
              <ul>
                {loading && showLoading ? ( 
                  <li>
                    <Spinner/>
                  </li>
                ) : (
                  filters.brands.length > 0 ? (
                    filters.brands.map(brand => (
                      <li key={brand.id}>
                        <Link to={`/brand/${brand.id}`}>{brand.name}</Link>
                      </li>
                    ))
                  ) : (
                    <li>داده ای یافت نشد</li>
                  )
                )}
              </ul>
            </li>

            <li>
              <Link to="/product">محصولات</Link>
            </li>
          </ul>
        </nav>
      </div>
      <Sidebar username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} toggleModal={toggleModal}/>
    </>
  );
};

export default LeftSide;
