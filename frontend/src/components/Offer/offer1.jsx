// src/components/Categories.js
import banner1 from '../../assets/images/demos/demo-4/banners/banner-1.png';
import banner2 from '../../assets/images/demos/demo-4/banners/banner-2.jpg';
import banner3 from '../../assets/images/demos/demo-4/banners/banner-3.png';

const banners = [
  { img: banner1, subtitle: "پیشنهاد هوشمند", title: "Samsung Galaxy Note9", offer:"صرفه جویی ۱۵۰ دلار" },
  { img: banner2, subtitle: "تخفیف های زمانی", title: "Bose SoundSport", offer:"تخفیف زمانی -۳۰%" },
  { img: banner3, subtitle: "حراجی", title: "GoPro - Fusion 360", offer: "صرفه جویی ۷۰ دلار" },
];

const Offer1 = () => (
  <div className="container">
    <div className="row justify-content-center">
      {banners.map((banner, index) => (
        <div className="col-md-6 col-lg-4" key={index}>
          <div className="banner banner-overlay banner-overlay-light">
            <a href="#"><img src={banner.img} alt="بنر"/></a>
            <div className="banner-content">
              <h4 className="banner-subtitle"><a href="#">{banner.subtitle}</a></h4>
              <h3 className="banner-title"><a href="#"><strong>{banner.title}</strong><br />{banner.offer}</a></h3>
              <a href="#" className="banner-link">خرید اکنون<i className="icon-long-arrow-right"></i></a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Offer1;
