import { useState } from 'react';
import ItemTitle from "./ItemTitle";
import ProductCarousel from '../../components/NewArrivel/productsetcion' 

const NewArrivals = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [fadeKey, setFadeKey] = useState(0);

  const handleCategoryChange = (categoryId) => {
    setFadeKey(prevKey => prevKey + 1); 
    setSelectedCategory(categoryId); 
  };

  return (
    <div className="container new-arrivals">
      <ItemTitle onCategoryChange={handleCategoryChange} selectedCategory={selectedCategory} />
      <ProductCarousel categoryId={selectedCategory} fadeKey={fadeKey} /> 
    </div>
  );
};

export default NewArrivals;
