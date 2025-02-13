// src/components/Category/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL +'/category';

// Fetch all models
export const fetchModels = async () => {
  const response = await axios.get(`${API_URL}/models/`);
  return response.data;
};

// Fetch all categories
export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/`);
  return response.data;
};

// Fetch details for a single category
export const fetchCategoryDetail = async (categoryId) => {
  const response = await axios.get(`${API_URL}/categories/${categoryId}/`);
  return response.data;
};

// Fetch all brands
export const fetchBrands = async () => {
  const response = await axios.get(`${API_URL}/brands/`);
  return response.data;
};
