import React, { useEffect, useState } from "react";
import WishlistButton from "./WishlistButton";
import QuantityInput from "./QuantityInput";
import ColorOptions from "./ColorOptions";
import { fetchReviews } from '../../api/reviewApi'; // Import the fetchReviews API function
import { useCart } from '../../../../contexts/CartContext.jsx';  // Importing useCart hook

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
  btnClass, // Button text passed as prop
}) => {
  // State to store reviews, their count, and the average rating
  const [reviews, setReviews] = useState([]);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0); // State for average rating

  // Fetch reviews when the productId changes
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const fetchedReviews = await fetchReviews(product.id); // Pass product.id to fetch reviews for this product
        setReviews(fetchedReviews);
        setReviewsCount(fetchedReviews.length); // Update the review count

        // Calculate average rating
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
  }, [product.id]); // Re-run whenever the product.id changes

  // Calculate the percentage of the average rating (out of 5)
  const ratingPercentage = (averageRating / 5) * 100;

  // If you wanted to map through an array of categories in the future, here's how you would do it:
  const categories = [product.category]; // Example of wrapping the single category in an array

  return (
    <div className="product-details">
      <h1 className="product-title">{product.name}</h1>

      <div className="ratings-container">
        <div className="ratings">
          <div className="ratings-val" style={{ width: `${ratingPercentage}%` }}></div>
        </div>
        {/* Display the average rating and number of reviews */}
        <a className="ratings-text" href="#product-review-link">
          {averageRating > 0 ? `${averageRating.toFixed(1)} / 5` : "No Ratings Yet"} ({reviewsCount} Review{reviewsCount !== 1 ? "s" : ""})
        </a>
      </div>

      <div className="product-price">${product.price}</div>

      <div className="product-content">
        
      </div>

      <div className="details-filter-row details-row-color">
        <label>Color:</label>
        <ColorOptions
          colors={product.colors}
          selectedColor={selectedColor}
          handleColorChange={handleColorChange}
        />
      </div>

      <div className="details-filter-row details-row-size">
        <label htmlFor="size">Desc:</label>
        
        <div >
          <p>{product.desc}</p>
        </div>
      </div>


      <div className="details-filter-row details-row-size">
        <label htmlFor="qty">Qty:</label>
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
          <a href="#" className="btn-product btn-compare" title="Compare">
            <span>Add to Compare</span>
          </a>
        </div>
      </div>

      <div className="product-details-footer">
        <div className="product-cat">
          <span>Category:</span>
          {/* Mapping over the category array to display the name */}
          {categories.map((category, index) => (
            <a key={index} href="#">
              {category.name}
            </a>
          ))}
        </div>
        <div className="social-icons social-icons-sm">
          <span className="social-label">Share:</span>
          <a href="#" className="social-icon" title="Facebook" target="_blank">
            <i className="icon-facebook-f"></i>
          </a>
          <a href="#" className="social-icon" title="Twitter" target="_blank">
            <i className="icon-twitter"></i>
          </a>
          <a href="#" className="social-icon" title="Instagram" target="_blank">
            <i className="icon-instagram"></i>
          </a>
          <a href="#" className="social-icon" title="Pinterest" target="_blank">
            <i className="icon-pinterest"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
