import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/products/';
const API_URL_PRODUCT = import.meta.env.VITE_API_URL + 'customer-products/';

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  },
});

export const fetchProductDetails = async (productId) => {
  try {
    const response = await axios.get(`${API_URL_PRODUCT}${productId}/`);
    return response.data;
  } catch (error) {
    console.error();
    throw error;
  }
};

export const fetchSellerProducts = async () => {
  try {
    const response = await axiosInstance.get('');
    return response.data;
  } catch (error) {
    console.error();
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const token = localStorage.getItem('token'); 

    const response = await axios.post(API_URL, productData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error();
    throw error;
  }
};


export const fetchProduct = async (productId) => {
  try {
    const response = await axiosInstance.get(`${productId}/`); 
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
    console.error();
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`${productId}/`);
    return response.data;
  } catch (error) {
    console.error();
    throw error;
  }
};

