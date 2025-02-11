import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ColorOptions from '../../utils/ColorOptions';

const formatPrice = (price) => {
    const formattedPrice = price.toLocaleString();
    const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
    return persianNumerals;
};

const toPersianNumbers = (num) => {
    return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

const toPersianNumerals = (number) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
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

const CartActions = ({
  cartItem, quantity, handleQuantityChange, handleRemoveFromCart, handleAddToCart,
}) => (
  cartItem ? (
    <div className="details-filter-row details-filter-quantity">
      <div className="product-details-quantity">
        <div className="quantity-input">
          <button
            type="button"
            className="btn-decrement"
            onClick={() => (quantity === 1 ? handleRemoveFromCart() : handleQuantityChange(quantity - 1))}
          >-</button>
          <input
            type="text"
            id="sticky-cart-qty"
            className="form-control"
            value={toPersianNumerals(quantity)}
            min="1"
            max="10"
            readOnly
          />
          <button
            type="button"
            className="btn-increment"
            onClick={() => handleQuantityChange(quantity + 1)}
          >+</button>
        </div>
      </div>
    </div>
  ) : (
    <a onClick={(e) => { e.preventDefault(); handleAddToCart(); }} className="btn-product btn-cart" title="افزودن به سبد خرید">
      <span>افزودن به سبد خرید</span>
    </a>
  )
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
            <a className="btn-product-icon btn-quickview" title="مشاهده سریع" aria-label="مشاهده سریع">
              <span>مشاهده سریع</span>
            </a>
            <a href="#" className="btn-product-icon btn-compare" title="مقایسه" aria-label="مقایسه">
              <span>مقایسه</span>
            </a>
          </div>

          <CartActions
            cartItem={cartItem}
            quantity={quantity}
            handleQuantityChange={handleQuantityChange}
            handleRemoveFromCart={handleRemoveFromCart}
            handleAddToCart={handleAddToCart}
          />
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
              colors={product.colors}
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
