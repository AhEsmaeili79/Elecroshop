import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/users';

export const loginUser = async (username, password) => {
  username = username.toLowerCase();
  const response = await axios.post(`${API_URL}/login/`, {
    username,
    password,
  });
  localStorage.setItem('token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;
};

export const signupUser = async (username, email, password) => {
  username = username.toLowerCase();
  email = email.toLowerCase();
  try {
    const response = await axios.post(`${API_URL}/signup/`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log();
    throw error;
  }
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const accessToken = localStorage.getItem('token');

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

  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  return response.data;
};


export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.log("No refresh token found");
    return;
  }
  try {
    const response = await axios.post(`${API_URL}/refresh/`, {
      refresh: refreshToken,
    });
    localStorage.setItem('token', response.data.access); 
    return response.data.access; 
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};
