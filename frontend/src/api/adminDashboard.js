// src/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL+'/users/login/admin/'; 

// Function to handle the login API request
export const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL, { username, password });
    return response.data; // If successful, returns the response data (tokens)
  } catch (error) {
    // If there is an error, handle it
    if (error.response) {
      // The server responded with a status other than 2xx
      throw new Error(error.response.data.detail || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request
      throw new Error(error.message);
    }
  }
};
