import OwlCarousel from 'react-owl-carousel';
import slide1 from '../../../assets/images/demos/demo-4/slider/slide-1.png';

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import "./css/slider.css"

const Slider = () => {
  return (
    <div className="intro-slider-container mb-5">
      <OwlCarousel
        className="intro-slider owl-carousel owl-theme"
        dots
        nav={false}  // Ensure nav is false
        responsive={{
          0: { items: 1 },
          1200: { items: 1, nav: false, dots: true } // Make sure nav is false here as well
        }}
      >
        <div className="intro-slide" style={{ backgroundImage: `url(${slide1})` }}>
          <div className="container intro-content">
            <div className="row justify-content-end">
              <div className="col-auto col-sm-7 col-md-6 col-lg-5">
                <h3 className="intro-subtitle text-third">Deals and Promotions</h3>
                <h1 className="intro-title">Beats by</h1>
                <h1 className="intro-title">Dre Studio 3</h1>
                <div className="intro-price">
                  <sup className="intro-old-price">$349.95</sup>
                  <span className="text-third">$279<sup>.99</sup></span>
                </div>
                <a href="category.html" className="btn btn-primary btn-round">
                  <span>Shop More</span>
                  <i className="icon-long-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="intro-slide" style={{ backgroundImage: `url(${slide1})` }}>
          <div className="container intro-content">
            <div className="row justify-content-end">
              <div className="col-auto col-sm-7 col-md-6 col-lg-5">
                <h3 className="intro-subtitle text-third">Deals and Promotions</h3>
                <h1 className="intro-title">Beats by</h1>
                <h1 className="intro-title">Dre Studio 3</h1>
                <div className="intro-price">
                  <sup className="intro-old-price">$349.95</sup>
                  <span className="text-third">$279<sup>.99</sup></span>
                </div>
                <a href="category.html" className="btn btn-primary btn-round">
                  <span>Shop More</span>
                  <i className="icon-long-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </OwlCarousel>
      <span className="slider-loader"></span>
    </div>
  );
};

export default Slider;
