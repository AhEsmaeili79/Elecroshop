import axios from 'axios';

const CART_API_URL = import.meta.env.VITE_API_URL + '/cart-items/';

const token =  localStorage.getItem('token');

const getAuthHeaders = () => {
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {}; 
};

export const fetchCartItems = async () => {
  if (!token) {
    return [];
  }
  try {
    const response = await axios.get(CART_API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error.response?.data || error.message);
    return []; 
  }
};

export const fetchCartItem = async (productId, color_id) => {
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(CART_API_URL, getAuthHeaders());
    return response.data.find(item => item.product.id === parseInt(productId) && item.color.id === color_id) || null;
  } catch (error) {
    return null; 
  }
};

export const fetchAllCartItems = async () => {
  if (!token) {
    return [];
  }
  try {
    const response = await axios.get(CART_API_URL, getAuthHeaders());
    return response.data; 
  } catch (error) {
    console.error('Error fetching all cart items:', error.response?.data || error.message);
    return [];
  }
};

export const fetchCartItemByProductId = async (productId) => {
  if (!token) {
    return null; 
  }
  try {
    const response = await axios.get(CART_API_URL, getAuthHeaders());
    const cartItem = response.data.find(item => item.product.id === productId);
    return cartItem || null; 
  } catch (error) {
    console.error('Error fetching cart item by productId:', error.response?.data || error.message);
    return null; 
  }
};

export const addProductToCart = async (productId, quantity, color_id) => {
  if (!token) {
    return [];
  }
  try {
    const currentCart = await axios.get(CART_API_URL, getAuthHeaders());
    const productInCart = currentCart.data.find(item => item.product_id === productId && item.color_id === color_id);

    if (productInCart) {
      const newQuantity = productInCart.quantity + quantity;
      if (newQuantity > 3) {
        console.error('Cannot add more than 3 of the same product');
        return null;
      }
    } else {
      if (quantity > 3) {
        console.error('Cannot add more than 3 of the same product');
        return null;
      }
    }
    const response = await axios.post(
      CART_API_URL,
      { product_id: productId, quantity, color_id },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding product to cart:', error.response?.data || error.message);
    return null; 
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity, color_id) => {
  try {
    if (quantity > 3) {
      console.error('Cannot update the quantity to more than 3');
      return null;
    }
    const response = await axios.patch(
      `${CART_API_URL}${cartItemId}/`,
      { quantity, color_id },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error.response?.data || error.message);
    return null; 
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    await axios.delete(`${CART_API_URL}${cartItemId}/`, getAuthHeaders());
    console.log(`Item with ID ${cartItemId} removed from cart`);
  } catch (error) {
    console.error('Error removing cart item:', error.response?.data || error.message);
  }
};
