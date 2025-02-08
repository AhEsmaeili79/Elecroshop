import { useUserData } from '../../../hooks/useUserData'; 
import ProfileImageUpload from './ProfileImageUpload'; 
import InputField from './InputField'; 
import SubmitButton from './SubmitButton'; 
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import './css/accountform.css';

const AccountForm = () => {
    const {
        formData,
        profileImage,
        loading,
        error,
        handleChange,
        handleImageChange,
        handleSubmit
    } = useUserData(); 

    const phoneRegex = /^09\d{9}$/;

    const toPersianNumbers = (num) => {
        return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
    };

    const handleValidatedChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phonenumber' && !phoneRegex.test(value)) {
            toast.error('شماره تلفن باید با 09 شروع و 11 رقم باشد');
            return; 
        }

        handleChange(e);
    };

    return (
        <div className="tab-pane fade" id="tab-account" role="tabpanel" aria-labelledby="tab-account-link">
            {loading && <p>در حال بارگذاری...</p>}
            <form onSubmit={handleSubmit}>
                <ProfileImageUpload profileImage={profileImage} handleImageChange={handleImageChange} />

                <div className="row">
                    <div className="col-sm-6">
                        <InputField label="نام *" type="text" name="firstName" value={formData.firstName} onChange={handleValidatedChange} required />
                    </div>
                    <div className="col-sm-6">
                        <InputField label="نام خانوادگی *" type="text" name="lastName" value={formData.lastName} onChange={handleValidatedChange} required />
                    </div>
                </div>

                <InputField label="آدرس ایمیل *" type="email" name="email" value={toPersianNumbers(formData.email)} onChange={handleValidatedChange} required readOnly autoComplete="email" />

                <div className="row">
                    <div className="col-sm-6">
                        <InputField label="نام نمایشی" type="text" name="displayName" value={formData.username} readOnly required />
                    </div>
                    <div className="col-sm-6">
                        <InputField 
                            label="شماره تلفن" 
                            type="text" 
                            name="phonenumber" 
                            value={toPersianNumbers(formData.phonenumber)} 
                            onChange={handleValidatedChange} 
                            autoComplete="tel" 
                            placeholder="09xxxxxxxxx" 
                        />
                    </div>
                </div>
                <small className="form-text">این نامی است که در بخش حساب کاربری و در بررسی‌ها نمایش داده خواهد شد</small>

                <InputField label="تاریخ تولد" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleValidatedChange} autoComplete="bday" />

                <label>اطلاعات اضافی</label>
                <textarea
                    className="form-control"
                    name="additionalInformation"
                    value={formData.additionalInformation}
                    onChange={handleValidatedChange}
                    autoComplete="off"
                />

                <SubmitButton loading={loading} />
            </form>
        </div>
    );
};

export default AccountForm;
