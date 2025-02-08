import { useState, useEffect } from 'react';
import { fetchUserData, updateUser } from '../api/user';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const useUserData = () => {
    const [formData, setFormData] = useState({
        username: '',
        role: '',
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        phonenumber: '',
        dateOfBirth: '',
        additionalInformation: ''
    });

    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageUpdated, setImageUpdated] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            setLoading(true);
            try {
                const data = await fetchUserData();
                setFormData({
                    username: data.username || '',
                    role: data.role || '',
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    displayName: data.username || '',
                    email: data.email || '',
                    phonenumber: data.phonenumber || '',
                    dateOfBirth: data.date_birth || '',
                    additionalInformation: data.additional_information || ''
                });
                setProfileImage(data.profile_image || null); 
            } catch (err) {
                setError('Failed to load user data.');
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file); 
        }
        setImageUpdated(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const updatedData = new FormData();
        updatedData.append('first_name', formData.firstName);
        updatedData.append('last_name', formData.lastName);
        updatedData.append('phonenumber', formData.phonenumber);
        updatedData.append('date_birth', formData.dateOfBirth);
        updatedData.append('additional_information', formData.additionalInformation);

        if (imageUpdated) {
            updatedData.append('profile_image', profileImage);
        }

        try {
            await updateUser(updatedData); 
            toast.success('پروفایل با موفقیت بروزرسانی شد.');
        } catch (err) {
            setError('Failed to update profile.');
            toast.error('خطا در بروزرسانی پروفایل.');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        profileImage,
        loading,
        error,
        handleChange,
        handleImageChange,
        handleSubmit,
    };
};
