import axios from 'axios';

const USER_API_URL = import.meta.env.VITE_API_URL + '/users';
const PRODUCT_API_URL = import.meta.env.VITE_API_URL + '/customer-products/';
const ORDER_API_URL = import.meta.env.VITE_API_URL + '/order/orders';
const WISHLIST_API_URL = import.meta.env.VITE_API_URL + "/wishlist/";
const CATEGORY_API_URL = import.meta.env.VITE_API_URL +'/category';


const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`, 
    },
  });


export const fetchUserData = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
      return null; 
  }

  try {
      const response = await axios.get(`${USER_API_URL}/user/`, getAuthHeaders())
      return response.data;
  } catch (error) {
      if (error.response && error.response.status === 401) {
          return null; 
      }
      return null; 
  }
};


export const fetchUserOrders = async () => {
    const response = await axios.get(`${ORDER_API_URL}/`, getAuthHeaders())
    return response.data; 
  };


export const fetchProductList = async () => {
    const response = await axios.get(`${PRODUCT_API_URL}`);
    return response.data;
  };
  

  export const fetchWishlist = async () => {
    try {
        const headers = getAuthHeaders();
        if (!headers) return [];
        const response = await axios.get(WISHLIST_API_URL, getAuthHeaders());
        return response.data;
    } catch {
        return [];
    }
};


export const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${CATEGORY_API_URL}/seller-categories/`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

  export const fetchBrands = async () => {
    const response = await axios.get(`${CATEGORY_API_URL}/brands/`);
    return response.data;
  };

  export const fetchModels = async () => {
    const response = await axios.get(`${CATEGORY_API_URL}/models/`);
    return response.data;
  };