import { FaCamera } from 'react-icons/fa'; // Importing a camera icon from react-icons

const ProfileImageUpload = ({ profileImage, handleImageChange }) => {
    return (
        <div className="image-upload-container">
            <label htmlFor="profileImageInput" className="image-upload-label">
                <img
                    src={
                        profileImage && profileImage instanceof File
                            ? URL.createObjectURL(profileImage) // When it's a file, create an object URL
                            : profileImage || 'https://via.placeholder.com/150'
                    } // Else show the URL or placeholder
                    alt="Profile"
                    className="profile-image"
                />
                <div className="edit-icon">
                    <FaCamera />
                </div>
            </label>
            <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ProfileImageUpload;
