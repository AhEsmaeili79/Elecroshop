import axios from 'axios';

// Define your API base URL
const API_URL = 'http://127.0.0.1:8000/api/users';

// Function to log in a user
export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/login/`, {
    username,
    password,
  });
  // Store tokens in local storage if the login is successful
  localStorage.setItem('token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;
};


// Function to sign up a user
export const signupUser = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup/`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Log the error message from the response if available
    console.error('Signup error:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error after logging it
  }
};


// Function to log out a user
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
      headers: { Authorization: `Bearer ${accessToken}` }, // Add the access token in headers
    }
  );

  // Clear tokens from local storage after logout
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  return response.data;
};


// Function to refresh the access token
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    console.error('No refresh token found.');
    return;
  }
  try {
    const response = await axios.post(`${API_URL}/refresh/`, {
      refresh: refreshToken,
    });
    localStorage.setItem('token', response.data.access); // Store new access token
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Optionally handle logout or redirection to login page
  }
};