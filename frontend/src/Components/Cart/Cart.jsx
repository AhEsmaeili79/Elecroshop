// Cart.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Replace useHistory with useNavigate
import { fetchCartItems, updateCartItemQuantity, removeCartItem } from './api/cartApi';
import CartItem from './CartItem';
import './css/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const items = await fetchCartItems();
        setCartItems(items);
        calculateTotalPrice(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    getCartItems();
  }, []);

  // Navigate to another page (for example, to checkout)
  const handleCheckout = () => {
    navigate('/checkout'); // Use navigate instead of history.push
  };

  // Calculate total price based on cart items
  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setTotalPrice(total);
  };

  // Handle quantity updates and update total price in real-time
  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const updatedItem = await updateCartItemQuantity(itemId, quantity);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
        );
        calculateTotalPrice(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  // Handle item removal and update total price in real-time
  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== itemId);
        calculateTotalPrice(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemove={handleRemoveItem} 
            />
          ))}
          <div className="cart-total">
            <h3>Total Price: ${totalPrice}</h3>
          </div>
          <button onClick={handleCheckout} className="checkout-button">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
