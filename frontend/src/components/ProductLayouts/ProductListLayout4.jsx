import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ColorOptions from '../../utils/ColorOptions';
import QuantitySelector from './components/QuantitySelector';

const formatPrice = (price) => {
    const formattedPrice = price.toLocaleString();
    const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
    return persianNumerals;
};

const toPersianNumbers = (num) => {
    return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

const ProductPrice = ({ price }) => <div className="product-price">{formatPrice(price)} تومان</div>;

const ProductRating = ({ averageRating, reviewsCount }) => (
  <div className="ratings-container">
    <div className="ratings">
      <div className="ratings-val" style={{ width: `${(averageRating / 5) * 100}%` }}></div>
    </div>
    <span className="ratings-text">({toPersianNumbers(reviewsCount)} نظر)</span>
  </div>
);

const WishlistButton = ({ isInWishlist, handleWishlistToggle }) => (
  <a
    onClick={handleWishlistToggle}
    className={`btn-product-icon btn-expandable ${isInWishlist ? 'active' : ''}`}
    aria-label={isInWishlist ? 'حذف از لیست علاقه‌مندی‌ها' : 'افزودن به لیست علاقه‌مندی‌ها'}
  >
    {isInWishlist ? <FaHeart className="text-danger" style={{cursor:'pointer'}}/> : <FaRegHeart className="text-primary" style={{cursor:'pointer'}}/>}
    <span style={{cursor:'pointer'}}>{isInWishlist ? 'حذف از لیست علاقه‌مندی‌ها' : 'افزودن به لیست علاقه‌مندی‌ها'}</span>
  </a>
);

const ProductListLayout4 = ({
  product,
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
  reviewsCount,
}) => {
  const productCategory = product.category?.name || 'بدون دسته‌بندی';
  const productName = product.name || 'نام محصول';
  
  return (
    <div className="col-6 col-md-4 col-lg-4 col-xl-3">
      <div className="product product-7 text-center">
        <figure className="product-media">
          {productLabel && (
            <span className={`product-label ${productLabel}`}>
              {productLabel === 'label-new' ? 'جدید' : productLabel === 'label-low' ? 'موجودی کم' : 'تمام شده'}
            </span>
          )}

          <Link to={`/product/${product.id}`}>
            <img src={currentImage} alt={productName} className="product-image" />
          </Link>

          <div className="product-action-vertical">
            <WishlistButton isInWishlist={isInWishlist} handleWishlistToggle={handleWishlistToggle} />
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
            <a href="#">{productCategory}</a>
          </div>

          <h3 className="product-title">
            <Link to={`/product/${product.id}`}>{productName}</Link>
          </h3>

          <ProductPrice price={product.price} />
          <ProductRating averageRating={averageRating} reviewsCount={reviewsCount} />

          <div className="product-nav product-nav-thumbs">
            {product.images?.map((image, index) => (
              <a href="#" key={index} className={index === 0 ? 'active' : ''}>
                <img src={image.thumb} alt="product desc" />
              </a>
            ))}
          </div>

          <div className="details-row-color">
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

export default ProductListLayout4;
