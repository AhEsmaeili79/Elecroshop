import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/products/";
const API_URL_PRODUCT = import.meta.env.VITE_API_URL + '/customer-products/';
const token = localStorage.getItem("access_token");

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  },
});

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/category/categories/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


export const fetchBrands = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/category/brands/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const fetchModels = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/category/models/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};

export const fetchProductDetails = async (productId) => {
  try {
    const response = await axios.get(`${API_URL_PRODUCT}${productId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

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