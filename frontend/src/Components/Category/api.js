// src/components/Category/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/category';



const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// Fetch all models
export const fetchModels = async () => {
  const response = await axios.get(`${API_URL}/models/`);
  return response.data;
};

// Fetch all categories
export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/`, getAuthHeaders());
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

// Add a new category (Admin/Seller only)
export const addCategory = async (categoryData) => {
  const response = await axios.post(`${API_URL}/categories/`, categoryData, getAuthHeaders());
  return response.data;
};

// Add a new model
export const addModel = async (modelData) => {
  const response = await axios.post(`${API_URL}/models/`, modelData, getAuthHeaders());
  return response.data;
};

// Add a new brand
export const addBrand = async (brandData) => {
  const response = await axios.post(`${API_URL}/brands/`, brandData, getAuthHeaders());
  return response.data;
};

// Update a category
export const updateCategory = async (categoryId, updatedData) => {
  const response = await axios.put(`${API_URL}/categories/${categoryId}/`, updatedData, getAuthHeaders());
  return response.data;
};

// Delete a model
export const deleteModel = async (modelId) => {
  await axios.delete(`${API_URL}/models/${modelId}/`, getAuthHeaders());
};

// Delete a brand
export const deleteBrand = async (brandId) => {
  await axios.delete(`${API_URL}/brands/${brandId}/`, getAuthHeaders());
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  await axios.delete(`${API_URL}/categories/${categoryId}/`, getAuthHeaders());
};



// Add a new subcategory under a specific category
export const fetchSubCategories = async () => {
  const response = await axios.get(`${API_URL}/subcategories/`, getAuthHeaders());
  return response.data;
};

// Add a new subcategory
export const addSubCategory = async (subcategoryData) => {
  const response = await axios.post(`${API_URL}/subcategories/`, subcategoryData, getAuthHeaders());
  return response.data;
};

// Delete a subcategory
export const deleteSubCategory = async (subCategoryId) => {
  await axios.delete(`${API_URL}/subcategories/${subCategoryId}/`, getAuthHeaders());
};