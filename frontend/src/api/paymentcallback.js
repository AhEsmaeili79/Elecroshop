import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const verifyPayment = async (authority, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/order/payment/callback/`, {
        params: { Authority: authority, Status: status },  
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data; 
    } catch (error) {
      console.error();
      throw error;
    }
  };

