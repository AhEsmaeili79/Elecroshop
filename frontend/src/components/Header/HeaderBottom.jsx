import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFiltersData } from '../../api/FilterAsideApi';

import image from "../../assets/images/menu/banner-1.jpg";

const HeaderBottom = () => {
  const [filters, setFilters] = useState({ categories: [], brands: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filtersData = await fetchFiltersData();
        setFilters(filtersData); 
      } catch (error) {
        console.log('Error fetching filters data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="header-bottom sticky-header">
      <div className="container">
        <div className="header-left"></div>
        <div className="header-center">
          <nav className="main-nav">
            <ul className="menu sf-arrows">
              <li className="megamenu-container active">
                <Link to="/" className="">خانه</Link>
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
                              {filters.categories.map(category => (
                                <li key={category.id}>
                                  <Link to={`/product/?category=${category.id}`}>
                                    {category.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="banner banner-overlay">
                        <Link to="/category" className="banner banner-menu">
                          <img src={image} alt="بنر"/>
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
                <Link to="/brands" className="sf-with-ul">برند ها</Link>
                <ul>
                  {filters.brands.map(brand => (
                    <li key={brand.id}><Link to={`/brand/${brand.id}`}>{brand.name}</Link></li>
                  ))}
                </ul>
              </li>
              <li>
                <Link to="/product" className="">محصولات</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
