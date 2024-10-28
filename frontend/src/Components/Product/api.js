// src/components/Product/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/customer-products/';
const CART_API_URL = 'http://127.0.0.1:8000/api/cart-items/';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("User is not authenticated");
  return { Authorization: `Bearer ${token}` };
};

export const fetchProductDetails = async (productId) => {
  const response = await axios.get(`${API_URL}${productId}/`);
  return response.data;
};

export const addProductToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(
      CART_API_URL,
      { product_id: productId, quantity },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding product to cart:', error.response.data);
    throw new Error(error.response?.data?.detail || "Failed to add product to cart");
  }
};

export const fetchCartItem = async (productId) => {
  try {
    const response = await axios.get(CART_API_URL, { headers: getAuthHeader() });
    return response.data.find(item => item.product.id === parseInt(productId)) || null;
  } catch (error) {
    console.error('Error fetching cart item:', error.response?.data);
    return null;
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const response = await axios.patch(
      `${CART_API_URL}${cartItemId}/`,
      { quantity },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error.response?.data);
    throw new Error("Failed to update cart item quantity");
  }
};

// New function to remove a cart item
export const removeCartItem = async (cartItemId) => {
  try {
    await axios.delete(`${CART_API_URL}${cartItemId}/`, { headers: getAuthHeader() });
  } catch (error) {
    console.error('Error removing cart item:', error.response?.data);
    throw new Error("Failed to remove item from cart");
  }
};
