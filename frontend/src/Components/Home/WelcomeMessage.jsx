// src/components/Home/WelcomeMessage.jsx
import React from 'react';

const WelcomeMessage = ({ username, role = 'User' }) => (
  <div>
    <h1>Welcome, {username}!</h1>
    <p>Your role: {role}</p>
  </div>
);

export default WelcomeMessage;
