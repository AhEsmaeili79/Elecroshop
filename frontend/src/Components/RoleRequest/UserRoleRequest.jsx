// src/Components/RoleRequest/UserRoleRequest.jsx
import React, { useState } from 'react';
import { createRoleRequest } from './api';

const UserRoleRequest = ({ user }) => {
  const [message, setMessage] = useState('');

  const handleRequestRoleChange = async () => {
    try {
      await createRoleRequest();
      setMessage('Your request has been submitted and is pending approval.');
    } catch (error) {
      setMessage('Failed to submit the request.');
      console.error(error);
    }
  };

  return (
    <div>
      {user.role === 'customer' ? (
        <button onClick={handleRequestRoleChange}>Request to be a Seller</button>
      ) : (
        <p>You are not eligible to request a role change.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserRoleRequest;
