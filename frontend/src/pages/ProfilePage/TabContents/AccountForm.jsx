import { useUserData } from '../../../hooks/useUserData'; // Import the custom hook
import ProfileImageUpload from './ProfileImageUpload'; // Import the image upload component
import InputField from './InputField'; // Import the input field component
import SubmitButton from './SubmitButton'; // Import the submit button component

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
    } = useUserData(); // Use the custom hook

    return (
        <div className="tab-pane fade" id="tab-account" role="tabpanel" aria-labelledby="tab-account-link">
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <ProfileImageUpload profileImage={profileImage} handleImageChange={handleImageChange} />

                <div className="row">
                    <div className="col-sm-6">
                        <InputField label="First Name *" type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="col-sm-6">
                        <InputField label="Last Name *" type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <InputField label="Display Name" type="text" name="displayName" value={formData.username} readOnly required />
                    </div>
                    <div className="col-sm-6">
                        <InputField label="Role" type="text" name="role" value={formData.role} readOnly required />
                    </div>
                </div>
                <small className="form-text">This will be how your name will be displayed in the account section and in reviews</small>

                <InputField label="Email address *" type="email" name="email" value={formData.email} required readOnly autoComplete="email" />
                <InputField label="Phone Number" type="text" name="phonenumber" value={formData.phonenumber} onChange={handleChange} autoComplete="tel" />
                <InputField label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} autoComplete="bday" />

                <label>Additional Information</label>
                <textarea
                    className="form-control"
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
