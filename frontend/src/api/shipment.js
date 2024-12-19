// api.js

import axios from 'axios';

// Fetch shipping options from the API
export const fetchShippingOptions = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/order/shipments/');
    return response.data;  // Assuming the response contains the shipping data in an array
  } catch (error) {
    console.error('Error fetching shipping options:', error);
    return [];
  }
};
