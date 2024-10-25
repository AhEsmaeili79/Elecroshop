// src/components/UserProfile/UserProfileImage.jsx
import React from 'react';

const UserProfileImage = ({ imagePreview }) => {
  return (
    <div>
      <h3>User Information:</h3>
      <img
        src={imagePreview || 'path/to/default/image.jpg'}
        alt="Profile"
        style={{ width: '100px', height: '100px', borderRadius: '10%' }}
      />
    </div>
  );
};

export default UserProfileImage;
