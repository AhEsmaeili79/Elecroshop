import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ColorOptions from '../../utils/ColorOptions'; 
import QuantitySelector from './components/QuantitySelector';

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
const ProductListLayout2 = ({  product,
    productLabel,
    currentImage,
    isInWishlist,
    handleWishlistToggle,
    cartItem,
    quantity,
    handleQuantityChange,
    handleRemoveFromCart,
    handleAddToCart,
    selectedColor,
    handleColorChange,
    averageRating,
    reviewsCount }) => {

  return (
    <div className="col-6">
    <div className="product product-7 text-center">
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
  
        <div className="product-action-vertical">
          <a
            onClick={handleWishlistToggle}
            className={`btn-product-icon btn-expandable ${isInWishlist ? 'active' : ''}`}
          >
            {isInWishlist ? (
              <FaHeart className="text-danger" style={{cursor:'pointer'}}/>
            ) : (
              <FaRegHeart className="text-primary" style={{cursor:'pointer'}}/>
            )}
            <span style={{cursor:'pointer'}}>
              {isInWishlist ? 'حذف از لیست علاقه‌مندی‌ها' : 'افزودن به لیست علاقه‌مندی‌ها'}
            </span>
          </a>
          <a className="btn-product-icon btn-quickview" title="مشاهده سریع">
            <span>مشاهده سریع</span>
          </a>
        </div>
  
          {cartItem ? (
              <QuantitySelector
              initialQuantity={1}
              handleQuantityChange={(newQuantity) => console.log('New Quantity:', newQuantity)}
              handleRemoveFromCart={() => console.log('Item removed from cart')}
            />
          ) : (
              <a onClick={(e) => { e.preventDefault(); handleAddToCart(); }} className="btn-product btn-cart" title="افزودن به سبد خرید">
                  <span>افزودن به سبد خرید</span>
              </a>
          )}
      </figure>
  
      <div className="product-body">
        <div className="product-cat">
          <a href="#">{product.category?.name || 'بدون دسته‌بندی'}</a>
        </div>
        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-price">{formatPrice(product.price)} تومان</div>
        <div className="ratings-container">
          <div className="ratings">
            <div className="ratings-val" style={{ width: `${(averageRating / 5) * 100}%` }}></div>
          </div>
          <span className="ratings-text">({toPersianNumbers(reviewsCount)} نظر)</span>
        </div>
        <div className="product-nav">
            <ColorOptions
              colors={product.color_quantities}
              selectedColor={selectedColor}
              handleColorChange={handleColorChange}
            />
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default ProductListLayout2;
