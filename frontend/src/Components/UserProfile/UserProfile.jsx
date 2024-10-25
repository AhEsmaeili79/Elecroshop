// src/components/UserProfile/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { fetchUserData, updateUser } from '../api/user'; // Import the necessary API functions
import UserProfileForm from './UserProfileForm';
import UserProfileImage from './UserProfileImage';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phonenumber: '',
    date_birth: '',
    address: '',
    city: '',
    street: '',
    floor: '',
    apartment: '',
    zip_code: '',
    additional_information: '',
    profile_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user data
  const getUserData = async () => {
    try {
      const data = await fetchUserData();
      setUserData(data);
      setFormData({ ...formData, ...data });
      setImagePreview(data.profile_image);
    } catch (error) {
      setError('Failed to fetch user data.');
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Handle form submission
  const handleSubmit = async (updatedData) => {
    try {
      await updateUser(updatedData);
      alert('User information updated successfully!');
      getUserData(); // Refresh the user data
    } catch (error) {
      setError('Failed to update user data.');
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      {error && <p>{error}</p>}
      {userData && (
        <div>
          <UserProfileImage imagePreview={imagePreview} />
          <UserProfileForm 
            userData={userData} 
            formData={formData} 
            setFormData={setFormData} 
            handleSubmit={handleSubmit} 
            setImagePreview={setImagePreview} 
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
