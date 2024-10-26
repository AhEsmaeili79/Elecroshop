import React, { useEffect, useState } from 'react';
import { fetchRoleRequests, updateRoleRequest } from './api';

const AdminRoleRequests = () => {
  const [requests, setRequests] = useState([]);

  // Function to fetch role requests from the API
  const getRoleRequests = async () => {
    try {
      const data = await fetchRoleRequests(); // Fetch data from the API
      setRequests(data); // Update state with fetched data
    } catch (error) {
      console.error('Failed to fetch role requests:', error);
    }
  };

  // Function to handle updating the role request status
  const handleUpdateRequest = async (requestId, status) => {
    try {
      await updateRoleRequest(requestId, status); // Update the request status
      getRoleRequests(); // Refresh the list after updating
    } catch (error) {
      console.error('Failed to update request:', error);
    }
  };

  // useEffect to fetch requests on component mount
  useEffect(() => {
    getRoleRequests(); // Initial fetch of role requests
  }, []);

  return (
    <div>
      <h2>Manage Role Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Request Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.user.username}</td>
              <td>{request.user.email}</td>
              <td>{new Date(request.request_time).toLocaleString()}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'pending' && (
                  <>
                    <button onClick={() => handleUpdateRequest(request.id, 'approved')}>Approve</button>
                    <button onClick={() => handleUpdateRequest(request.id, 'denied')}>Deny</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRoleRequests;
