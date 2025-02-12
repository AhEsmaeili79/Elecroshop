import ColorOptions from "../../../../utils/ColorOptions";
import { FaHeart, FaRegHeart } from 'react-icons/fa'; 
import { useEffect, useState } from 'react';
const StickyBar = ({
    product,
  selectedColor,
  quantity,
  setQuantity,
  handleAddToCart,
  handleAddToWishlist,
  isFavorited,
  handleColorChange,
  buttonText,
  btnClass,
}) => {
    const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

    const toPersianNumerals = (number) => {
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
      };
      
        const handleChange = (e) => {
          const numericValue = e.target.value.replace(/[^\d]/g, ''); 
          setQuantity(Math.max(1, Math.min(10, Number(numericValue))));
        };

    function formatPrice(price) {
        const formattedPrice = price.toLocaleString();
        
        const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
        return persianNumerals;
      }
    return (
        <div className="sticky-bar" style={{zIndex:'199', transition: 'transform 0.5s ease',display: isVisible ? 'block' : 'none',}}>
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <figure className="product-media">
                            <a href="product.html">
                                <img src={product.main_photo} alt="Product image" />
                            </a>
                        </figure>
                        <h4 className="product-title">
                            {product.name}
                        </h4>
                    </div>

                    <div className="col-6 justify-content-end">
                    <div className="product-price text-dark">{formatPrice(product.price * quantity)} تومان</div>
                    <div style={{marginLeft:'10px'}}>
                        <ColorOptions
                            colors={product.colors}
                            selectedColor={selectedColor}
                            handleColorChange={handleColorChange}
                            />
                    </div>
                    <div className="product-details-quantity">
                        <div className="quantity-input">
                            <button
                            type="button"
                            className="btn-decrement"
                            onClick={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}
                            >
                            -
                            </button>
                            <input
                            type="text"
                            id="sticky-cart-qty"
                            className="form-control"
                            value={toPersianNumerals(quantity)}
                            onChange={handleChange}
                            min="1"
                            max="10"
                            />
                            <button
                            type="button"
                            className="btn-increment"
                            onClick={() => setQuantity((prevQuantity) => Math.min(10, prevQuantity + 1))}
                            >
                            +
                            </button>
                            </div>
                    </div>
                        <div className="product-details-action">
                            <a className={`btn-product btn-cart ${btnClass}`} onClick={handleAddToCart}>
                                <span>{buttonText}</span>
                            </a>
                        </div>
                        
                        <div>
                            <a 
                            className={`${isFavorited ? 'text-danger' : 'text-dark'}`} 
                            title="علاقه مندی"
                            onClick={handleAddToWishlist}
                            style={{
                              borderRadius: '4px', 
                              padding: '8px 16px', 
                              cursor: 'pointer', 
                              display: 'flex', 
                              alignItems: 'center'
                            }}
                          >
                            {isFavorited ? <FaHeart className="text-danger" /> : <FaRegHeart className="text-dark" />}
                          </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyBar;
