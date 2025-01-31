import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/users';

// Function to handle the login API request
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/admin/`, { username, password });
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'An error occurred');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};


export const fetchUserData = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
      return null; 
  }

  try {
      const response = await axios.get(`${API_URL}/user/`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      if (error.response && error.response.status === 401) {
          return null; 
      }
      return null; 
  }
};