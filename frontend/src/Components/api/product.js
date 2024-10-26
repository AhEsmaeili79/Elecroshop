// src/Components/api/product.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/products/';

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

export const fetchSellerProducts = async () => {
  try {
    const response = await axiosInstance.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching seller products:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Add other CRUD operations if needed

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

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(`${productId}/`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};