import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + '/order/orders';


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


  export const fetchUserOrders = async () => {
    const response = await axios.get(`${API_BASE_URL}/`, getAuthHeaders())
    return response.data; // Assuming the API returns an array of orders
  };

  
// Function to fetch order details by order ID
export const fetchOrderDetails = async (orderCode) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/?order_code=${orderCode}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
};

const cart_API_URL = 'http://127.0.0.1:8000/api/cart-items/';

// Fetch cart items from the server
export const fetchCartItems = async () => {
  const response = await axios.get(cart_API_URL, getAuthHeaders());
  return response.data;
};


