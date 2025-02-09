import { useState } from 'react';
import CartHeader from '../../components/Header/CartHeader/CartHeader';
import CartBottom from './Components/CartBottom';
import CartSection from './Components/CartSection';
import CartSummary from './Components/CartSummary';
import { useCart } from '../../contexts/CartContext'; 
import './css/cartmain.rtl.css'

const CartBody = () => {
  const { cartItems, setCartItems } = useCart();  
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <>
      <div className="main">
        <CartHeader />
        <div className="page-content">
          <div className="cart">
            <div className="container">
            <CartBottom />
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
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartBody;
