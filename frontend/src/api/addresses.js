import axios from 'axios';

// Get the API URL from .env (note the 'VITE_' prefix)
const API_URL = import.meta.env.VITE_API_URL;

// Get the token from local storage
const token = localStorage.getItem('token');

// Axios configuration with headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// Fetch all addresses
export const getAddress = () => {
  return axiosInstance.get('/users/addresses/');
};

// Add a new address
export const addAddress = (addressData) => {
  return axiosInstance.post('/users/addresses/', addressData);
};

// Update an existing address
export const updateAddress = (id, addressData) => {
  return axiosInstance.put(`/users/addresses/${id}/`, addressData);
};

// Delete an address
export const deleteAddress = (id) => {
  return axiosInstance.delete(`/users/addresses/${id}/`);
};
