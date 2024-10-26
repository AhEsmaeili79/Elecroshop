import React, { useEffect, useState } from 'react';
import { createRoleRequest, fetchUserRoleRequestStatus, cancelRoleRequest } from './api';

const UserRoleRequest = ({ user }) => {
    const [requestStatus, setRequestStatus] = useState(null);
    const [canRequestAgain, setCanRequestAgain] = useState(false);
    const [message, setMessage] = useState('');
    const [requestId, setRequestId] = useState(null);

    useEffect(() => {
        const getRequestStatus = async () => {
            try {
                const data = await fetchUserRoleRequestStatus();
                setRequestStatus(data.status);
                setCanRequestAgain(data.can_request_again);
                setRequestId(data.request_id); // Track the ID of the request for cancellation
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

    const handleCancelRequest = async () => {
        try {
            await cancelRoleRequest(requestId); // Call the cancel function with the request ID
            setMessage('Your request has been canceled.');
            setRequestStatus('canceled'); // Update the local state to reflect cancellation
            setCanRequestAgain(true); // Re-enable the request button after cancellation
        } catch (error) {
            setMessage('Failed to cancel the request.');
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
                    <p>Request Time: {new Date(requestStatus.request_time).toLocaleString()}</p>
                    <button onClick={handleCancelRequest}>Cancel Request</button>
                </div>
            ) : (
                <p>Your request is currently in "{requestStatus}" status.</p>
            )}
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserRoleRequest;
