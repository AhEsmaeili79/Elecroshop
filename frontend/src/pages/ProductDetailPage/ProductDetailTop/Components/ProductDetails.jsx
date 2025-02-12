import { useEffect, useState } from "react";
import WishlistButton from "./WishlistButton";
import QuantityInput from "./QuantityInput";
import ColorOptions from "../../../../utils/ColorOptions.jsx";
import { fetchReviews } from "../../../../api/reviews.js";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = ({
  product,
  colorQuantity,
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
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    navigate(`/product/?category=${categoryId}`);
  };

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

  function formatPrice(price) {
    const formattedPrice = price.toLocaleString();
    
    const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
    return persianNumerals;
  }

  const lowQuantityWarning = colorQuantity < 4 && colorQuantity > 0;


  const handleSocialClick = (socialMedia) => {
    const currentUrl = window.location.href;
    const shareableLink = encodeURIComponent(currentUrl); 
    let shareUrl = "";
    
    toast.success(` لینک اشتراک در ${socialMedia} کپی شد!`);

      switch (socialMedia) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareableLink}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?url=${shareableLink}`;
          break;
        case "instagram":
          shareUrl = `https://www.instagram.com/?url=${shareableLink}`;
          break;
        case "telegram":
          shareUrl = `https://t.me/share/url?url=${shareableLink}`;
          break;
        default:
          return;
      }
    

    navigator.clipboard.writeText(currentUrl).then(() => {
      window.location.href = shareUrl;
    }).catch((error) => {
      console.error("Failed to copy text: ", error);
    });
  };

  return (
    <div className="product-details">
      <h1 className="product-title">{product.name}</h1>

      <div className="ratings-container">
        <div className="ratings">
          <div className="ratings-val" style={{ width: `${ratingPercentage}%` }}></div>
        </div>

        <a className="ratings-text" href="#product-review-link">
          {averageRating > 0 ? `${formatPrice(averageRating.toFixed(1))} / ۵` : "هیچ امتیازی هنوز ثبت نشده است"} ({formatPrice(reviewsCount)} نظر{formatPrice(reviewsCount) !== 1 ? "ها" : ""})
        </a>
      </div>

      <div className="product-price">{formatPrice(product.price)} تومان</div>

      <div className="product-content">
        
      </div>

      <div className="details-filter-row details-row-color">
        <label>رنگ:</label>
        <ColorOptions
          colors={product.color_quantities}
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
      {lowQuantityWarning && (
            <div style={{ color: 'red', fontSize: '12px', marginLeft: '15px'}}>
                <strong>تنها {formatPrice(colorQuantity)} عدد موجود است!</strong>
            </div>
        )}
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
        </div>
      </div>

      <div className="product-details-footer">
        <div className="product-cat">
          <span>دسته‌بندی:</span>

          {categories.map((category, index) => (
            <a key={index} onClick={() => handleCategoryClick(category.id)} style={{cursor:'pointer'}}>
              {category.name}
            </a>
          ))}
        </div>
        <div className="social-icons social-icons-sm">
          <span className="social-label">اشتراک‌گذاری:</span>
          <a href="#" className="social-icon" title="فیس‌بوک" onClick={() => handleSocialClick("facebook")}>
            <i className="icon-facebook-f"></i>
          </a>
          <a href="#" className="social-icon" title="توییتر" onClick={() => handleSocialClick("twitter")}>
            <i className="icon-twitter"></i>
          </a>
          <a href="#" className="social-icon" title="اینستاگرام" onClick={() => handleSocialClick("instagram")}>
            <i className="icon-instagram"></i>
          </a>
          <a href="#" className="social-icon" title="تلگرام" onClick={() => handleSocialClick("telegram")}>
            <i className="icon-telegram"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
