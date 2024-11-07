// orderApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/order/orders'; // Adjust the URL if needed

// Get the authorization token from local storage
const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token for authentication
    },
});

// Get the authorization token from local storage
export const fetchSellerOrders = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  };