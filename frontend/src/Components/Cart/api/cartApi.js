import axios from 'axios';

// Set up the base URL for your API
const API_URL = 'http://127.0.0.1:8000/api/cart-items/';

// Get the authorization token from local storage
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token for authentication
  },
});

// Fetch cart items from the server
export const fetchCartItems = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// Update the quantity of an item in the cart
export const updateCartItemQuantity = async (itemId, quantity) => {
  const response = await axios.patch(`${API_URL}${itemId}/`, { quantity }, getAuthHeaders());
  return response.data;
};

// Remove an item from the cart
export const removeCartItem = async (itemId) => {
  await axios.delete(`${API_URL}${itemId}/`, getAuthHeaders());
};
