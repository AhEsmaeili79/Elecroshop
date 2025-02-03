import { useEffect, useState } from "react";
import WishlistButton from "./WishlistButton";
import QuantityInput from "./QuantityInput";
import ColorOptions from "../../../../utils/ColorOptions.jsx";
import { fetchReviews } from "../../../../api/reviews.js";

const ProductDetails = ({
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
  const [reviews, setReviews] = useState([]);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const fetchedReviews = await fetchReviews(product.id); 
        setReviews(fetchedReviews);
        setReviewsCount(fetchedReviews.length);

        if (fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce((acc, review) => acc + review.rating, 0);
          const avgRating = totalRating / fetchedReviews.length;
          setAverageRating(avgRating);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (product.id) {
      loadReviews();
    }
  }, [product.id]); 

  const ratingPercentage = (averageRating / 5) * 100;

  const categories = [product.category]; 

  const toPersianNumerals = (number) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
  };

  return (
    <div className="product-details">
      <h1 className="product-title">{product.name}</h1>

      <div className="ratings-container">
        <div className="ratings">
          <div className="ratings-val" style={{ width: `${ratingPercentage}%` }}></div>
        </div>

        <a className="ratings-text" href="#product-review-link">
          {averageRating > 0 ? `${toPersianNumerals(averageRating.toFixed(1))} / ۵` : "هیچ امتیازی هنوز ثبت نشده است"} ({toPersianNumerals(reviewsCount)} نظر{toPersianNumerals(reviewsCount) !== 1 ? "ها" : ""})
        </a>
      </div>

      <div className="product-price">{toPersianNumerals(product.price)} تومان</div>

      <div className="product-content">
        
      </div>

      <div className="details-filter-row details-row-color">
        <label>رنگ:</label>
        <ColorOptions
          colors={product.colors}
          selectedColor={selectedColor}
          handleColorChange={handleColorChange}
        />
      </div>

      <div className="details-filter-row details-row-size">
        <label htmlFor="size">توضیحات:</label>
        
        <div >
          <p>{product.desc}</p>
        </div>
      </div>


      <div className="details-filter-row details-row-size">
        <label htmlFor="qty">تعداد:</label>
        <QuantityInput quantity={quantity} setQuantity={setQuantity} />
      </div>

      <div className="product-details-action">
        <a className={`btn-product btn-cart ${btnClass}`} onClick={handleAddToCart}>
          <span>{buttonText}</span>
        </a>
        <div className="details-action-wrapper">
          <WishlistButton
            isFavorited={isFavorited}
            handleAddToWishlist={handleAddToWishlist}
          />
          <a href="#" className="btn-product btn-compare" title="مقایسه">
            <span>افزودن به مقایسه</span>
          </a>
        </div>
      </div>

      <div className="product-details-footer">
        <div className="product-cat">
          <span>دسته‌بندی:</span>

          {categories.map((category, index) => (
            <a key={index} href="#">
              {category.name}
            </a>
          ))}
        </div>
        <div className="social-icons social-icons-sm">
          <span className="social-label">اشتراک‌گذاری:</span>
          <a href="#" className="social-icon" title="فیس‌بوک" target="_blank">
            <i className="icon-facebook-f"></i>
          </a>
          <a href="#" className="social-icon" title="توییتر" target="_blank">
            <i className="icon-twitter"></i>
          </a>
          <a href="#" className="social-icon" title="اینستاگرام" target="_blank">
            <i className="icon-instagram"></i>
          </a>
          <a href="#" className="social-icon" title="پینترست" target="_blank">
            <i className="icon-pinterest"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
