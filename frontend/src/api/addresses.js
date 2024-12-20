import axios from 'axios';

// Set up the base URL for the API
const API_URL = "http://127.0.0.1:8000/api/users/addresses/";

// Get the token from local storage
const token = localStorage.getItem('token');

// Axios configuration with headers
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
};

// Fetch all addresses
export const getAddress = () => {
  return axios.get(API_URL, config);
};

// Add a new address
export const addAddress = (addressData) => {
  return axios.post(API_URL, addressData, config);
};

// Update an existing address
export const updateAddress = (id, addressData) => {
  return axios.put(`${API_URL}${id}/`, addressData, config);
};

// Delete an address
export const deleteAddress = (id) => {
  return axios.delete(`${API_URL}${id}/`, config);
};

