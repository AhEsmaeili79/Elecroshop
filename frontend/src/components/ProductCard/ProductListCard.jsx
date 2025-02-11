import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { addProductToCart, updateCartItemQuantity, removeCartItem, fetchCartItem ,fetchAllCartItems } from '../../api/cartApi';
import './css/ProductListCard.css';
import { useWishlist } from '../../contexts/WishlistContext'; 
import ColorOptions from '../../utils/ColorOptions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; 

const ProductListCard = ({ product, reviewsData }) => {
    const { cartItems, setCartItems } = useCart();
    const [currentImage, setCurrentImage] = useState(product.main_photo);
    const [productLabel, setProductLabel] = useState('');
    const [cartItem, setCartItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isInWishlist, setIsInWishlist] = useState(false); 
    const { wishlistItems, handleAddToWishlist, handleRemoveFromWishlist } = useWishlist(); 
    const [selectedColor, setSelectedColor] = useState(null);
    
    useEffect(() => {
        const isProductInWishlist = wishlistItems.some(item => item.product.id === product.id);
        setIsInWishlist(isProductInWishlist);
    }, [wishlistItems, product.id]);

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


      function formatPrice(price) {
        const formattedPrice = price.toLocaleString();
        
        const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
        return persianNumerals;
      }
    
      const toPersianNumbers = (num) => {
        return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
    };
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
            toast.error("لطفاً رنگی را قبل از افزودن به سبد خرید انتخاب کنید.");
            return;
        }
        if (!localStorage.getItem("token")) {
            toast.error("لطفاً برای افزودن به سبد خرید، وارد شوید.");
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
                toast.success("محصول به سبد خرید اضافه شد.");
            }
        } catch (error) {
            console.error('خطا در افزودن محصول به سبد خرید:', error);
            toast.error("خطا در افزودن محصول به سبد خرید.");
        }
    };
    
    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const updatedItem = await updateCartItemQuantity(cartItem.id, newQuantity, selectedColor);
            setQuantity(updatedItem.quantity);
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItem.id));
        } catch (error) {
            console.error('خطا در به‌روزرسانی تعداد کالای سبد خرید:', error);
            toast.error("خطا در به‌روزرسانی تعداد کالای سبد خرید.");
        }
    };
    
    const handleRemoveFromCart = async () => {
        try {
            await removeCartItem(cartItem.id);
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItem.id));
            setCartItem(null);
            setQuantity(1);
            toast.success("کالا از سبد خرید حذف شد.");
        } catch (error) {
            console.error('خطا در حذف کالا از سبد خرید:', error);
            toast.error("خطا در حذف کالا از سبد خرید.");
        }
    };
    
    const handleWishlistToggle = async () => {
        if (!localStorage.getItem("token")) {
            toast.error("لطفاً برای افزودن به لیست علاقه‌مندی‌ها وارد شوید.");
            return;
        }
    
        try {
            if (isInWishlist) {
                await handleRemoveFromWishlist(product.id);
                toast.success("کالا از لیست علاقه‌مندی‌ها حذف شد.");
            } else {
                await handleAddToWishlist(product.id);
                toast.success("کالا به لیست علاقه‌مندی‌ها اضافه شد.");
            }
        } catch (err) {
            console.error("خطا در به‌روزرسانی لیست علاقه‌مندی‌ها:", err);
            toast.error("افزودن به لیست علاقه‌مندی‌ها با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
        }
    };
    

    const handleColorChange = (color) => {
        setSelectedColor(color);
    
        const existingCartItem = cartItems.find(
            (item) =>
                item.product.id === product.id &&
                item.color.id === color
        );
    
        if (existingCartItem) {
            setCartItem(existingCartItem);
            setQuantity(existingCartItem.quantity);
        } else {
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
                                ? 'جدید'
                                : productLabel === 'label-low'
                                ? 'موجودی کم'
                                : 'تمام شده'}
                        </span>
                    )}
                    <Link to={`/product/${product.id}`}>
                        <img src={currentImage} alt={product.name} className="product-image" />
                    </Link>
                    <div className="product-action-vertical">
                    
                        <a  
                            onClick={handleWishlistToggle}
                            className={`btn-product-icon btn-expandable ${isInWishlist ? 'active' : ''}`}
                        >
                            {isInWishlist ? <FaHeart className="text-danger" /> : <FaRegHeart className="text-primary" />}
                            <span>
                                {isInWishlist ? 'حذف از لیست علاقه‌مندی‌ها' : 'افزودن به لیست علاقه‌مندی‌ها'}
                            </span>
                        </a>
                        <a className="btn-product-icon btn-quickview" title="مشاهده سریع">
                            <span>مشاهده سریع</span>
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
                                    title="کاهش تعداد"
                                >
                                    <span>-</span>
                                </button>
                                <span className="quantity">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    className="btn-product btn-quantity"
                                    title="افزایش تعداد"
                                >
                                    <span>+</span>
                                </button>
                            </div>
                        ) : (
                            <a onClick={(e) => { e.preventDefault(); handleAddToCart(); }} className="btn-product btn-cart" title="افزودن به سبد خرید">
                                <span>افزودن به سبد خرید</span>
                            </a>
                        )}
                    </div>
                </figure>

                <div className="product-body">
                    <div className="product-cat">
                        <a href="#">{product.category?.name || 'بدون دسته‌بندی'}</a>
                    </div>
                    <h3 className="product-title">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="product-price">{formatPrice(product.price)} تومان</div>
                    <div className="ratings-container">
                        <div className="ratings">
                            <div className="ratings-val" style={{ width: `${(averageRating / 5) * 100}%` }}></div>
                        </div>
                        <span className="ratings-text">({toPersianNumbers(reviewsCount)} نظر)</span>
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

ProductListCard.propTypes = {
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
