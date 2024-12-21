// api.js

import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/order/shipments/';

// Fetch shipping options from the API
export const fetchShippingOptions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;  // Assuming the response contains the shipping data in an array
  } catch (error) {
    console.error('Error fetching shipping options:', error);
    return [];
  }
};
