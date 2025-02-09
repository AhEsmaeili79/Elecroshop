import { useUserData } from '../../../hooks/useUserData'; 
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileImageUpload from './ProfileImageUpload'; 
import InputField from './InputField'; 
import SubmitButton from './SubmitButton'; 
import './css/accountform.css';

const AccountForm = () => {
    const {
        formData,
        profileImage,
        loading,
        handleChange,
        handleImageChange,
        handleSubmit
    } = useUserData(); 

    return (
        <div className="tab-pane fade" id="tab-account" role="tabpanel" aria-labelledby="tab-account-link">
            {loading && <p>در حال بارگذاری...</p>}
            <form onSubmit={handleSubmit}>
                <ProfileImageUpload profileImage={profileImage} handleImageChange={handleImageChange} />

                <div className="row">
                    <div className="col-sm-6">
                        <InputField label="نام *" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="col-sm-6">
                        <InputField label="نام خانوادگی *" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                </div>

                <InputField label="آدرس ایمیل *" type="email" name="email" value={formData.email} required readOnly autoComplete="email" />

                <div className="row">
                    <div className="col-sm-6">
                        <InputField label="نام نمایشی" type="text" name="displayName" value={formData.username} readOnly required />
                    </div>
                    <div className="col-sm-6">
                    <InputField
                        label="شماره تلفن"
                        type="text"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleChange}
                        onInput={handleChange}
                        autoComplete="tel"
                        maxLength={11} 
                        pattern="\d{11}" 
                        placeholder="09xxxxxxxxxxx"
                    />

                    </div>
                </div>
                <small className="form-text">این نامی است که در بخش حساب کاربری و در بررسی‌ها نمایش داده خواهد شد</small>

                <InputField label="تاریخ تولد" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} autoComplete="bday" />

                <label>اطلاعات اضافی</label>
                <textarea
                    className="form-control rounded-lg"
                    name="additionalInformation"
                    value={formData.additionalInformation}
                    onChange={handleChange}
                    autoComplete="off"
                />

                <SubmitButton loading={loading} />
            </form>
        </div>
    );
};

export default AccountForm;
