import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Fetch cart items and calculate total price
  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/cart-items/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token for authentication
        },
      });
      setCartItems(response.data);
      calculateTotalPrice(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Calculate total price based on cart items
  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setTotalPrice(total);
  };

  // Update item quantity in cart
  const updateCartItemQuantity = async (itemId, quantity) => {
    if (quantity < 1) return; // Prevent quantity from being less than 1
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/cart-items/${itemId}/`, {
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token for authentication
        },
      });
      const updatedItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: response.data.quantity } : item
      );
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/cart-items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token for authentication
        },
      });
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  // Render cart items
  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.product.main_photo} alt={item.product.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h2>{item.product.name}</h2>
                <p>Price: ${item.product.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeCartItem(item.id)} className="remove-button">Remove</button>
              </div>
            </div>
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
