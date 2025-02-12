import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import StickyBar from "../ProductDetailBottom/components/stickybar.jsx";
import Spinner from "../../../components/Loading/loading.jsx";

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
  const [colorQuantity, setColorQuantity ] = useState();


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
        toast.error("این محصول ناموجود است");
      }

      setLoading(false);

      const cartData = await fetchAllCartItems();
      setCartItems(cartData);

      const cartItem = cartData.find(
        (item) =>
          item.product.id === productId &&
          (!selectedColor || item.color.id === selectedColor)
      );
      if (selectedColor){
        const colorQuantities = product.color_quantities.find(
          (color) => color.color === selectedColor
        ).quantity;
        setColorQuantity(colorQuantities)
      }
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
      toast.error("خطا در بارگذاری جزئیات محصول. لطفا دوباره تلاش کنید.");
    }
  };

  loadProductDetails();
}, [productId, selectedColor]);



const handleAddToCart = async () => {
  if (!selectedColor) {
    toast.error("لطفا رنگی را برای افزودن به سبد انتخاب کنید.");
    return;
  }
  if (!localStorage.getItem("token")) {
    toast.error("لطفاً برای افزودن به سبد وارد شوید.");
    return;
  }

  if (quantity > 3) {
    toast.warning("شما نمی‌توانید بیشتر از 3 عدد از این محصول را اضافه کنید.");
    setQuantity(3);  
  }

  try {
    setButtonText("در حال پردازش...");
    const cartItem = cartItems.find(
      (item) =>
        item.product.id === product.id &&
        item.color.id === selectedColor
    );

    if (cartItem) {
      await updateCartItemQuantity(cartItem.id, cartItem.quantity + quantity, selectedColor);
    } else {
      await addProductToCart(product.id, quantity, selectedColor);
      toast.success("محصول به سبد خرید اضافه شد.");
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
    toast.error("خطا در افزودن به سبد خرید.");
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
      toast.success("محصول از سبد خرید حذف شد.");
    }
  } catch (err) {
    console.error("خطا در حذف محصول از سبد خرید:", err);
    toast.error("خطا در حذف محصول از سبد خرید.");
  }
};
const handleImageSwitch = (image) => setActiveImage(image);


useEffect(() => {
  const checkWishlist = async () => {
    try {
      if (!localStorage.getItem("token")) return;
      
      const data = await fetchWishlist();
      setWishlist(data);
      
      const isInWishlist = data.some((item) => item.product_id === productId);
      setIsFavorited(isInWishlist);
    } catch (err) {
      console.error("خطا در دریافت لیست علاقه مندی‌ها:", err);
    }
  };
  
  checkWishlist();
}, [productId]);

const handleAddToWishlist = async () => {
  try {
    if (!localStorage.getItem("token")) {
      toast.error("لطفا وارد شوید تا به لیست علاقه مندی‌ها اضافه کنید.");
      return;
    }

    const data = await fetchWishlist();
    const isInWishlist = data.some((item) => item.product_id === productId);

    if (isInWishlist) {
      await removeFromWishlist(productId);
      toast.success("محصول از لیست علاقه مندی‌ها حذف شد.");
    } else {
      await addToWishlist(productId);
      toast.success("محصول به لیست علاقه مندی‌ها اضافه شد.");
    }

    const updatedWishlist = await fetchWishlist();
    setWishlist(updatedWishlist);
    setIsFavorited(updatedWishlist.some((item) => item.product_id === productId));
  } catch (err) {
    console.error("خطا در بروزرسانی لیست علاقه مندی‌ها:", err);
    toast.error("خطا در بروزرسانی لیست علاقه مندی‌ها.");
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
  if (!product || !selectedColor) {
    return; 
  }

  const maxQuantity = colorQuantity < 3 ? colorQuantity : 3;

  if (newQuantity > maxQuantity) {
    toast.warning(`شما نمی‌توانید بیشتر از ${maxQuantity} عدد از این محصول را اضافه کنید.`);
    setQuantity(maxQuantity); 
    return;
  }

  if (newQuantity > product.quantity && !warned) {
    toast.warning(`تعداد درخواستی بیشتر از موجودی است. موجودی محصول: ${product.quantity}`);
    setWarned(true); 
    setQuantity(product.quantity);  
    return;
  }

  setQuantity(newQuantity); 
};

const [warned, setWarned] = useState(false);

useEffect(() => {
  const updateQuantity = async () => {
    if (!product || !selectedColor) return;

    const maxQuantity = colorQuantity < 3 ? colorQuantity : 3;

    if (quantity > maxQuantity) {
      setQuantity(maxQuantity);
    }

    if (quantity > product.quantity && !warned) {
      setQuantity(product.quantity);
      setWarned(true);
      return;
    }

    const cartItem = cartItems.find(
      (item) => item.product.id === product.id && item.color.id === selectedColor
    );

    if (cartItem && cartItem.quantity !== quantity) {
      await updateCartItemQuantity(cartItem.id, quantity, selectedColor);
      const cartData = await fetchAllCartItems();
      setCartItems(cartData);
    }

    if (product && quantity <= product.quantity && warned) {
      setWarned(false);
    }
  };

  updateQuantity();
}, [quantity, selectedColor, product, warned]); 


  if (loading) return <Spinner/>;
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
            colorQuantity={colorQuantity}
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
      <StickyBar 
        product={product}
        selectedColor={selectedColor}
        quantity={quantity}
        colorQuantity={colorQuantity}
        setQuantity={handleQuantityChange}  
        handleAddToCart={selectedColor ? (isInCart ? handleRemoveFromCart : handleAddToCart) : null}
        handleAddToWishlist={handleAddToWishlist}
        isFavorited={isFavorited}
        handleColorChange={handleColorChange}
        buttonText={selectedColor ? buttonText : "ابتدا رنگ انتخاب کنید"}
        btnClass={selectedColor ? btnClass : "disabledbtn"}
        />
    </div>
  );
};

export default ProductTopPage;
