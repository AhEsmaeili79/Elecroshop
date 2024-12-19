// src/components/Categories.js
import banner1 from '../../../assets/images/demos/demo-4/banners/banner-1.png';
import banner2 from '../../../assets/images/demos/demo-4/banners/banner-2.jpg';
import banner3 from '../../../assets/images/demos/demo-4/banners/banner-3.png';

const banners = [
  { img: banner1, subtitle: "Smart Offer", title: "Samsung Galaxy Note9", offer:"Save $150" },
  { img: banner2, subtitle: "Time Deals", title: "Bose SoundSport", offer:"Time Deal -30%" },
  { img: banner3, subtitle: "Clearance", title: "GoPro - Fusion 360", offer: "Save $70" },
];

const Offer1 = () => (
  <div className="container">
    <div className="row justify-content-center">
      {banners.map((banner, index) => (
        <div className="col-md-6 col-lg-4" key={index}>
          <div className="banner banner-overlay banner-overlay-light">
            <a href="#"><img src={banner.img} alt="Banner"/></a>
            <div className="banner-content">
              <h4 className="banner-subtitle"><a href="#">{banner.subtitle}</a></h4>
              <h3 className="banner-title"><a href="#"><strong>{banner.title}</strong><br />{banner.offer}</a></h3>
              <a href="#" className="banner-link">Shop Now<i className="icon-long-arrow-right"></i></a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Offer1;
