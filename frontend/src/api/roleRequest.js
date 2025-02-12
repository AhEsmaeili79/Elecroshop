import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL +'/role_request';

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

export const fetchUserRoleRequest = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/request/user/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; 
  };


export const fetchUserRoleRequestStatus = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/request/status/`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


export const deleteRoleRequest = async (requestId) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/request/${requestId}/delete/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};