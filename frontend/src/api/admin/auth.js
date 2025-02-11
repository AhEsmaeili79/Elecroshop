import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/users';

export const login = async (username, password) => {
  username = username.toLowerCase();
  try {
    const response = await axios.post(`${API_URL}/login/admin/`, { username, password });
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'An error occurred');
    } else if (error.request) {
      throw new Error('پاسخی از سرور دریافت نشد');
    } else {
      throw new Error(error.message);
    }
  }
};


export const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const accessToken = localStorage.getItem('access_token');

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const response = await axios.post(
    `${API_URL}/logout/`,
    { refresh: refreshToken },
    {
      headers: { Authorization: `Bearer ${accessToken}` }, 
    }
  );

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return response.data;
};