import { FaCamera } from 'react-icons/fa'; 
import ImagePlaceholder from '../../../assets/images/landscape-placeholder.svg';

const ProfileImageUpload = ({ profileImage, handleImageChange }) => {
    return (
        <div className="image-upload-container">
            <label htmlFor="profileImageInput" className="image-upload-label">
                <img
                    src={
                        profileImage && profileImage instanceof File
                            ? URL.createObjectURL(profileImage) 
                            : profileImage || ImagePlaceholder
                    } 
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
