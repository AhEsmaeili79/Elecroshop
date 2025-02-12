import { useEffect, useState } from 'react';
import OwlCarousel from 'react-owl-carousel'; 
import 'owl.carousel/dist/assets/owl.carousel.css'; 
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProductCard from '../../components/ProductCard/ProductCard';
import { fetchProductList } from '../../api/productdetail'; 
import { FaSpinner } from 'react-icons/fa'; 
import banner from "../../assets/images/demos/demo-4/banners/banner-4.jpg"; 

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
  }
  return shuffled;
};

const ProductCarousel = ({ activeTab }) => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductList(); 
        setProducts(shuffleArray(data));
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false); 
      }
    };

    loadProducts();
  }, []); 

  useEffect(() => {
    if (!loading) {
      const shuffledProducts = shuffleArray(products);
      setProducts(shuffledProducts);
    }
  }, [activeTab, loading]);

  const options = {
    nav: true,
    dots: false,
    margin: 20,
    loop: false,
    responsive: {
      0: { items: 2 },
      480: { items: 2 },
      768: { items: 3 },
      992: { items: 4 },
    }
  };

  if (loading) return (
      <div className="loading-spinner">
        <FaSpinner className="spinner-icon" size={40} spin /> 
      </div>
    );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="row">
        <div className="col-xl-5col d-none d-xl-block">
            <div className="banner">
                <a href="#">
                    <img src={banner} alt="بنر"/>
                </a>
            </div>
        </div>
        
        <div className="col-xl-4-5col" dir='ltr'>
          <OwlCarousel className="owl-carousel owl-full carousel-equal-height carousel-with-shadow" {...options}>
          {products.map((product, index) => (
          <ProductCard key={index} product={product} />
          ))}
          </OwlCarousel>
        </div>
      </div>
    </>
  );
};

export default ProductCarousel;
