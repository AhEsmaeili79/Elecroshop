import React, { useEffect, useState } from "react";
import {
  fetchProductDetails,
  addProductToCart,
  updateCartItemQuantity,
  removeCartItem,
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../../../api/productdetail.js";
import ProductGallery from "./Components/ProductGallery";
import ProductDetails from "./Components/ProductDetails";
import "./css/ProductTopPage.css";
import { fetchAllCartItems } from "../../../api/cartApi.js";
import { useCart } from "../../../contexts/CartContext.jsx";

const ProductTopPage = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [buttonText, setButtonText] = useState("Add to Cart"); // Manage button text state
  const [btnClass, setbtnClass] = useState("addcartbtn");
  const [isInCart, setIsInCart] = useState(false); // Track if the product is in the cart
  const { cartItems, setCartItems } = useCart();

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const data = await fetchProductDetails(productId);
        setProduct(data);
        setActiveImage(data.main_photo);
        setLoading(false);

        const cartData = await fetchAllCartItems();
        setCartItems(cartData);

        const cartItem = cartData.find(
          (item) =>
            item.product.id === productId &&
            (!selectedColor || item.color.id === selectedColor)
        );
        if (cartItem) {
          setQuantity(cartItem.quantity);
          setButtonText("Remove Item");
          setbtnClass("removecartbtn");
          setIsInCart(true);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
      }
    };

    loadProductDetails();
  }, [productId, selectedColor]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await fetchWishlist();
        setWishlist(data);
        setIsFavorited(data.some((item) => item.product_id === productId));
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    loadWishlist();
    
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedColor) {
      alert("Please select a color before adding to cart.");
      return;
    }

    try {
      setButtonText("Processing...");
      const cartItem = cartItems.find(
        (item) =>
          item.product.id === product.id &&
          item.color.id === selectedColor
      );

      if (cartItem) {
        await updateCartItemQuantity(cartItem.id, quantity,selectedColor);
      } else {
        await addProductToCart(product.id, quantity, selectedColor);
      }

      const cartData = await fetchAllCartItems();
      setCartItems(cartData);

      setIsInCart(true);
      setButtonText("Remove Item");
      setbtnClass("removecartbtn");
    } catch (err) {
      console.error(err);
      setButtonText("Add to Cart");
      setbtnClass("addcartbtn");
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      const cartItem = cartItems.find(
        (item) =>
          item.product.id === product.id &&
          item.color.id === selectedColor
      );
      if (cartItem) {
        await removeCartItem(cartItem.id);

        const cartData = await fetchAllCartItems();
        setCartItems(cartData);

        setIsInCart(false);
        setQuantity(1);
        setButtonText("Add to Cart");
        setbtnClass("addcartbtn");
      }
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  const handleImageSwitch = (image) => setActiveImage(image);

  const handleAddToWishlist = async () => {
    try {
      if (!localStorage.getItem("token")) {
        alert("Please log in to add to wishlist.");
        return;
      }

      const data = await fetchWishlist();
      const isInWishlist = data.some((item) => item.product_id === productId);

      if (isInWishlist) await removeFromWishlist(productId);
      else await addToWishlist(productId);

      const updatedWishlist = await fetchWishlist();
      setWishlist(updatedWishlist);
      setIsFavorited(updatedWishlist.some((item) => item.product_id === productId));
    } catch (err) {
      console.error("Error updating wishlist:", err);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setActiveImage(color.main_image || product.main_photo);

    const cartItem = cartItems.find(
      (item) =>
        item.product.id === product.id &&
        item.color.id === color
    );

    if (cartItem) {
      setQuantity(cartItem.quantity);
      setIsInCart(true);
      setButtonText("Remove Item");
      setbtnClass("removecartbtn");
    } else {
      setQuantity(1);
      setIsInCart(false);
      setButtonText("Add to Cart");
      setbtnClass("addcartbtn");
    }
  };

  // New function to handle quantity updates
  const handleQuantityChange = async (newQuantity) => {
    // First, update the local state with the new quantity
    setQuantity(newQuantity);
  };

  

  useEffect(() => {
    const updateQuantity = async () => {
      // Use newQuantity directly instead of state, since state isn't updated instantly
      if (quantity > 0 && selectedColor) {
        const cartItem = cartItems.find(
          (item) =>
            item.product.id === product.id &&
            item.color.id === selectedColor
        );
    
        if (cartItem) {
          // Update the cart item quantity
          await updateCartItemQuantity(cartItem.id, quantity, selectedColor);
        } 
      }
    
      // Fetch the updated cart items after updating the quantity
      const cartData = await fetchAllCartItems();
      setCartItems(cartData);
    };
    updateQuantity();

  }, [quantity]);
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-details-top">
      <div className="row">
        <div className="col-md-6">
          <ProductGallery
            activeImage={activeImage}
            images={[product.main_photo, product.photo1, product.photo2, product.photo3]}
            handleImageSwitch={handleImageSwitch}
          />
        </div>
        <div className="col-md-6">
          <ProductDetails
            product={product}
            selectedColor={selectedColor}
            quantity={quantity}
            setQuantity={handleQuantityChange}  // Updated quantity handler
            handleAddToCart={selectedColor ? (isInCart ? handleRemoveFromCart : handleAddToCart) : null}
            handleAddToWishlist={handleAddToWishlist}
            isFavorited={isFavorited}
            handleColorChange={handleColorChange}
            buttonText={selectedColor ? buttonText : "Select a Color"}
            btnClass={selectedColor ? btnClass : "disabledbtn"}
          />
        </div>
      </div>
    </div>
  );
};


export default ProductTopPage;
