
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL +'/category';

export const fetchModels = async () => {
  const response = await axios.get(`${API_URL}/models/`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/`);
  return response.data;
};

export const fetchCategoryDetail = async (categoryId) => {
  const response = await axios.get(`${API_URL}/categories/${categoryId}/`);
  return response.data;
};

export const fetchBrands = async () => {
  const response = await axios.get(`${API_URL}/brands/`);
  return response.data;
};
