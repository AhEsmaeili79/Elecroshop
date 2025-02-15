import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchFiltersData } from '../../api/FilterAsideApi';
import image from "../../assets/images/menu/banner-1.jpg";

const HeaderBottom = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filtersData = await fetchFiltersData();
        setCategories(filtersData.categories);
        setBrands(filtersData.brands); 
      } catch (error) {
        console.error('Error fetching filters data', error);
      }
    };

    fetchData();
  }, []);

  const displayedCategories = useMemo(() => categories.slice(0, 4), [categories]);

  const groupedBrands = useMemo(() => {
    const groups = [];
    for (let i = 0; i < brands.length; i += 10) {
      groups.push(brands.slice(i, i + 10));
    }
    return groups;
  }, [brands]);

  return (
    <div className="header-bottom sticky-header">
      <div className="container">
        <div className="header-left"></div>
        <div className="header-center">
          <nav className="main-nav">
            <ul className="menu sf-arrows">
              <li className="megamenu-container active">
                <Link to="/">خانه</Link>
              </li>

              {displayedCategories.map((category, index) => (
                <li key={category.id} className="megamenu-container">
                  <Link to={`/product/?category=${category.id}`} className="sf-with-ul">
                    {category.name}
                  </Link>
                  <div className="megamenu megamenu-md">
                    <div className="row no-gutters">
                      <div className="col-md-8">
                        <div className="menu-col">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="menu-title">برند های {category.name}</div>
                              <ul>
                                {groupedBrands[index] && groupedBrands[index].map(brand => (
                                  <li key={brand.id}>
                                    <Link to={`/product`}>{brand.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="banner banner-overlay">
                          <Link to={`/product/?category=${category.id}`} className="banner banner-menu">
                            <img src={image} alt="بنر" />
                            <div className="banner-content banner-content-top">
                              <div className="banner-title text-white">
                                {category.name} <br />جدیدترین‌ها<br /><span><strong>فروش ویژه</strong></span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}

              <li>
                <Link to="/brands" className="sf-with-ul">برند ها</Link>
                <ul>
                  {brands.slice(0, 7).map(brand => (
                    <li key={brand.id}>
                      <Link to={`/brand/${brand.id}`}>{brand.name}</Link>
                    </li>
                  ))}
                </ul>

              </li>
              <li>
                <Link to="/product">محصولات</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
