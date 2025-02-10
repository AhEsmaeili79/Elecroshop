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
    const [lastSubmitTime, setLastSubmitTime] = useState(null); 
    const [messageShown, setMessageShown] = useState(false); 

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
        if (name === 'phonenumber' && value.length > 11) {
            return;  
        }
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

        const currentTime = Date.now();
        if (lastSubmitTime && currentTime - lastSubmitTime < 2000) {
            if (!messageShown) {
                toast.error('لطفاً تا 2 ثانیه دیگر دوباره امتحان کنید.');
                setMessageShown(true); 
            }
            return;
        }

        setLoading(true);
        setError(null);

        const phoneRegex = /^09\d{9}$/;
        if (formData.phonenumber.length !== 11) {
            if (!messageShown) {
                setError("شماره تلفن باید 11 رقم باشد.");
                toast.error("شماره تلفن باید 11 رقم باشد.");
                setMessageShown(true);
            }
            setLoading(false);
            return; 
        } else if (!phoneRegex.test(formData.phonenumber)) {
            if (!messageShown) {
                setError("شماره تلفن باید با 09 شروع شود.");
                toast.error("شماره تلفن باید با 09 شروع شود.");
                setMessageShown(true);
            }
            setLoading(false);
            return;
        }

        const nameRegex = /^[a-zA-Zا-ی\s]+$/; 
        if (!formData.firstName || !nameRegex.test(formData.firstName)) {
            if (!messageShown) {
                setError("نام باید فقط شامل حروف باشد.");
                toast.error("نام باید فقط شامل حروف باشد.");
                setMessageShown(true);
            }
            setLoading(false);
            return;
        }

        if (!formData.lastName || !nameRegex.test(formData.lastName)) {
            if (!messageShown) {
                setError("نام خانوادگی باید فقط شامل حروف باشد.");
                toast.error("نام خانوادگی باید فقط شامل حروف باشد.");
                setMessageShown(true);
            }
            setLoading(false);
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(formData.email)) {
            if (!messageShown) {
                setError("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
                toast.error("لطفاً یک آدرس ایمیل معتبر وارد کنید.");
                setMessageShown(true);
            }
            setLoading(false);
            return;
        }

        if (formData.additionalInformation.length > 500) {
            if (!messageShown) {
                setError("اطلاعات اضافی نباید بیشتر از 500 کاراکتر باشد.");
                toast.error("اطلاعات اضافی نباید بیشتر از 500 کاراکتر باشد.");
                setMessageShown(true);
            }
            setLoading(false);
            return;
        }
        
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
            if (!messageShown) {
                toast.success('پروفایل با موفقیت بروزرسانی شد.');
                setMessageShown(true);
            }
            setLastSubmitTime(currentTime); 
        } catch (err) {
            if (!messageShown) {
                setError('Failed to update profile.');
                toast.error('خطا در بروزرسانی پروفایل.');
                setMessageShown(true);
            }
        } finally {
            setLoading(false);
            
            setTimeout(() => {
                setMessageShown(false);
            }, 3000);
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
