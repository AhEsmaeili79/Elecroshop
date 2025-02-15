import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL + '/order/shipments/';

export const fetchShippingOptions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;  
  } catch (error) {
    console.error('Error fetching shipping options:', error);
    return [];
  }
};
