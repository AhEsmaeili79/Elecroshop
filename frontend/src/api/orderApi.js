import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + '/order/orders';
const cart_API_URL = import.meta.env.VITE_API_URL + '/cart-items/';

const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, 
    },
  });


  export  const fetchOrderByCode = async (orderCode) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/?order_code=${orderCode}`, getAuthHeaders());
      return response.data; 
    } catch (error) {
      console.log();
      throw error;
    }
  };

// Create an order using the updated endpoint
export const createOrder = async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/`, orderData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.log();
     throw error;
    }
  };


  export const fetchUserOrders = async () => {
    const response = await axios.get(`${API_BASE_URL}/`, getAuthHeaders())
    return response.data; 
  };

  
export const fetchOrderDetails = async (orderCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/?order_code=${orderCode}`, getAuthHeaders());
        return response.data;
    } catch (error) {
      console.log();
      throw error;
    }
};


export const fetchCartItems = async () => {
  const response = await axios.get(cart_API_URL, getAuthHeaders());
  return response.data;
};


