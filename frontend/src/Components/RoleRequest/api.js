// src/Components/RoleRequest/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/role_request';

// Existing function to create a new role request
export const createRoleRequest = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/request/`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  };

export const fetchRoleRequests = async () => {
    const accessToken = localStorage.getItem('token'); // Retrieve token from local storage
  
    const response = await axios.get(`${API_URL}/requests/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Include the token in headers
      },
    });
  
    return response.data; // Return fetched data
  };

export const updateRoleRequest = async (requestId, status) => {
    try {
      const accessToken = localStorage.getItem('token'); // Assuming you're storing your JWT token in local storage
  
      const response = await axios.patch(
        `${API_URL}/request/${requestId}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the JWT token in the headers
          },
        }
      );
  
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error updating role request:', error.response.data || error.message);
      throw error; // Rethrow the error to handle it later
    }
  };


// Fetch the user's existing role request
export const fetchUserRoleRequest = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/request/user/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Return the user's role request
  };


// Function to fetch user's latest role request status
export const fetchUserRoleRequestStatus = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/request/status/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


// Delete the existing role request
export const deleteRoleRequest = async (requestId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/request/${requestId}/delete/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};