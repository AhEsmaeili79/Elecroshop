import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export const getAddress = () => {
  return axiosInstance.get('/users/addresses/');
};

export const addAddress = (addressData) => {
  return axiosInstance.post('/users/addresses/', addressData);
};

export const updateAddress = (id, addressData) => {
  return axiosInstance.put(`/users/addresses/${id}/`, addressData);
};

export const deleteAddress = (id) => {
  return axiosInstance.delete(`/users/addresses/${id}/`);
};
