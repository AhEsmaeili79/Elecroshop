import React, { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProductCard from '../components/ProductCard';
import { fetchProductList } from '../../ProductDetail/api/productdetail'; // Import the new API
import './css/productsection.css';

const ProductCarousel = ({ categoryId, fadeKey }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProducts, setShowProducts] = useState(false);

  const options = {
    nav: true,
    dots: true,
    margin: 20,
    loop: false,
    responsive: {
      0: { items: 2 },
      480: { items: 2 },
      768: { items: 3 },
      992: { items: 4 },
      1200: { items: 5 },
    },
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetchProductList(); // Use the imported fetchProductList function
      let filteredProducts = response;

      if (categoryId) {
        filteredProducts = filteredProducts.filter(product => product.category.id === categoryId);
      }

      filteredProducts = filteredProducts.slice(0, 10); // Limit to 10 products
      setProducts(filteredProducts); // No shuffle applied
    } catch (err) {
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
      setShowProducts(true);
    }
  };

  useEffect(() => {
    setShowProducts(false); // Hide products before new category loads
    fetchProducts();
  }, [categoryId]);

  // Reset the fade-out effect by updating the key
  useEffect(() => {
    setShowProducts(false); // Reset the fade effect on category change
  }, [fadeKey]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className={`category-content ${showProducts ? 'visible' : ''} fade-transition`}>
      <OwlCarousel
        className="owl-carousel owl-full carousel-equal-height carousel-with-shadow"
        {...options}
      >
        {products.map((product, index) => (
          <div key={index} className="product-item">
            <ProductCard product={product} />
          </div>
        ))}
      </OwlCarousel>
      <div className="mb-4"></div>
    </div>
  );
};

export default ProductCarousel;
