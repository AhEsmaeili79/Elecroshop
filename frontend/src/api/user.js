import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/users';

export const fetchUserData = async () => {
    const token = localStorage.getItem('token');
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
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
        }
        return null; 
    }
};

export const updateUser = async (userData) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    const response = await axios.patch(`${API_URL}/user/`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
