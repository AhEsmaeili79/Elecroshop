// src/Components/api/product.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/products/';
const API_URL_PRODUCT = import.meta.env.VITE_API_URL + 'customer-products/';
// Fetch token from localStorage
const token = localStorage.getItem('token');

// Create an instance of Axios with authorization headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  },
});

// Fetch product details by productId
export const fetchProductDetails = async (productId) => {
  try {
    const response = await axios.get(`${API_URL_PRODUCT}${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error.response?.data);
    throw new Error("Failed to fetch product details");
  }
};

// SellerProductList.jsx
export const fetchSellerProducts = async () => {
  try {
    const response = await axiosInstance.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching seller products:', error);
    throw error;
  }
};

// AddProduct.jsx
export const addProduct = async (productData) => {
  try {
    // Get the token from localStorage (or wherever you store it)
    const token = localStorage.getItem('token'); // Adjust this based on where you store your token

    // Send POST request to the API URL with the product data
    const response = await axios.post(API_URL, productData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for handling file uploads
        Authorization: `Bearer ${token}`, // Add this line for token authentication
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error adding product:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the error for further handling
  }
};




// EditProduct.jsx
export const fetchProduct = async (productId) => {
  try {
    const response = await axiosInstance.get(`${productId}/`); // Append the product ID to the URL
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};


export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`${productId}/`, productData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

