import { Link } from 'react-router-dom';
import ColorOptions from '../../utils/ColorOptions';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function formatPrice(price) {
    const formattedPrice = price.toLocaleString();
    
    const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
    return persianNumerals;
  }
  const toPersianNumerals = (number) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
  };
  
  const toPersianNumbers = (num) => {
    return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

const ProductListLayout1 = ({
  product,
  productLabel,
  currentImage,
  averageRating,
  reviewsCount,
  cartItem,
  quantity,
  handleAddToCart,
  handleRemoveFromCart,
  handleQuantityChange,
  handleWishlistToggle,
  isInWishlist,
  selectedColor,
  handleColorChange
}) => {
  return (
    <div className="product product-list">
      <div className="row">
        <div className="col-6 col-lg-3">
          <figure className="product-media">
            {productLabel && (
              <span className={`product-label ${productLabel}`}>
                {productLabel === 'label-new'
                  ? 'جدید'
                  : productLabel === 'label-low'
                  ? 'موجودی کم'
                  : 'تمام شده'}
              </span>
            )}
            <Link to={`/product/${product.id}`}>
              <img src={currentImage} alt={product.name} className="product-image" />
            </Link>
          </figure>
        </div>

        <div className="col-6 col-lg-3 order-lg-last">
          <div className="product-list-action">
            <div className="product-price">{formatPrice(product.price)} تومان</div>
            <div className="ratings-container">
              <div className="ratings">
                <div
                  className="ratings-val"
                  style={{ width: `${(averageRating / 5) * 100}%` }}
                ></div>
              </div>
              <span className="ratings-text">
                ({toPersianNumbers(reviewsCount)} نظر)
              </span>
            </div>

              {cartItem ? (
                <div className="details-filter-row details-filter-quantity">
                <div className="product-details-quantity">
                <div className="quantity-input">
                  <button
                    type="button"
                    className="btn-decrement"
                   onClick={() => (quantity === 1 ? handleRemoveFromCart() : handleQuantityChange(quantity - 1))}
                  >-
                  </button>
                  <input
                  type="text"
                  id="sticky-cart-qty"
                  className="form-control"
                  value={toPersianNumerals(quantity)}
                  min="1"
                  max="10"
                  />
                  
                  <button
                      type="button"
                      className="btn-increment" 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      >
                      +
                    </button>
                  </div>
                </div>
                </div>
  
              ) : (
                <a onClick={(e) => { e.preventDefault(); handleAddToCart(); }} className="btn-product btn-cart" title="افزودن به سبد خرید">
                  <span>افزودن به سبد خرید</span>
                </a>
              )}
            </div>
          </div>

        <div className="col-lg-6">
          <div className="product-body product-action-inner">
            
              <a
              onClick={handleWishlistToggle}
              className={`btn-wishlist ${isInWishlist ? 'active' : ''}`}
              aria-label={isInWishlist ? 'حذف از لیست علاقه‌مندی‌ها' : 'افزودن به لیست علاقه‌مندی‌ها'}
            >
              {isInWishlist ? <FaHeart className="text-danger" style={{cursor:'pointer'}}/> : <FaRegHeart className="text-primary" style={{cursor:'pointer'}}/>}
              <span style={{cursor:'pointer'}}>{isInWishlist ? 'حذف از لیست علاقه‌مندی‌ها' : 'افزودن به لیست علاقه‌مندی‌ها'}</span>
            </a>
              
            <div className="product-cat">
              <a href="#">{product.category?.name || 'بدون دسته‌بندی'}</a>
            </div>
            <h3 className="product-title">
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h3>

            <div className="product-content">
              <p>{product.desc || 'توضیحات محصول در دسترس نیست'}</p>
            </div>

            <div className="details-row-color" style={{marginRight:'10px',marginBottom:'10px'}}>
              <ColorOptions
                colors={product.color_quantities}
                selectedColor={selectedColor}
                handleColorChange={handleColorChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListLayout1;
