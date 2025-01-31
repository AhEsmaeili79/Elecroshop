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
  const [buttonText, setButtonText] = useState("اضافه به سبد خرید");
  const [btnClass, setbtnClass] = useState("addcartbtn");
  const [isInCart, setIsInCart] = useState(false);
  const { cartItems, setCartItems } = useCart();

  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        const data = await fetchProductDetails(productId);
        setProduct(data);
        setActiveImage(data.main_photo);
  
        if (data.quantity === 0) {
          setButtonText("ناموجود");
          setbtnClass("outofstockbtn");
          setIsInCart(false);
        } else {
          setButtonText("اضافه به سبد خرید");
          setbtnClass("addcartbtn");
          setIsInCart(false);
        }
  
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
          setButtonText("حذف از سبد خرید");
          setbtnClass("removecartbtn");
          setIsInCart(true);
        }
      } catch (err) {
        console.error("خطا در بارگذاری جزئیات محصول:", err);
        setError("خطا در بارگذاری جزئیات محصول. لطفا دوباره تلاش کنید.");
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
        console.error("خطا در بارگذاری لیست علاقه مندی‌ها:", err);
      }
    };

    loadWishlist();
    
  }, [productId]);

  const handleAddToCart = async () => {
    if (!selectedColor) {
      alert("لطفا رنگی را برای افزودن به سبد انتخاب کنید.");
      return;
    }
    if (!localStorage.getItem("token")) {
      alert("لطفاً برای افزودن به سبد وارد شوید.");
      return;
    }

    if (product.quantity === 0) {
      alert("ببخشید، این محصول ناموجود است.");
      setButtonText("ناموجود");
      setbtnClass("outofstockbtn");
      return; 
    }

    try {
      setButtonText("در حال پردازش...");
      const cartItem = cartItems.find(
        (item) =>
          item.product.id === product.id &&
          item.color.id === selectedColor
      );

      if (cartItem) {
        await updateCartItemQuantity(cartItem.id, quantity, selectedColor);
      } else {
        await addProductToCart(product.id, quantity, selectedColor);
      }

      const cartData = await fetchAllCartItems();
      setCartItems(cartData);

      setIsInCart(true);
      setButtonText("حذف از سبد خرید");
      setbtnClass("removecartbtn");
    } catch (err) {
      console.error(err);
      setButtonText("اضافه به سبد خرید");
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
        setButtonText("اضافه به سبد خرید");
        setbtnClass("addcartbtn");
      }
    } catch (err) {
      console.error("خطا در حذف محصول از سبد خرید:", err);
    }
  };

  const handleImageSwitch = (image) => setActiveImage(image);

  const handleAddToWishlist = async () => {
    try {
      if (!localStorage.getItem("token")) {
        alert("لطفا وارد شوید تا به لیست علاقه مندی‌ها اضافه کنید.");
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
      console.error("خطا در بروزرسانی لیست علاقه مندی‌ها:", err);
      alert("خطا در بروزرسانی لیست علاقه مندی‌ها. لطفا دوباره تلاش کنید.");
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
      setButtonText("حذف از سبد خرید");
      setbtnClass("removecartbtn");
    } else {
      setQuantity(1);
      setIsInCart(false);
      setButtonText("اضافه به سبد خرید");
      setbtnClass("addcartbtn");
    }
  };

  const handleQuantityChange = async (newQuantity) => {
    setQuantity(newQuantity);
  };

  

  useEffect(() => {
    const updateQuantity = async () => {
      if (quantity > 0 && selectedColor) {
        if (product.quantity === 0) {
          alert("ببخشید، این محصول ناموجود است.");
          return; 
        }
  
        const cartItem = cartItems.find(
          (item) =>
            item.product.id === product.id &&
            item.color.id === selectedColor
        );
  
        if (cartItem) {
          await updateCartItemQuantity(cartItem.id, quantity, selectedColor);
        }
      }
  
      const cartData = await fetchAllCartItems();
      setCartItems(cartData);
    };
    updateQuantity();
  
  }, [quantity]);
  

  if (loading) return <div>در حال بارگذاری...</div>;
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
            setQuantity={handleQuantityChange}  
            handleAddToCart={selectedColor ? (isInCart ? handleRemoveFromCart : handleAddToCart) : null}
            handleAddToWishlist={handleAddToWishlist}
            isFavorited={isFavorited}
            handleColorChange={handleColorChange}
            buttonText={selectedColor ? buttonText : "ابتدا رنگ انتخاب کنید"}
            btnClass={selectedColor ? btnClass : "disabledbtn"}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductTopPage;
