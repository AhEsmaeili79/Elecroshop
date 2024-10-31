import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetails, addProductToCart, fetchCartItem, updateCartItemQuantity, removeCartItem } from './api';
import { fetchReviews, submitReview } from '../reviews/api/reviewApi'; // Import review API functions
import ReviewForm from '../reviews/ReviewForm';
import ReviewList from '../reviews/ReviewList';
import './css/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItem, setCartItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]); // State to hold reviews

  useEffect(() => {
      const getProductDetails = async () => {
          try {
              const data = await fetchProductDetails(productId);
              setProduct(data);
          } catch (error) {
              setError('Failed to fetch product details.');
              console.error('Error fetching product details:', error);
          } finally {
              setLoading(false);
          }
      };

      const getCartItem = async () => {
          try {
              const item = await fetchCartItem(productId);
              if (item) {
                  setCartItem(item);
                  setQuantity(item.quantity);
              }
          } catch (error) {
              console.error('Error fetching cart item:', error);
          }
      };

      const loadReviews = async () => {
          try {
              const reviewData = await fetchReviews(productId); // Fetch reviews for the specific product
              setReviews(reviewData);
          } catch (error) {
              console.error('Error fetching reviews:', error);
              setError('Failed to load reviews.'); // Set an error message for the user
          }
      };

      getProductDetails();
      getCartItem();
      loadReviews(); // Load reviews for the specific product ID
  }, [productId]); // Ensure it runs whenever productId changes

  const handleAddToCart = async () => {
      try {
          const addedItem = await addProductToCart(product.id, quantity);
          setCartItem(addedItem);
      } catch (error) {
          console.error('Error adding product to cart:', error);
          alert(error.message);
      }
  };

  const handleQuantityChange = async (newQuantity) => {
      if (newQuantity < 1) return;

      if (newQuantity === 0 && cartItem) {
          await handleRemoveFromCart();
      } else {
          try {
              const updatedItem = await updateCartItemQuantity(cartItem.id, newQuantity);
              setQuantity(updatedItem.quantity);
              setCartItem(updatedItem);
          } catch (error) {
              console.error('Error updating cart item quantity:', error);
          }
      }
  };

  const handleRemoveFromCart = async () => {
      try {
          await removeCartItem(cartItem.id);
          setCartItem(null);
          setQuantity(1);
      } catch (error) {
          console.error('Error removing item from cart:', error);
      }
  };

  const handleReviewSubmit = async (reviewData) => {
      try {
          await submitReview({ ...reviewData, product: productId }); // Include product ID in review submission
          loadReviews(); // Reload reviews after a new review is submitted
      } catch (error) {
          console.error('Error submitting review:', error);
      }
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-detail-container">
      <h1 className="product-name">{product.name}</h1>
      <img src={product.main_photo} alt={product.name} className="product-image" />
      <p className="product-price">Price: ${product.price}</p>
      <p className="product-count">Available Count: {product.quantity}</p>
      <p className="product-model">Model: {product.model}</p>
      <p className="product-description">Description: {product.description}</p>

      {cartItem ? (
        <div className="quantity-controls">
          <button
            onClick={() => {
              if (quantity === 1) {
                handleRemoveFromCart();
              } else {
                handleQuantityChange(quantity - 1);
              }
            }}
          >
            -
          </button>
          <span className='quantity'>{quantity}</span>
          <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
          <span className='total-price'>Total Price: ${product.price * quantity}</span>
        </div>
      ) : (
        <button onClick={handleAddToCart}>Add to Cart</button>
      )}

      {/* Review Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        <ReviewForm productId={productId} onReviewSubmit={handleReviewSubmit} />
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default ProductDetail;
