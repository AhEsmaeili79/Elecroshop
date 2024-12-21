import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  addProductToCart,
  updateCartItemQuantity,
  removeCartItem,
  fetchCartItem,
} from '../../api/cartApi';
import { fetchReviews } from '../../api/reviews';
import { useCart } from '../../contexts/CartContext'; 
import { useWishlist } from '../../contexts/WishlistContext'; 
import ColorOptions from '../../utils/ColorOptions';

import './css/ProductCard.css';

const ProductCard = ({ product, index }) => {
  const [cartItem, setCartItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const { cartItems, setCartItems } = useCart();
  const { wishlistItems, handleAddToWishlist, handleRemoveFromWishlist } = useWishlist();

  // Fetch cart item only when the product changes
  useEffect(() => {
    const loadCartItem = async () => {
      if (product?.id) {
        const existingCartItem = await fetchCartItem(product.id);
        if (existingCartItem) {
          setCartItem(existingCartItem);
          setQuantity(existingCartItem.quantity);
        }
      }
    };

    loadCartItem();
  }, [product?.id]);

  // Fetch reviews only when the product changes
  useEffect(() => {
    const loadReviews = async () => {
      if (product?.id) {
        const reviews = await fetchReviews(product.id);
        if (Array.isArray(reviews)) {
          setReviewsCount(reviews.length);
          const totalRating = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
          setAverageRating(reviews.length > 0 ? totalRating / reviews.length : 0);
        }
      }
    };

    loadReviews();
  }, [product?.id]);

  // Update wishlist status based on the context
  useEffect(() => {
    const isProductInWishlist = wishlistItems.some(item => item.product.id === product.id);
    setIsInWishlist(isProductInWishlist);
  }, [wishlistItems, product?.id]);

  // Handle adding/removing product from wishlist
  const handleWishlistToggle = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please log in to add to wishlist.");
      return;
    }

    setIsWishlistLoading(true);

    try {
      if (isInWishlist) {
        await handleRemoveFromWishlist(product.id);
      } else {
        await handleAddToWishlist(product.id);
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const ratingPercentage = (averageRating / 5) * 100;

  const handleAddToCart = async () => {
    if (!product || !product.id || product.quantity === 0) return;
    try {
      const addedItem = await addProductToCart(product.id, quantity, selectedColor);
      setCartItem(addedItem);
      setCartItems((prevItems) => [...prevItems, addedItem]);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert(error.message);
    }
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || product.quantity === 0) return;

    try {
      const updatedItem = await updateCartItemQuantity(cartItem.id, newQuantity);
      setQuantity(updatedItem.quantity);
      setCartItem(updatedItem);
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === cartItem.id ? updatedItem : item))
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      await removeCartItem(cartItem.id);
      setCartItem(null);
      setQuantity(1);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItem.id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleColorChange = async (color) => {
    setSelectedColor(color);

    // Find the cart item for the selected color
    const existingCartItem = cartItems.find(
      (item) => item.product.id === product.id && item.color.id === color
    );

    if (existingCartItem) {
      // If the cart item exists for the selected color, set it
      setCartItem(existingCartItem);
      setQuantity(existingCartItem.quantity);
    } else {
      // If not, try fetching from the API
      try {
        const fetchedCartItem = await fetchCartItem(product.id, color);
        if (fetchedCartItem) {
          setCartItem(fetchedCartItem);
          setQuantity(fetchedCartItem.quantity);

          // Add fetched cart item to the cartItems context if not already present
          setCartItems((prevItems) => {
            if (!prevItems.some((item) => item.id === fetchedCartItem.id)) {
              return [...prevItems, fetchedCartItem];
            }
            return prevItems;
          });
        } else {
          // If no cart item exists for the selected color, reset state
          setCartItem(null);
          setQuantity(1);
        }
      } catch (error) {
        console.error('Error fetching cart item:', error);
      }
    }
  };

  if (!product || !product.id) {
    return <p>Loading...</p>;
  }

  const isOutOfStock = product.quantity === 0;

  return (
    <div className="product product-2" key={index}>
      <figure className="product-media">
        {product.label && (
          <span
            className={`product-label label-circle ${product.label.includes('Sale') ? 'label-sale' : 'label-top'}`}
          >
            {product.label}
          </span>
        )}
        <Link to={`/product/${product.id}`} key={product.id}>
          <img
            src={product.main_photo || '/default-image.jpg'}
            alt={product.name || 'Product Image'}
            className="product-image"
          />
        </Link>
        <div className="product-action-vertical">
          <a
            onClick={handleWishlistToggle}
            className={`btn-product-icon btn-wishlist btn-expandable ${isInWishlist ? 'active' : ''}`}
            title="Add to wishlist"
            disabled={isWishlistLoading}
          >
            {isWishlistLoading ? (
              <span>Loading...</span>
            ) : (
              <span>{isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</span>
            )}
          </a>
        </div>
        <div className="product-action">
          {isOutOfStock ? (
            <a
              className="btn-product btn-cart"
              title="Out of Stock"
              disabled
            ></a>
          ) : cartItem ? (
            <div className="qty-control">
              <button
                onClick={() => {
                  if (quantity === 1) {
                    handleRemoveFromCart();
                  } else {
                    handleQuantityChange(quantity - 1);
                  }
                }}
                className="btn-product btn-quantity"
                title="Decrease quantity"
              >
                <span>-</span>
              </button>
              <span className="quantity">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="btn-product btn-quantity"
                title="Increase quantity"
              >
                <span>+</span>
              </button>
            </div>
          ) : (
            <a
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="btn-product btn-cart"
              title="Add to cart"
            ></a>
          )}
          <a href="popup/quickView.html" className="btn-product btn-quickview" title="Quick view"></a>
        </div>
      </figure>

      <div className="product-body products-section">
        <div className="product-cat">
          <a>
            {typeof product.category === 'string' ? product.category : product.category?.name || 'Unknown Category'}
          </a>
        </div>
        <h3 className="product-title">
          <Link to={`/product/${product.id}`} key={product.id}>
            {product.name || 'Unnamed Product'}
          </Link>
        </h3>
        <div className="product-price">
          {product.oldPrice ? (
            <>
              <span className="new-price">{product.price || 'N/A'}</span>
              <span className="old-price">{product.oldPrice}</span>
            </>
          ) : (
            product.price || 'N/A'
          )}
        </div>
        <div className="details-row-color">
          <ColorOptions
            colors={product.colors}
            selectedColor={selectedColor}
            handleColorChange={handleColorChange}
          />
        </div>
        <div className="ratings-container">
          <div className="ratings">
            <div className="ratings-val" style={{ width: `${ratingPercentage}%` }}></div>
          </div>
          <span className="ratings-text">({reviewsCount} Reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
