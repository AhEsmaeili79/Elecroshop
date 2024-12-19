import React, { useState } from 'react';
import ItemTitle from "./ItemTitle";
import ProductCarousel from "./productsetcion"; // Make sure ProductCarousel is imported

const NewArrivals = () => {
  const [selectedCategory, setSelectedCategory] = useState(null); // Set to null to make "All" active initially
  const [fadeKey, setFadeKey] = useState(0); // Key to trigger fade in/out

  const handleCategoryChange = (categoryId) => {
    setFadeKey(prevKey => prevKey + 1); // Increment key to trigger re-render and fade effect
    setSelectedCategory(categoryId); // Update the selected category (or null for "All")
  };

  return (
    <div className="container new-arrivals">
      <ItemTitle onCategoryChange={handleCategoryChange} selectedCategory={selectedCategory} />
      <ProductCarousel categoryId={selectedCategory} fadeKey={fadeKey} /> {/* Pass fadeKey to trigger fade-in effect */}
    </div>
  );
};

export default NewArrivals;
