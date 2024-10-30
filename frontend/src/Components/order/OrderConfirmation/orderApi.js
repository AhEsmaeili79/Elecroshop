const API_BASE_URL = 'http://127.0.0.1:8000/api/order/orders';


// Get the authorization token from local storage
const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token for authentication
    },
  });


  export const fetchUserOrders = async () => {
    try {
        const response = axios.get(`${API_BASE_URL}`,getAuthHeaders());  // Adjust the URL to your endpoint
        return response.data;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw error;
    }
};