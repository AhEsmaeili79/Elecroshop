import { useEffect, useState } from "react";
import WishlistTable from "./WishlistTable.jsx";
import WishlistHeader from "../../components/Header/WishlistHeader/WishlistHeader.jsx";
import WishlistFooter from "./WishlistFooter.jsx";
import { fetchWishlist, removeFromWishlist } from "../../api/wishlistApi";
import { addProductToCart, fetchCartItemByProductId, removeCartItem, fetchAllCartItems } from "../../api/cartApi";
import BreadCrumb from "../../components/Breadcrumb/BreadCrumb.jsx";
import { useCart } from "../../contexts/CartContext.jsx";

const Body = () => {
    const { cartItems, setCartItems } = useCart();  
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingProductId, setLoadingProductId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const wishlistData = await fetchWishlist();
                setWishlist(wishlistData);

                const cartData = await fetchAllCartItems();

                setCartItems(cartData);
                setLoading(false);
            } catch (err) {
                setError("بارگذاری داده‌ها با خطا مواجه شد.");
                setLoading(false);
            }
        };

        loadData();
    }, [setCartItems]);

    const handleAddToCart = async (productId) => {
        setLoadingProductId(productId);
        try {
            const existingCartItem = await fetchCartItemByProductId(productId);
            if (!existingCartItem) {

                setTimeout(async () => {
                    await addProductToCart(productId, 1);
                    const updatedCartItems = await fetchAllCartItems();

                    setCartItems(updatedCartItems);  
                    setLoading(false); 
                    setLoadingProductId(null);
                }, 500);  
            }
        } catch (err) {
            setError("خطا در افزودن محصول به سبد خرید.");
            setLoading(false);
            setLoadingProductId(null);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        setLoadingProductId(productId);
        try {
            const cartItem = await fetchCartItemByProductId(productId);
            if (cartItem) {

                setTimeout(async () => {
                    await removeCartItem(cartItem.id);
                    const updatedCartItems = await fetchAllCartItems();

                    setCartItems(updatedCartItems);  
                    setLoadingProductId(null);
                }, 500);  
            }
        } catch (err) {
            setError("خطا در حذف محصول از سبد خرید.");
            setLoading(false);
            setLoadingProductId(null);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await removeFromWishlist(productId);
            setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
        } catch (err) {
            setError("خطا در حذف آیتم از لیست علاقه‌مندی.");
        }
    };

    return (
        <div className="page-content" id="wishlist-page">
            <WishlistHeader />
            <BreadCrumb />
            <div className="container">
                <WishlistTable
                    wishlist={wishlist}
                    loading={loading}
                    error={error}
                    onRemove={handleRemoveFromWishlist}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    cartItems={cartItems}  
                    loadingProductId={loadingProductId}
                />
                <WishlistFooter />
            </div>
        </div>
    );
};

export default Body;
