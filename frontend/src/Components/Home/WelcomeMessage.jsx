// src/components/Home/WelcomeMessage.jsx
import React from 'react';
import './css/Home.css';

const WelcomeMessage = ({ username, role = 'User' }) => (
  <div>
    <h1 className='welcome-username'>Welcome, {username}</h1>
    <p>Your role: {role}</p>
  </div>
);

export default WelcomeMessage;
