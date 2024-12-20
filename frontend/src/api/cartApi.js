import axios from 'axios';

// Base API URLs
const CART_API_URL = 'http://127.0.0.1:8000/api/cart-items/';

// Utility function to get the token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Utility function to get Authorization headers
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

// Fetch cart items from the server
export const fetchCartItems = async () => {
  const response = await axios.get(CART_API_URL, getAuthHeaders());
  return response.data;
};

export const fetchCartItem = async (productId, color_id) => {
  try {
    const response = await axios.get(CART_API_URL,getAuthHeaders());
    return response.data.find(item => item.product.id === parseInt(productId) && item.color.id === color_id) || null;
  } catch (error) {
    console.error('Error fetching cart item:', error.response?.data);
    return null;
  }
};

// Fetch all cart items
export const fetchAllCartItems = async () => {
  try {
    const response = await axios.get(CART_API_URL, getAuthHeaders());
    return response.data; // Return the cart items data
  } catch (error) {
    console.error('Error fetching all cart items:', error.response?.data);
    throw new Error("Failed to fetch cart items");
  }
};

// Fetch a specific cart item by productId
export const fetchCartItemByProductId = async (productId) => {
  try {
    const response = await axios.get(CART_API_URL, getAuthHeaders());
    const cartItem = response.data.find(item => item.product.id === productId);
    return cartItem || null; // Return the cart item if found, otherwise null
  } catch (error) {
    console.error('Error fetching cart item by productId:', error.response?.data);
    throw new Error("Failed to fetch cart item");
  }
};

// Add a product to the cart
export const addProductToCart = async (productId, quantity, color_id) => {
  try {
    const response = await axios.post(
      CART_API_URL,
      { product_id: productId, quantity, color_id },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding product to cart:', error.response?.data);
    throw new Error(error.response?.data?.detail || "Failed to add product to cart");
  }
};

// Update the quantity of an item in the cart
export const updateCartItemQuantity = async (cartItemId, quantity, color_id) => {
  try {
    const response = await axios.patch(
      `${CART_API_URL}${cartItemId}/`,
      { quantity, color_id },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error.response?.data);
    throw new Error("Failed to update cart item quantity");
  }
};

// Remove a cart item from the cart
export const removeCartItem = async (cartItemId) => {
  try {
    await axios.delete(`${CART_API_URL}${cartItemId}/`, getAuthHeaders());
    console.log(`Item with ID ${cartItemId} removed from cart`);
  } catch (error) {
    console.error('Error removing cart item:', error.response?.data);
    throw new Error("Failed to remove item from cart");
  }
};



