import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../../Home/new-arrivals/api/categoryapi';  // Import fetchCategories from api.js
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './css/category.css'

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to navigate to a different URL

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();  // Fetch categories from API
        setCategories(data);
      } catch (error) {
        setError('Error fetching categories.');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    // Navigate to the product page with the selected category as a query parameter
    navigate(`/product/?category=${categoryId}`);
  };

  return (
    <div className="container category-containter">
      <h2 className="title text-center mb-4">Explore Popular Categories</h2>
      {loading && <p>Loading categories...</p>}
      {error && <p className="error">{error}</p>}
      <div className="cat-blocks-container">
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-6 col-sm-4 col-lg-2">
              <a
                onClick={() => handleCategoryClick(category.id)} // Handle category click
                className="cat-block"
              >
                <figure>
                  <span>
                    <img
                      src={category.image || 'default-image.png'} // Use default image if none available
                      alt={`Category: ${category.name}`}
                    />
                  </span>
                </figure>
                <h3 className="cat-block-title">{category.name}</h3>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
