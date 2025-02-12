import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/customer-products/';
const CART_API_URL = import.meta.env.VITE_API_URL + '/cart-items/';
const WISHLIST_API_URL = import.meta.env.VITE_API_URL + '/wishlist/';
const USER_API_URL = import.meta.env.VITE_API_URL + '/users';

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
  try {
      const response = await axios.get(`${USER_API_URL}/user/`, { headers: getAuthHeader() });
      return response.data;
  } catch (error) {
    console.error();
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
    console.error();
    throw error;
  }
};

export const fetchCartItem = async (productId) => {
  try {
    const response = await axios.get(CART_API_URL, { headers: getAuthHeader() });
    return response.data.find(item => item.product.id === parseInt(productId)) || null;
  } catch (error) {
    console.error();
    throw error;
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
    console.error();
    throw error;
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    await axios.delete(`${CART_API_URL}${cartItemId}/`, { headers: getAuthHeader() });
  } catch (error) {
    console.error();
    throw error;
  }
};

export const addToWishlist = async (productId) => {
  try {
    const response = await axios.post(
      `${WISHLIST_API_URL}${productId}/add_to_wishlist/`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error();
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await axios.delete(
      `${WISHLIST_API_URL}${productId}/remove_from_wishlist/`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error();
    throw error;
  }
};

export const fetchWishlist = async () => {
  try {
    const response = await axios.get(WISHLIST_API_URL, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error();
    throw error;
  }
};


