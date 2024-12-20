import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { addProductToCart, updateCartItemQuantity, removeCartItem, fetchCartItem ,fetchAllCartItems } from '../../api/cartApi';
import './css/ProductListCard.css';
import { useWishlist } from '../../contexts/WishlistContext';  // Add this line
import ColorOptions from '../../utils/ColorOptions';

const ProductListCard = ({ product, reviewsData }) => {
    const { cartItems, setCartItems } = useCart();
    const [currentImage, setCurrentImage] = useState(product.main_photo);
    const [productLabel, setProductLabel] = useState('');
    const [cartItem, setCartItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false); // State to track if the product is in the wishlist
    const { wishlistItems, handleAddToWishlist, handleRemoveFromWishlist } = useWishlist(); // Replace the previous useState logic
    const [selectedColor, setSelectedColor] = useState(null);
    
    useEffect(() => {
        // Check if the product is in the wishlist
        const isProductInWishlist = wishlistItems.some(item => item.product.id === product.id);
        setIsInWishlist(isProductInWishlist);
    }, [wishlistItems, product.id]); // Reload wishlist when the product changes

    useEffect(() => {
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
        const productCreationDate = new Date(product.created_at);
        const isCreatedThisWeek = productCreationDate >= startOfWeek;

        
        if (product.quantity === 0) {
            setProductLabel('label-out');
        } else if (product.quantity < 5) {
            setProductLabel('label-low');
        } else if (isCreatedThisWeek) {
            setProductLabel('label-new');
        } else {
            setProductLabel('');
        }
    }, [product.created_at, product.quantity]);


    useEffect(() => {
        const checkCartItem = async () => {
            if (product && product.id) {
                const existingCartItem = cartItems.find(item => item.product.id === product.id &&
                    (item.color.id === selectedColor));

                if (existingCartItem) {
                    setCartItem(existingCartItem);
                    setQuantity(existingCartItem.quantity);
                } else {
                    const fetchedCartItem = await fetchCartItem(product.id,selectedColor);
                    if (fetchedCartItem) {
                        setCartItem(fetchedCartItem);
                        setQuantity(fetchedCartItem.quantity);
                        setCartItems(prevItems => {
                            if (!prevItems.some(item => item.id === fetchedCartItem.id)) {
                                return [...prevItems, fetchedCartItem];
                            }
                            return prevItems;
                        });
                    }
                }
            }
        };
        checkCartItem();
    }, [product, cartItems, setCartItems]);


    const handleAddToCart = async () => {
        if (!product || !product.id || !selectedColor) {
            alert("Please select a color before adding to the cart.");
            return;
        }
        try {
            const existingCartItem = cartItems.find(item => item.product.id === product.id &&
                item.color.id === selectedColor
            );
            if (existingCartItem) {
                await handleQuantityChange(existingCartItem.quantity + 1);
            } else {
                await addProductToCart(product.id, quantity, selectedColor);
                const cartData = await fetchAllCartItems();
                setCartItems(cartData);
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert(error.message);
        }
    };

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const updatedItem = await updateCartItemQuantity(cartItem.id, newQuantity, selectedColor);
            setQuantity(updatedItem.quantity);
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItem.id 
            ));
        } catch (error) {
            console.error('Error updating cart item quantity:', error);
        }
    };
    

    const handleRemoveFromCart = async () => {
        try {
            await removeCartItem(cartItem.id);
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItem.id ));
            setCartItem(null);
            setQuantity(1);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    // Function to toggle the wishlist status
    const handleWishlistToggle = async () => {
        if (!localStorage.getItem("token")) {
            alert("Please log in to add to wishlist.");
            return;
        }
    
        try {
            if (isInWishlist) {
                await handleRemoveFromWishlist(product.id); // Use context's function
            } else {
                await handleAddToWishlist(product.id); // Use context's function
            }
        } catch (err) {
            console.error("Error updating wishlist:", err);
            alert("Failed to update wishlist. Please try again.");
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
    
        // Find the cart item for the newly selected color
        const existingCartItem = cartItems.find(
            (item) =>
                item.product.id === product.id &&
                item.color.id === color // Use the passed color, not selectedColor
        );
    
        if (existingCartItem) {
            // If the cart item exists for the selected color, set it
            setCartItem(existingCartItem);
            setQuantity(existingCartItem.quantity);
        } else {
            // If not, reset the cart item and quantity
            setCartItem(null);
            setQuantity(1);
        }
    };
    

    const productReviews = reviewsData[product.id] || {};
    const averageRating = productReviews.averageRating || 0;
    const reviewsCount = productReviews.reviewsCount || 0;

    return (
        <div className="col-6 col-md-4 col-lg-4">
            <div className="product product-7 text-center">
                <figure className="product-media">
                    {productLabel && (
                        <span className={`product-label ${productLabel}`}>
                            {productLabel === 'label-new'
                                ? 'New'
                                : productLabel === 'label-low'
                                ? 'Low Stock'
                                : 'Out of Stock'}
                        </span>
                    )}
                    <Link to={`/product/${product.id}`}>
                        <img src={currentImage} alt={product.name} className="product-image" />
                    </Link>
                    <div className="product-action-vertical">
                        <a
                            href="#"
                            onClick={handleWishlistToggle}
                            className={`btn-product-icon btn-wishlist btn-expandable ${isInWishlist ? 'active' : ''}`}
                        >
                            <span>
                                {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                            </span>
                        </a>
                        <a href="popup/quickView.html" className="btn-product-icon btn-quickview" title="Quick view">
                            <span>Quick view</span>
                        </a>
                        <a href="#" className="btn-product-icon btn-compare" title="Compare">
                            <span>Compare</span>
                        </a>
                    </div>
                    <div className="product-action">
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
                            <a href="#" onClick={(e) => { e.preventDefault(); handleAddToCart(); }} className="btn-product btn-cart" title="Add to cart">
                                <span>Add to Cart</span>
                            </a>
                        )}
                    </div>
                </figure>

                <div className="product-body">
                    <div className="product-cat">
                        <a href="#">{product.category?.name || 'Uncategorized'}</a>
                    </div>
                    <h3 className="product-title">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="product-price">${product.price}</div>
                    <div className="ratings-container">
                        <div className="ratings">
                            <div className="ratings-val" style={{ width: `${(averageRating / 5) * 100}%` }}></div>
                        </div>
                        <span className="ratings-text">({reviewsCount} Reviews)</span>
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

ProductCards.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        main_photo: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        category: PropTypes.shape({
            name: PropTypes.string,
        }),
    }).isRequired,
    reviewsData: PropTypes.object.isRequired,
};

export default ProductListCard;
