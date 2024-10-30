import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/order/orders';


// Get the authorization token from local storage
const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token for authentication
    },
  });


// Create an order using the updated endpoint
export const createOrder = async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/`, orderData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  
// Function to fetch order details by order ID
export const fetchOrderDetails = async (orderId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${orderId}/`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
};


// Function to get order summary (can include filters if needed)
export const fetchOrderSummary = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order summary:", error);
    throw error;
  }
};


const cart_API_URL = 'http://127.0.0.1:8000/api/cart-items/';

// Fetch cart items from the server
export const fetchCartItems = async () => {
  const response = await axios.get(cart_API_URL, getAuthHeaders());
  return response.data;
};
