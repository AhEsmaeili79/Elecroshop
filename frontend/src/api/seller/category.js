// src/components/Category/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL +'/category';


const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
});


export const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/seller-categories/`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  };

  export const fetchCategoryDetail = async (categoryId) => {
    try {
    const response = await axios.get(`${API_URL}/seller-categories/${categoryId}/`,getAuthHeaders());
    return response.data;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        throw error;
  }
  };
  
export const addCategory = async (categoryData) => {
    const response = await axios.post(`${API_URL}/categories/`, categoryData, getAuthHeaders());
    return response.data;
  };
  
  
  export const updateCategory = async (categoryId, updatedData) => {
    const response = await axios.put(`${API_URL}/seller-categories/${categoryId}/`, updatedData, getAuthHeaders());
    return response.data;
  };
  

  export const deleteCategory = async (categoryId) => {
    await axios.delete(`${API_URL}/seller-categories/${categoryId}/`, getAuthHeaders());
  };
  

  export const addModel = async (modelData) => {
    const response = await axios.post(`${API_URL}/models/`, modelData, getAuthHeaders());
    return response.data;
  };
  
  export const deleteModel = async (modelId) => {
    await axios.delete(`${API_URL}/models/${modelId}/`, getAuthHeaders());
  };

  export const addBrand = async (brandData) => {
    const response = await axios.post(`${API_URL}/brands/`, brandData, getAuthHeaders());
    return response.data;
  };
  

  export const deleteBrand = async (brandId) => {
    await axios.delete(`${API_URL}/brands/${brandId}/`, getAuthHeaders());
  };
  
 
  export const fetchSubCategories = async () => {
    const response = await axios.get(`${API_URL}/subcategories/`, getAuthHeaders());
    return response.data;
  };
  
  export const addSubCategory = async (subcategoryData) => {
    const response = await axios.post(`${API_URL}/subcategories/`, subcategoryData, getAuthHeaders());
    return response.data;
  };
  
  export const deleteSubCategory = async (subCategoryId) => {
    await axios.delete(`${API_URL}/subcategories/${subCategoryId}/`, getAuthHeaders());
  };