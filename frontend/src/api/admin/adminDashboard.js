import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/users';

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