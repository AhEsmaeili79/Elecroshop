// src/components/Product/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/customer-products/';

export const fetchProductDetails = async (productId) => {
  const response = await axios.get(`${API_URL}${productId}/`);
  return response.data;
};

// Add product to cart with authentication
export const addProductToCart = async (productId, quantity) => {
  const token = localStorage.getItem('token'); // Retrieve the token

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/cart-items/',
      { product_id: productId, quantity }, // Ensure the keys match your serializer
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error adding product to cart:', error.response.data);
    throw new Error(error.response?.data?.detail || "Failed to add product to cart");
  }
};
