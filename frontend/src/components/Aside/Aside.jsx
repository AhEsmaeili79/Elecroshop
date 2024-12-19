import { useState, useEffect } from 'react';
import './css/Aside.css';
import { fetchCategories, fetchBrands } from './api/Category';
import { fetchColors } from './api/Colors';

const AsideProduct = ({ setSelectedCategory, CategoryFiltered, setSelectedBrand, setSelectedColor, setPriceRange, priceRange }) => {
  // State definitions
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);

  // Fetch initial data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData, colorsData, productsData] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
          fetchColors(),
          fetch('http://127.0.0.1:8000/api/customer-products/').then((res) => res.json())
        ]);

        // Group products by category and count them
        const categoryProductCount = categoriesData.map(category => {
          const productCount = productsData.filter(product => product.category.id === category.id).length;
          return { ...category, productCount };
        });

        // Update state with the fetched data
        setCategories(categoryProductCount);
        setBrands(brandsData);
        setColors(colorsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  
  // Handle price range changes
  const handlePriceChange = (e) => {
    const newPriceRange = [...priceRange];
    const value = parseInt(e.target.value, 10);
    newPriceRange[1] = value;

    // Ensure the minimum price is not greater than the maximum price
    if (newPriceRange[0] > newPriceRange[1]) {
      newPriceRange[0] = newPriceRange[1];
    }

    setPriceRange(newPriceRange); // Pass the price range back to parent component
  };

  // Handle checkbox changes for categories, brands, etc.
  const handleCheckboxChange = (setSelected) => (e) => {
    const { id, checked } = e.target;
    setSelected((prev) => {
      const updatedItems = checked
        ? [...prev, id]
        : prev.filter((item) => item !== id);

      // Update the selected categories in parent component if applicable
      if (setSelected === setSelectedCategories) setSelectedCategory(updatedItems);
      if (setSelected === setSelectedBrands) setSelectedBrand(updatedItems);
      return updatedItems;
    });
  };

  const handleColorChange = (e, colorId) => {
    e.preventDefault();
  
    // Update the selected colors list by adding or removing the color ID
    setSelectedColors((prev) => {
      const updatedItems = prev.includes(colorId)
        ? prev.filter((id) => id !== colorId) // Remove if already selected
        : [...prev, colorId]; // Add if not selected
  
      // Create a new list where each item is in the format 'color-[index-item]'
      const updatedItemsWithColorPrefix = updatedItems.map((item) => `color-${item}`);
  
      // Update selected colors in parent component if applicable
      setSelectedColors(updatedItems);
      setSelectedColor(updatedItemsWithColorPrefix);
      return updatedItems;
    });
  };
  
  

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setPriceRange([0, 100000]);
    setSelectedCategory([]);
  };

  return (
    <aside className="col-lg-3 order-lg-first">
      <div className="sidebar sidebar-shop">
        {/* Clear Filters */}
        <div className="widget widget-clean">
          <label>Filters:</label>
          <a href="#" className="sidebar-filter-clear" onClick={clearAllFilters}>
            Clear All
          </a>
        </div>

        {/* Category Filter */}
        {CategoryFiltered ? null : (
          <div className="widget widget-collapsible">
            <h3 className="widget-title">
              <a
                data-toggle="collapse"
                href="#category"
                role="button"
                aria-expanded="false"
                aria-controls="category"
              >
                Categories
              </a>
            </h3>
            <div className="collapse" id="category">
              <div className="widget-body">
                <div className="filter-items category filter-items-count">
                  {categories
                    .filter((category) => category.productCount > 0) // Filter out categories with 0 product count
                    .map((category) => (
                    <div className="filter-item" key={category.id}>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`category-${category.id}`}
                          onChange={handleCheckboxChange(setSelectedCategories)}
                          checked={selectedCategories.includes(`category-${category.id}`)}
                        />
                        <label className="custom-control-label" htmlFor={`category-${category.id}`}>
                          {category.name}
                        </label>
                      </div>
                      <span className="item-count">{category.productCount || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Brand Filter */}
        <div className="widget widget-collapsible">
          <h3 className="widget-title">
            <a
              data-toggle="collapse"
              href="#brand"
              role="button"
              aria-expanded="false"
              aria-controls="brand"
            >
              Brands
            </a>
          </h3>
          <div className="collapse" id="brand">
            <div className="widget-body">
              <div className="filter-items category filter-items-count">
                {brands.map((brand) => (
                  <div className="filter-item" key={brand.id}>
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={`brand-${brand.id}`}
                        onChange={handleCheckboxChange(setSelectedBrands)}
                        checked={selectedBrands.includes(`brand-${brand.id}`)}
                      />
                      <label className="custom-control-label" htmlFor={`brand-${brand.id}`}>
                        {brand.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Color Filter */}
          <div className="widget widget-collapsible">
            <h3 className="widget-title">
              <a
                data-toggle="collapse"
                href="#widget-3"
                role="button"
                aria-expanded="false"
                aria-controls="widget-3"
              >
                Colors
              </a>
            </h3>
            <div className="collapse" id="widget-3">
              <div className="widget-body">
                <div className="filter-colors">
                {colors.map((color) => (
                  <a
                    href="#"
                    key={color.id}
                    style={{ background: color.color_hex }}
                    className={selectedColors.includes(color.id) ? 'selected' : ''}
                    onClick={(e) => handleColorChange(e, color.id)}
                  >
                    <span className="sr-only">{color.name || 'Color Name'}</span>
                  </a>
                ))}
                </div>
              </div>
            </div>
          </div>


        {/* Price Filter */}
        <div className="widget widget-collapsible">
          <h3 className="widget-title">
            <a
              data-toggle="collapse"
              href="#widget-5"
              role="button"
              aria-expanded="false"
              aria-controls="widget-5"
            >
              Price
            </a>
          </h3>
          <div className="collapse" id="widget-5">
            <div className="widget-body">
              <div className="filter-price">
                <div className="filter-price-text">
                  Price Range: <span id="filter-price-range">${priceRange[0]} - ${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                />
              </div>
            </div>
          </div>
          </div>
      </div>
    </aside>
  );
};

export default AsideProduct;
