import { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProductCard from '../ProductCard/ProductCard';
import { fetchProductList } from '../../api/productdetail';
import { FaSpinner } from 'react-icons/fa'; 
import './css/productsection.css';

const ProductCarousel = ({ categoryId }) => {
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
      const response = await fetchProductList();
      let filteredProducts = response;

      if (categoryId) {
        filteredProducts = filteredProducts.filter(product => product.category.id === categoryId);
      }

      filteredProducts = filteredProducts.slice(0, 10);
      setProducts(filteredProducts);
      
      setTimeout(() => {
        setShowProducts(true);
      },200); 

    } catch (err) {
      setError('بارگذاری محصولات با مشکل مواجه شد. لطفا بعدا تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setShowProducts(false);  
    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    setShowProducts(false);  
  }, []);

  if (loading) return (
    <div className="loading-spinner">
      <FaSpinner className="spinner-icon" size={40} spin /> 
    </div>
  );
  
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className={`category-content ${showProducts ? 'visible' : ''} fade-transition`} dir='ltr'>
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
