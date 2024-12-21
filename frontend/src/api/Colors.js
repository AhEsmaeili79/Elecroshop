import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/colors/';

// Fetch all colors
export const fetchColors = async () => {
    const response = await axios.get(API_URL);
    return response.data;
  };
  