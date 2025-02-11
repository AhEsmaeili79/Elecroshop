import { useState, useEffect } from 'react';
import { fetchFiltersData } from '../../api/FilterAsideApi';
import CategoryFilter from './AsideComponents/CategoryFilter';
import BrandFilter from './AsideComponents/BrandFilter';
import ColorFilter from './AsideComponents/ColorFilter';
import PriceFilter from './AsideComponents/PriceFilter';

import './Aside.css';

const AsideProduct = ({ setSelectedCategory, CategoryFiltered, setSelectedBrand, setSelectedColor, setPriceRange, priceRange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { categories, brands, colors } = await fetchFiltersData();
        setCategories(categories);
        setBrands(brands);
        setColors(colors);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePriceChange = (e) => {
    const newPriceRange = [...priceRange];
    const value = parseInt(e.target.value, 10);
    newPriceRange[1] = value;

    if (newPriceRange[0] > newPriceRange[1]) {
      newPriceRange[0] = newPriceRange[1];
    }

    setPriceRange(newPriceRange);
  };

  const handleCheckboxChange = (setSelected) => (e) => {
    const { id, checked } = e.target;
    setSelected((prev) => {
      const updatedItems = checked
        ? [...prev, id]
        : prev.filter((item) => item !== id);

      if (setSelected === setSelectedCategories) setSelectedCategory(updatedItems);
      if (setSelected === setSelectedBrands) setSelectedBrand(updatedItems);
      return updatedItems;
    });
  };

  const handleColorChange = (e, colorId) => {
    e.preventDefault();
  
    setSelectedColors((prev) => {
      const updatedItems = prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId];
  
      const updatedItemsWithColorPrefix = updatedItems.map((item) => `color-${item}`);
  
      setSelectedColors(updatedItems);
      setSelectedColor(updatedItemsWithColorPrefix);
      return updatedItems;
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]); 
    setSelectedColors([]);     
    setSelectedBrands([]);     
    setPriceRange([0, 100000]);
    setSelectedCategory([]);   
    setSelectedBrand([]);      
    setSelectedColor([]);      
};


  return (
    <aside className="col-lg-3 order-lg-first">
      <div className="sidebar sidebar-shop">
        <div className="widget widget-clean">
          <label>فیلترها:</label>
          <a href='#' className="sidebar-filter-clear" onClick={resetFilters}>
            پاک کردن همه
          </a>
        </div>

        {CategoryFiltered ? null : (
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            handleCheckboxChange={handleCheckboxChange}
            setSelectedCategories={setSelectedCategories}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        <BrandFilter
          brands={brands}
          selectedBrands={selectedBrands}
          handleCheckboxChange={handleCheckboxChange}
          setSelectedBrands={setSelectedBrands}
          setSelectedBrand={setSelectedBrand}
        />

        <ColorFilter
          colors={colors}
          selectedColors={selectedColors}
          handleColorChange={handleColorChange}
          setSelectedColors={setSelectedColors}
          setSelectedColor={setSelectedColor}
        />

        <PriceFilter
          priceRange={priceRange}
          handlePriceChange={handlePriceChange}
        />
      </div>
    </aside>
  );
};

export default AsideProduct;