import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token for authentication
    },
  });

// Function to handle payment callback
// Function to handle payment callback
export const verifyPayment = async (authority, status) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await axios.get(`${API_BASE_URL}/order/payment/callback/`, {
        params: { Authority: authority, Status: status },  // Pass query params here
        headers: {
          Authorization: `Bearer ${token}`, // Directly include the token in headers
        },
      });
      return response.data; // Returns response containing payment status and details
    } catch (error) {
      console.error('Error verifying payment:', error.response || error);
      throw error;
    }
  };

