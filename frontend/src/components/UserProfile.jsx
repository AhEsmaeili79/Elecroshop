import React, { useState, useEffect } from 'react';
import { getUserInfo, updateUserInfo } from '../api/auth';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        phonenumber: '',
        date_birth: '',
        address: '',
        city: '',
        street: '',
        floor: '',
        apartment: '',
        zip_code: '',
        additional_information: '',
        profile_image: null // Initialize as null
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [newProfileImage, setNewProfileImage] = useState(null); // State for the new image

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserInfo(token);
                setUserInfo(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserData();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewProfileImage(URL.createObjectURL(file)); // Create a local URL for preview
        setUserInfo({ ...userInfo, profile_image: file }); // Update the state with the file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Append all the form fields to formData
        for (const key in userInfo) {
            formData.append(key, userInfo[key]);
        }
        
        try {
            await updateUserInfo(token, formData);
            setMessage('Profile updated successfully!');
            // Refetch user data to get the latest image URL
            const response = await getUserInfo(token);
            setUserInfo(response.data);
            setNewProfileImage(null); // Reset the new image preview
        } catch (error) {
            console.error(error);
            setMessage('Error updating profile');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Update Profile</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    name="phonenumber"
                    value={userInfo.phonenumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                />
                <input
                    type="date"
                    name="date_birth"
                    value={userInfo.date_birth}
                    onChange={handleChange}
                    placeholder="Date of Birth"
                />
                <input
                    type="text"
                    name="address"
                    value={userInfo.address}
                    onChange={handleChange}
                    placeholder="Address"
                />
                <input
                    type="text"
                    name="city"
                    value={userInfo.city}
                    onChange={handleChange}
                    placeholder="City"
                />
                <input
                    type="text"
                    name="street"
                    value={userInfo.street}
                    onChange={handleChange}
                    placeholder="Street"
                />
                <input
                    type="text"
                    name="floor"
                    value={userInfo.floor}
                    onChange={handleChange}
                    placeholder="Floor"
                />
                <input
                    type="text"
                    name="apartment"
                    value={userInfo.apartment}
                    onChange={handleChange}
                    placeholder="Apartment"
                />
                <input
                    type="text"
                    name="zip_code"
                    value={userInfo.zip_code}
                    onChange={handleChange}
                    placeholder="Zip Code"
                />
                <textarea
                    name="additional_information"
                    value={userInfo.additional_information}
                    onChange={handleChange}
                    placeholder="Additional Information"
                />
                <input
                    type="file"
                    name="profile_image"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                
                {/* Show current profile image if exists */}
                {userInfo.profile_image && !newProfileImage && (
                    <div>
                        <h3>Current Profile Image:</h3>
                        <img 
                            src={userInfo.profile_image} 
                            alt="Profile" 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                        />
                    </div>
                )}

                {/* Show new profile image preview if selected */}
                {newProfileImage && (
                    <div>
                        <h3>New Profile Image Preview:</h3>
                        <img 
                            src={newProfileImage} 
                            alt="New Profile Preview" 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                        />
                    </div>
                )}

                <button type="submit">Update Profile</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UserProfile;
