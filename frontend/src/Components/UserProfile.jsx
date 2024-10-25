import React, { useEffect, useState } from 'react';
import { fetchUserData, updateUser } from '../api'; // Import the necessary API functions

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
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  // Fetch user data
  const getUserData = async () => {
    try {
      const data = await fetchUserData();
      setUserData(data);
      setFormData((prevData) => ({
        ...prevData,
        ...data,
      }));
      // Set the initial image preview
      setImagePreview(data.profile_image); // Assuming profile_image is a URL string
    } catch (error) {
      setError('Failed to fetch user data.');
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_image: file });
    
    // Create a local URL for the uploaded image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Set the image preview
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    
    // Append all data including the image
    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }

    try {
      await updateUser(updatedData);
      alert('User information updated successfully!');
      getUserData(); // Fetch updated user data
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
          <h3>User Information:</h3>
          {/* Display the profile image */}
          <img
            src={imagePreview ? imagePreview : 'path/to/default/image.jpg'}
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '10%' }} // Circle image style
          />
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={userData.username}
                readOnly // Make this field read-only
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={userData.email}
                readOnly // Make this field read-only
              />
            </label>
            <label>
              Role:
              <input
                type="text"
                name="role"
                value={userData.role}
                readOnly // Make this field read-only
              />
            </label>
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required // Optional: make it required if necessary
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required // Optional: make it required if necessary
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
        </div>
      )}
    </div>
  );
};

export default UserProfile;