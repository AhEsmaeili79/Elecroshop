// src/components/Home/UserProfileImage.jsx
import React from 'react';
const UserProfileImage = ({ profileImage }) => (
  <img
    src={profileImage || 'path/to/default/image.jpg'} // Fallback to a default image
    alt="Profile"
    style={{
      width: '100px',
      height: '100px',
      borderRadius: '10%', // Circle image style
      objectFit: 'cover', // Ensure the image covers the area without distortion
    }}
  />
);

export default UserProfileImage;
