import OwlCarousel from 'react-owl-carousel'; // Import the React Owl Carousel component
import 'owl.carousel/dist/assets/owl.carousel.css'; // Import the styles
import 'owl.carousel/dist/assets/owl.theme.default.css';
import ProductCard from '../../components/ProductCard/ProductCard';

// تصاویر محصول
import product1 from "../../assets/images/demos/demo-4/products/product-6.jpg";
import product2 from "../../assets/images/demos/demo-4/products/product-7.jpg";
import product3 from "../../assets/images/demos/demo-4/products/product-8.jpg";
import product4 from "../../assets/images/demos/demo-4/products/product-9.jpg";
import product5 from "../../assets/images/demos/demo-4/products/product-5.jpg";
import banner from "../../assets/images/demos/demo-4/banners/banner-4.jpg"

// تابع کمکی برای مخلوط کردن آرایه
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // جابجایی عناصر
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

  // محصولات دسته‌بندی
  const products = [
    { img: product5, label: 'مهم', category: 'تلویزیون و سیستم سینمای خانگی', title: 'Samsung - تلویزیون 55 اینچ LED هوشمند 2160p', price: '۸۹۹.۹۹ دلار', rating: 60, reviews: 5 },
    { img: product1, label: 'مهم', category: 'لپ‌تاپ‌ها', title: 'MacBook Pro نمایشگر 13 اینچ، i5', price: '۱۱۹۹.۹۹ دلار', rating: 100, reviews: 4 },
    { img: product3, label: 'جدید', category: 'تبلت‌ها', title: 'Apple - iPad Pro 11 اینچ ۲۵۶ گیگابایت', price: '۸۹۹.۹۹ دلار', rating: 80, reviews: 4 },
    { img: product2, label: '', category: 'صوتی', title: 'Bose - اسپیکر بلوتوث SoundLink', price: '۷۹.۹۹ دلار', rating: 60, reviews: 6 },
    { img: product4, label: 'فروش ویژه', category: 'گوشی همراه', title: 'Google - Pixel 3 XL ۱۲۸ گیگابایت', price: '۳۵.۴۱ دلار', oldPrice: '۴۱.۶۷ دلار', rating: 100, reviews: 10 },
    { img: product5, label: 'مهم', category: 'تلویزیون و سیستم سینمای خانگی', title: 'Samsung - تلویزیون 55 اینچ LED هوشمند 2160p', price: '۸۹۹.۹۹ دلار', rating: 60, reviews: 5 },
  ];

  // مخلوط کردن محصولات در دسته‌ها
  const shuffledProducts = shuffleArray(products);

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
