// src/components/Product/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/products/';

export const fetchProductDetails = async (productId) => {
  const response = await axios.get(`${API_URL}${productId}/`);
  return response.data;
};
