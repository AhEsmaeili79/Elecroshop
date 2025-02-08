import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import brand1 from '../../assets/images/brands/1.png';
import brand2 from '../../assets/images/brands/2.png';
import brand3 from '../../assets/images/brands/3.png';
import brand4 from '../../assets/images/brands/4.png';
import brand5 from '../../assets/images/brands/5.png';
import brand6 from '../../assets/images/brands/6.png';

const BrandCarousel = () => {
  const options = {
      nav: false,
      dots: false,
      margin: 30,
      loop: false,
      responsive: {
          0: { items: 2 },
          420: { items: 3 },
          600: { items: 4 },
          900: { items: 5 },
          1024: { items: 6 }
      }
  };

  const brandImages = [brand1, brand2, brand3, brand4, brand5, brand6];

  return (
    <>
        <div className="container" dir='ltr'>
          <hr className="mb-0" />
          <OwlCarousel className="owl-theme mt-5 mb-5" {...options}>
                  {brandImages.map((image, index) => (
                      <a href="#" className="brand" key={index}>
                      <img src={image} alt={`برند ${index}`} />
                  </a>
              ))}
          </OwlCarousel>
      </div>
    </>
  );
};

export default BrandCarousel;
