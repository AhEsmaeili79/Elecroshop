// src/components/Login/LoginForm.jsx
import React, { useState } from 'react';
import { loginUser } from '../../api/auth'; // Import the login API function

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      // Redirect to home or another page after successful login
      window.location.href = '/'; 
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
