import { useEffect, useState } from "react";
import WishlistTable from "./WishlistTable.jsx";
import WishlistHeader from "./WishlistHeader.jsx";
import WishlistFooter from "./WishlistFooter.jsx";
import { fetchWishlist, removeFromWishlist } from "./api/wishlistApi";
import { addProductToCart, fetchCartItemByProductId, removeCartItem, fetchAllCartItems } from "./api/cartApi";
import BreadCrumb from '../Header/Breadcrumb/BreadCrumb.jsx';
import { useCart } from '../../contexts/CartContext.jsx';  // Importing useCart hook

const Body = () => {
    const { cartItems, setCartItems } = useCart();  // Get cartItems from CartContext
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
                setError("Failed to load data.");
                setLoading(false);
            }
        };

        loadData();
    }, [setCartItems]); // Removed `wishlist` as dependency

    // Add product to the cart with delay
    const handleAddToCart = async (productId) => {
        setLoadingProductId(productId);
        try {
            const existingCartItem = await fetchCartItemByProductId(productId);
            if (!existingCartItem) {

                setTimeout(async () => {
                    await addProductToCart(productId, 1);
                    const updatedCartItems = await fetchAllCartItems();

                    setCartItems(updatedCartItems);  // Update cart items in the context
                    setLoading(false); // End loading
                    setLoadingProductId(null);
                }, 500);  // 500ms delay
            }
        } catch (err) {
            setError("Failed to add product to cart.");
            setLoading(false);
            setLoadingProductId(null);
        }
    };

    // Remove product from cart with delay
    const handleRemoveFromCart = async (productId) => {
        setLoadingProductId(productId);
        try {
            const cartItem = await fetchCartItemByProductId(productId);
            if (cartItem) {

                setTimeout(async () => {
                    await removeCartItem(cartItem.id);
                    const updatedCartItems = await fetchAllCartItems();

                    setCartItems(updatedCartItems);  // Update cart items in the context
                    setLoadingProductId(null);
                }, 500);  // 500ms delay
            }
        } catch (err) {
            setError("Failed to remove product from cart.");
            setLoading(false);
            setLoadingProductId(null);
        }
    };

    // Remove from wishlist function
    const handleRemoveFromWishlist = async (productId) => {
        try {
            await removeFromWishlist(productId);
            setWishlist((prev) => prev.filter((item) => item.product.id !== productId));
        } catch (err) {
            setError("Failed to remove item from wishlist.");
        }
    };

    return (
        <div className="page-content">
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
                    cartItems={cartItems}  // Pass cartItems from context to WishlistTable
                    loadingProductId={loadingProductId}
                />
                <WishlistFooter />
            </div>
        </div>
    );
};

export default Body;
