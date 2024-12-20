import { useState } from 'react';
import CartHeader from "./Carts/CartHeader";
import CartBottom from "./Carts/CartBottom";
import CartSection from "./Carts/CartSection";
import CartSummary from "./Carts/CartSummary";
import { useCart } from '../../../contexts/CartContext'; // Importing useCart hook
import './css/cartmain.css'

const CartMain = () => {
  const { cartItems, setCartItems } = useCart();  // Get cartItems from CartContext
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <>
      <div className="main">
        <CartHeader />
        <div className="page-content">
          <div className="cart">
            <div className="container">
              <div className="cart-content">
                <CartSection
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  setTotalPrice={setTotalPrice}
                />
                <CartSummary
                  cartItems={cartItems}
                  totalPrice={totalPrice}
                />
              </div>
              <CartBottom />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartMain;
