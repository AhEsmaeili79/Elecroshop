import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../contexts/CartContext';
import { addProductToCart, updateCartItemQuantity, removeCartItem, fetchCartItem ,fetchAllCartItems } from '../../api/cartApi';
import './css/ProductListCard.css';
import { useWishlist } from '../../contexts/WishlistContext'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';; 
import ProductListLayout1 from '../ProductLayouts/ProductListLayout1';
import ProductListLayout3 from '../ProductLayouts/ProductListLayout3';
import ProductListLayout2 from '../ProductLayouts/ProductListLayout2';
import ProductListLayout4 from '../ProductLayouts/ProductListLayout4';

const ProductListCard = ({ product, reviewsData, currentLayout }) => {
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
    
    const LayoutComponent = {
        '1': ProductListLayout1,
        '2': ProductListLayout2,
        '3': ProductListLayout3,
        '4': ProductListLayout4
      };

    const SelectedLayout = LayoutComponent[currentLayout];

    const productReviews = reviewsData[product.id] || {};
    const averageRating = productReviews.averageRating || 0;
    const reviewsCount = productReviews.reviewsCount || 0;

    return (
        SelectedLayout && (
            <SelectedLayout
              product={product}
              productLabel={productLabel}
              currentImage={currentImage}
              averageRating={averageRating}
              reviewsCount={reviewsCount}
              cartItem={cartItem}
              quantity={quantity}
              handleAddToCart={handleAddToCart}
              handleRemoveFromCart={handleRemoveFromCart}
              handleQuantityChange={handleQuantityChange}
              handleWishlistToggle={handleWishlistToggle}
              isInWishlist={isInWishlist}
              selectedColor={selectedColor}
              handleColorChange={handleColorChange}
            />
        )
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
