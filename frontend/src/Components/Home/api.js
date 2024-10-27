// src/components/Home/index.js
// src/components/Home/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/products/';

export const fetchLatestProducts = async () => {
  const response = await axios.get(`${API_URL}`); // Adjust endpoint based on your API's design
  return response.data;
};
