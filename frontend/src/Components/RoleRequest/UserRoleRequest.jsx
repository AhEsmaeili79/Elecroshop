import React, { useEffect, useState } from 'react';
import { createRoleRequest, fetchUserRoleRequestStatus,deleteRoleRequest  } from './api';

const UserRoleRequest = ({ user }) => {
  const [requestStatus, setRequestStatus] = useState(null);
  const [canRequestAgain, setCanRequestAgain] = useState(false);
  const [message, setMessage] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [requestTime, setRequestTime] = useState(null);
  const [requestdenid, setRequestTimeDenid] = useState(null);

  
  useEffect(() => {
    const getRequestStatus = async () => {
      try {
        const data = await fetchUserRoleRequestStatus();
        setRequestStatus(data.status);
        setCanRequestAgain(data.can_request_again);
        setRequestId(data.request_id);
        setRequestTime(data.request_time);
        setRequestTimeDenid(data.denied_time)
        console.log(data);
      } catch (error) {
        console.error('Failed to fetch role request status:', error);
      }
    };
    getRequestStatus();
  }, []);

  const handleRequestRoleChange = async () => {
    try {
      await createRoleRequest();
      setMessage('Your request has been submitted and is pending approval.');
      setCanRequestAgain(false);
    } catch (error) {
      setMessage('Failed to submit the request.');
      console.error(error);
    }
  };


  const handleDeleteRequest = async () => {
    try {
      await deleteRoleRequest(requestId);
      setMessage('Your request has been Canceled.');
      setRequestStatus(null);
      setCanRequestAgain(true); // Allow the user to submit a new request
    } catch (error) {
      setMessage('Failed to Cancel the request.');
      console.error(error);
    }
  };

  return (
    <div>
      {canRequestAgain ? (
        <button onClick={handleRequestRoleChange}>Request to be a Seller</button>
      ) : requestStatus === 'pending' ? (
        <div>
          <p>Your request is pending approval.</p>
          <p>Request Time: {new Date(requestTime).toLocaleString()}</p>
          <button onClick={handleDeleteRequest}>Cancel Request</button>
        </div>
      ) : requestStatus === 'denied' ? (
        <div>
          <p>Your request has been denied.</p>
          <p>Denied Time: {new Date(requestdenid).toLocaleString()}</p>
          <p>Status: Denied</p>
          <button onClick={handleDeleteRequest}>Delete Request</button>
        </div>
      ) : (
        <p>Your request is currently in "{requestStatus}" status.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default UserRoleRequest;
