import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { removeCartItem } from '../../../api/cartApi';

const Cart = () => {
    const { cartItems, setCartItems } = useCart();
    const [totalPrice, setTotalPrice] = React.useState(0);

    React.useEffect(() => {
        // Recalculate total whenever cart items change
        const calculateTotalPrice = () => {
            const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
            setTotalPrice(total);
        };
        calculateTotalPrice();
    }, [cartItems]);

    const handleRemoveItem = async (itemId) => {
        try {
            await removeCartItem(itemId);
            setCartItems((prevItems) => {
                const updatedItems = prevItems.filter(item => item.id !== itemId);
                return updatedItems;
            });
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    };

    return (
        <div className="dropdown cart-dropdown">
            <Link to="/cart" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static">
                <div className="icon">
                    <i className="icon-shopping-cart"></i>
                    <span className="cart-count">{cartItems.length}</span>
                </div>
                <p>Cart</p>
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
                <div className="dropdown-cart-products">
                    {cartItems.length === 0 ? (
                        <p>No items in the cart</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div className="product" key={`${item.id}-${index}`}>
                                <div className="product-cart-details">
                                    <h4 className="product-title">
                                        <a href={`/product/${item.product.id}`}>{item.product.name}</a>
                                    </h4>
                                    <span className="cart-product-info">
                                        <span className="cart-product-qty">{item.quantity}</span>
                                        x ${item.product.price.toFixed(2)} 
                                    </span>
                                </div>
                                <div className="cart-color-info">
                                    <a
                                        style={{
                                        display: "inline-block",
                                        width: "24px",
                                        height: "24px",
                                        backgroundColor: item.color.color_hex,
                                        border:"2px solid #dbdbdb",
                                        borderRadius: "50%",
                                        marginLeft: "5px",
                                        }}>
                                    </a>
                                </div>
                                <figure className="product-image-container">
                                    <a href={`/product/${item.product.id}`} className="product-image">
                                        <img src={item.product.main_photo} alt={item.product.name} className="cart-item-image" />
                                    </a>
                                </figure>
                                <a 
                                    href="#" 
                                    className="btn-remove" 
                                    title="Remove Product" 
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    <i className="icon-close"></i>
                                </a>
                            </div>
                        ))
                    )}
                </div>
                <div className="dropdown-cart-total">
                    <span>Total</span>
                    <span className="cart-total-price">${totalPrice}</span>
                </div>
                <div className="dropdown-cart-action">
                    <Link to="/cart" className="btn btn-primary">View Cart</Link>
                    <Link to="/Cart" className="btn btn-outline-primary-2">
                        <span>Checkout</span><i className="icon-long-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
