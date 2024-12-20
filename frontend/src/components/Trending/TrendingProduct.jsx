
import OwlCarousel from 'react-owl-carousel'; // Import the React Owl Carousel component
import 'owl.carousel/dist/assets/owl.carousel.css'; // Import the styles
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProductCard from '../../components/ProductCard/ProductCard';

// Product Images
import product1 from "../../assets/images/demos/demo-4/products/product-6.jpg";
import product2 from "../../assets/images/demos/demo-4/products/product-7.jpg";
import product3 from "../../assets/images/demos/demo-4/products/product-8.jpg";
import product4 from "../../assets/images/demos/demo-4/products/product-9.jpg";
import product5 from "../../assets/images/demos/demo-4/products/product-5.jpg";
import banner from "../../assets/images/demos/demo-4/banners/banner-4.jpg"

// Utility function to shuffle the array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
};

const ProductCarousel = () => {
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

  // Category products
  const products = [
    { img: product5, label: 'Top', category: 'TV & Home Theater', title: 'Samsung - 55" Class LED 2160p Smart', price: '$899.99', rating: 60, reviews: 5 },
    { img: product1, label: 'Top', category: 'Laptops', title: 'MacBook Pro 13" Display, i5', price: '$1,199.99', rating: 100, reviews: 4 },
    { img: product3, label: 'New', category: 'Tablets', title: 'Apple - 11 Inch iPad Pro 256GB', price: '$899.99', rating: 80, reviews: 4 },
    { img: product2, label: '', category: 'Audio', title: 'Bose - SoundLink Bluetooth Speaker', price: '$79.99', rating: 60, reviews: 6 },
    { img: product4, label: 'Top Sale', category: 'Cell Phone', title: 'Google - Pixel 3 XL 128GB', price: '$35.41', oldPrice: '$41.67', rating: 100, reviews: 10 },
    { img: product5, label: 'Top', category: 'TV & Home Theater', title: 'Samsung - 55" Class LED 2160p Smart', price: '$899.99', rating: 60, reviews: 5 },
  ];

  // Shuffle products within categories
  const shuffledProducts = shuffleArray(products);

  return (
    <>
      <div className="row">
        <div className="col-xl-5col d-none d-xl-block">
            <div className="banner">
                <a href="#">
                    <img src={banner} alt="banner"/>
                </a>
            </div>
        </div>
        
        <div className="col-xl-4-5col">
          <OwlCarousel className="owl-carousel owl-full carousel-equal-height carousel-with-shadow" {...options}>
          {shuffledProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
          ))}
          </OwlCarousel>
        </div>
      </div>
    </>
  );
};

export default ProductCarousel;
