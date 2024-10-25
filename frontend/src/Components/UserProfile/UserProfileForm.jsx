// src/components/UserProfile/UserProfileForm.jsx
import React from 'react';

const UserProfileForm = ({ userData, formData, setFormData, handleSubmit, setImagePreview }) => {
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, profile_image: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }
    handleSubmit(updatedData);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Username:
        <input type="text" name="username" value={userData.username} readOnly />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={userData.email} readOnly />
      </label>
      <label>
        Role:
        <input type="text" name="role" value={userData.role} readOnly />
      </label>
      <label>
        First Name:
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Phone Number:
        <input
          type="text"
          name="phonenumber"
          value={formData.phonenumber}
          onChange={handleChange}
        />
      </label>
      <label>
        Date of Birth:
        <input
          type="date"
          name="date_birth"
          value={formData.date_birth}
          onChange={handleChange}
        />
      </label>
      <label>
        Address:
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
      </label>
      <label>
        Street:
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
        />
      </label>
      <label>
        Floor:
        <input
          type="number"
          name="floor"
          value={formData.floor}
          onChange={handleChange}
        />
      </label>
      <label>
        Apartment:
        <input
          type="number"
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
        />
      </label>
      <label>
        Zip Code:
        <input
          type="number"
          name="zip_code"
          value={formData.zip_code}
          onChange={handleChange}
        />
      </label>
      <label>
        Additional Information:
        <textarea
          name="additional_information"
          value={formData.additional_information}
          onChange={handleChange}
        />
      </label>
      <label>
        Profile Image:
        <input
          type="file"
          name="profile_image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UserProfileForm;
