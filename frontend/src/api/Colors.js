import axios from 'axios';

// Fetch all colors
export const fetchColors = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/colors/');
    return response.data;
  };
  