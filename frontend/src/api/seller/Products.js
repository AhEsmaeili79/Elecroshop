import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/products/';
const token = localStorage.getItem('access_token');

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

export const addProduct = async (productData) => {
  try {

    const response = await axios.post(API_URL, productData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error adding product:', error.response ? error.response.data : error.message);
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