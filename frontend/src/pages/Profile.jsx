import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Profile = () => {  // Get the current logged-in user from context
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phonenumber: '',
        date_birth: '',
        address: '',
        city: '',
        street: '',
        floor: '',
        apartment: '',
        zip_code: '',
        profile_image: null,
        additional_information: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newProfileImage, setNewProfileImage] = useState(null); // State for the new image


    useEffect(() => {
        // Fetch user profile data from the server
        axios.get('http://localhost:8000/api/profile/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`
            }
        })
        .then(response => {
            setProfile(response.data);
        })
        .catch(error => {
            setError('Error fetching profile information');
        });
    }, []);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // Create a URL for the new image to display it
        const imageUrl = URL.createObjectURL(file);

        setProfile({
            ...profile,
            profile_image: file,
            preview_image: imageUrl  // Add this to store the preview URL
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in profile) {
            formData.append(key, profile[key]);
        }

        axios.put('http://localhost:8000/api/profile/', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access')}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            setSuccess('Profile updated successfully!');
            setError('');
        })
        .catch(error => {
            setError('Error updating profile');
        });
    };

    return (
        <div>
            <h2>Update Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username (cannot be changed)</label>
                    <input type="text" name="username" value={profile.username} disabled />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input type="text" name="phonenumber" value={profile.phonenumber} onChange={handleChange} />
                </div>
                <div>
                    <label>Date of Birth</label>
                    <input type="date" name="date_birth" value={profile.date_birth} onChange={handleChange} />
                </div>
                <div>
                    <label>Address</label>
                    <textarea name="address" value={profile.address} onChange={handleChange}></textarea>
                </div>
                <div>
                    <label>City</label>
                    <input type="text" name="city" value={profile.city} onChange={handleChange} />
                </div>
                <div>
                    <label>Street</label>
                    <input type="text" name="street" value={profile.street} onChange={handleChange} />
                </div>
                <div>
                    <label>Floor</label>
                    <input type="number" name="floor" value={profile.floor} onChange={handleChange} />
                </div>
                <div>
                    <label>Apartment</label>
                    <input type="number" name="apartment" value={profile.apartment} onChange={handleChange} />
                </div>
                <div>
                    <label>Zip Code</label>
                    <input type="number" name="zip_code" value={profile.zip_code} onChange={handleChange} />
                </div>
                <div>
                    <label>Additional Information</label>
                    <textarea name="additional_information" value={profile.additional_information} onChange={handleChange}></textarea>
                </div>
                <div>
                    <label>Profile Image</label>
                    {profile.preview_image ? (
                        <div>
                            <img 
                                src={profile.preview_image}  // Use the preview image URL
                                alt="Profile Preview"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                            />
                            <p>New Image</p>
                        </div>
                    ) : profile.profile_image && (
                        <div>
                            <img 
                                src={`http://localhost:8000${profile.profile_image}`} 
                                alt="Profile"
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                            />
                            <p>Current Image</p>
                        </div>
                    )}
                    <input type="file" name="profile_image" onChange={handleImageChange} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
