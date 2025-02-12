import { useState } from 'react';
import ItemTitle from "./ItemTitle";
import ProductCarousel from '../../components/NewArrivel/productsetcion' 

const NewArrivals = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); 

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId); 
  };

  return (
    <div className="container new-arrivals">
      <ItemTitle onCategoryChange={handleCategoryChange} selectedCategory={selectedCategory} />
      <ProductCarousel categoryId={selectedCategory} /> 
    </div>
  );
};

export default NewArrivals;
