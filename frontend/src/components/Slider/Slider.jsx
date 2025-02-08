import OwlCarousel from 'react-owl-carousel';
import slide1 from '../../assets/images/demos/demo-4/slider/slide-1.png';
import slide2 from '../../assets/images/demos/demo-4/slider/slide-2.png';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import './slider.css';

const slides = [
  {
    image: slide1,
    subtitle: 'تخفیف‌ها و پیشنهادات',
    title1: 'Samsung',
    title2: 'Galaxy S25 Ultra',
    oldPrice: '۹,۵۰۰,۰۰۰',
    newPrice: '۹,۲۴۹,۰۰۰ ',
    linkText: 'خرید ',
    linkHref: 'product',
  },
  {
    image: slide2,
    subtitle: 'تخفیف‌ها و پیشنهادات',
    title1: 'Beats by',
    title2: 'Dre Studio 3',
    oldPrice: '۷۵۹,۰۰۰',
    newPrice: '۳۹۰,۰۰۰',
    linkText: 'خرید ',
    linkHref: 'product',
  }
];

const Slider = () => {
  return (
    <div className="intro-slider-container mb-5" dir="ltr">
      <OwlCarousel
        className="intro-slider owl-carousel owl-theme"
        dots
        nav={false}  
        responsive={{
          0: { items: 1 },
          480: { items: 1 },
          1200: { items: 1, nav: false, dots: true } 
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="intro-slide" style={{ backgroundImage: `url(${slide.image})` }}>
            <div className="container intro-content">
              <div className="row justify-content-end">
                <div className="col-auto col-sm-7 col-md-6 col-lg-5">
                  <h3 className="intro-subtitle text-third">{slide.subtitle}</h3>
                  <h1 className="intro-title">{slide.title1}</h1>
                  <h1 className="intro-title">{slide.title2}</h1>
                  <div className="intro-price" dir='rtl'>
                    <sup className="intro-old-price">{slide.oldPrice} تومان </sup>
                    <span className="text-third"> {slide.newPrice}تومان </span>
                  </div>
                  <a href={slide.linkHref} className="btn btn-primary btn-round">
                    <span>{slide.linkText}</span>
                    <i className="icon-long-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </OwlCarousel>
      <span className="slider-loader"></span>
    </div>
  );
};

export default Slider;
