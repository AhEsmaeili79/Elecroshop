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
