import { useState } from 'react';
import CartHeader from '../../components/Header/CartHeader/CartHeader';
import CartBottom from './Components/CartBottom';
import CartSection from './Components/CartSection';
import CartSummary from './Components/CartSummary';
import { useCart } from '../../contexts/CartContext'; // Importing useCart hook
import './css/cartmain.rtl.css'

const CartBody = () => {
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

export default CartBody;
