// src/Home.jsx
import React, { useEffect, useState } from 'react';
import { fetchUserData } from '../api'; // Import the fetch user data function

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const getUserData = async () => {
    try {
      const data = await fetchUserData();
      setUserData(data);
    } catch (error) {
      setError('Failed to fetch user data.');
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <h2>Welcome to Your Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {userData ? (
        <div>
          <h3>User Information:</h3>
          <p>First Name: {userData.first_name || 'N/A'}</p>
          <p>Last Name: {userData.last_name || 'N/A'}</p>
          <p>Phone Number: {userData.phonenumber || 'N/A'}</p>
          <p>Date of Birth: {userData.date_birth ? new Date(userData.date_birth).toLocaleDateString() : 'N/A'}</p>
          <p>Address: {userData.address || 'N/A'}</p>
          <p>City: {userData.city || 'N/A'}</p>
          <p>Street: {userData.street || 'N/A'}</p>
          <p>Floor: {userData.floor || 'N/A'}</p>
          <p>Apartment: {userData.apartment || 'N/A'}</p>
          <p>Zip Code: {userData.zip_code || 'N/A'}</p>
          <p>Additional Information: {userData.additional_information || 'N/A'}</p>
          {userData.profile_image && (
            <div>
              <h4>Profile Image:</h4>
              <img
                    src={userData.profile_image || 'path/to/default/image.jpg'}
                    alt="Profile"
                    style={{ width: '100px', height: '100px' }}
                />
            </div>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Home;
