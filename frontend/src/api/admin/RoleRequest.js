// src/Components/RoleRequest/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL +'/role_request';


export const fetchRoleRequests = async () => {
    const accessToken = localStorage.getItem('access_token'); 
  
    const response = await axios.get(`${API_URL}/requests/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, 
      },
    });
  
    return response.data; 
  };

export const updateRoleRequest = async (requestId, status) => {
    try {
      const accessToken = localStorage.getItem('access_token'); 
  
      const response = await axios.patch(
        `${API_URL}/request/${requestId}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, 
          },
        }
      );
  
      return response.data; 
    } catch (error) {
      console.error('Error updating role request:', error.response.data || error.message);
      throw error; 
    }
  };

