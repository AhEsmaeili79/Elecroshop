import React, { useEffect, useState } from 'react';
import { fetchCartItems, updateCartItemQuantity, removeCartItem } from './api/cartApi';
import CartItem from './CartItem';
import './css/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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

  // Calculate total price based on cart items
  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setTotalPrice(total);
  };

  // Handle quantity updates and update total price in real-time
  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return; // Prevent quantity from being less than 1
    try {
      const updatedItem = await updateCartItemQuantity(itemId, quantity);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
        );
        calculateTotalPrice(updatedItems); // Update total price immediately
        return updatedItems; // Return updated items for state
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
        calculateTotalPrice(updatedItems); // Update total price immediately
        return updatedItems; // Return updated items for state
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
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
