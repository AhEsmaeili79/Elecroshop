// src/components/Product/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/customer-products/';
const CART_API_URL = 'http://127.0.0.1:8000/api/cart-items/';
const WISHLIST_API_URL = 'http://127.0.0.1:8000/api/wishlist/';
const USER_API_URL = 'http://127.0.0.1:8000/api/users';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("User is not authenticated");
  return { Authorization: `Bearer ${token}` };
};

export const fetchProductList = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const fetchProductDetails = async (productId) => {
  const response = await axios.get(`${API_URL}${productId}/`);
  return response.data;
};

export const fetchUserData = async () => {
  const token = localStorage.getItem('token'); // Get the token from local storage
  try {
      const response = await axios.get(`${USER_API_URL}/user/`, {
          headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
      });
      return response.data;
  } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
  }
};

export const addProductToCart = async (productId, quantity, color_id) => {
  try {
    const response = await axios.post(
      CART_API_URL,
      { product_id: productId, quantity, color_id:color_id },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding product to cart:', error.response?.data);
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

export const updateCartItemQuantity = async (cartItemId, quantity,color_id) => {
  try {
    const response = await axios.patch(
      `${CART_API_URL}${cartItemId}/`,
      { quantity, color_id:color_id },
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

// Add a product to the wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await axios.post(
      `${WISHLIST_API_URL}${productId}/add_to_wishlist/`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding product to wishlist:', error.response?.data);
    throw new Error(error.response?.data?.detail || "Failed to add product to wishlist");
  }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await axios.delete(
      `${WISHLIST_API_URL}${productId}/remove_from_wishlist/`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing product from wishlist:', error.response?.data);
    throw new Error(error.response?.data?.detail || "Failed to remove product from wishlist");
  }
};

// Fetch the current user's wishlist
export const fetchWishlist = async () => {
  try {
    const response = await axios.get(WISHLIST_API_URL, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error.response?.data);
    throw new Error("Failed to fetch wishlist");
  }
};


