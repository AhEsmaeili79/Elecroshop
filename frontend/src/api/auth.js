import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/',
});

export const register = (userData) => api.post('auth/users/', userData);
export const login = (userData) => api.post('auth/jwt/create/', userData);
export const logout = () => {
    const token = localStorage.getItem('token');
    return api.post('/auth/jwt/destroy/', {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username'); // Clear username
    });
};

const API_URL = 'http://localhost:8000/api/'; // Adjust based on your setup

export const getUserInfo = async (token) => {
    const response = await axios.get(`${API_URL}profile/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const updateUserInfo = async (token, userData) => {
    const response = await axios.patch(`${API_URL}profile/`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Important for file uploads
        },
    });
    return response;
};