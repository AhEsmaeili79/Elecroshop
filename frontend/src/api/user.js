// src/components/api/user.js
import axios from 'axios';

// Define your API base URL
const API_URL = import.meta.env.VITE_API_URL + '/users';

// Function to fetch user data
export const fetchUserData = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage
    try {
        const response = await axios.get(`${API_URL}/user/`, {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
  };
  


// Function to update user data
export const updateUser = async (userData) => {
  const token = localStorage.getItem('token'); // Get the token from local storage
  const response = await axios.patch(`${API_URL}/user/`, userData, {
      headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
          'Content-Type': 'multipart/form-data', // Specify content type for FormData
      },
  });
  return response.data;
};
