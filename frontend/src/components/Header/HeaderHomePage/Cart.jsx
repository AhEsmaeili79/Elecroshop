import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { removeCartItem } from '../../../api/cartApi';

const Cart = () => {
    const { cartItems, setCartItems } = useCart();
    const [totalPrice, setTotalPrice] = React.useState(0);

    React.useEffect(() => {
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
            console.error('خطا در حذف کالا از سبد خرید:', error);
        }
    };
    const toPersianNumerals = (number) => {
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
      };

    function formatPrice(price) {
        const formattedPrice = price.toLocaleString();
        
        const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
        return persianNumerals;
    }
    

    return (
        <div className="dropdown cart-dropdown">
            <Link to="/cart" className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static">
                <div className="icon">
                    <i className="icon-shopping-cart"></i>
                    <span className="cart-count">{toPersianNumerals(cartItems.length)}</span>
                </div>
                <p>سبد خرید</p>
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
                <div className="dropdown-cart-products">
                    {cartItems.length === 0 ? (
                        <p>سبد خرید خالی است</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div className="product" key={`${item.id}-${index}`} dir='rtl'>
                                <div className="product-cart-details">
                                    <h4 className="product-title">
                                        <a href={`/product/${item.product.id}`}>{item.product.name}</a>
                                    </h4>
                                    <span className="cart-product-info">
                                        
                                    <span className="cart-product-qty">{toPersianNumerals(item.quantity)} * </span> 
                                    
                                    {formatPrice(item.product.price)} تومان
                                         
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
                                    title="حذف محصول" 
                                    onClick={() => handleRemoveItem(item.id)}
                                >
                                    <i className="icon-close"></i>
                                </a>
                            </div>
                        ))
                    )}
                </div>
                <div className="dropdown-cart-total">
                    <span>جمع کل</span>
                    <span className="cart-total-price">{formatPrice(totalPrice)} تومان </span>
                </div>
                <div className="dropdown-cart-action">
                    <Link to="/cart" className="btn btn-primary rounded-lg">سبد خرید</Link>
                    <Link to="/Cart" className="btn btn-outline-primary-2 rounded-lg">
                        <span>تسویه </span><i className="icon-long-arrow-left"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
