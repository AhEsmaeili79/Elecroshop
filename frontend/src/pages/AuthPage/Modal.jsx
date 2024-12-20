// src/auth/Modal.jsx
import React, { useState } from 'react';
import AuthForm from './AuthForm';  // Importing the AuthForm component
import AuthTab from './AuthTab';    // Importing the AuthTab component
import AuthChoice from './AuthChoice'; // Importing AuthChoice for social login options

const Modal = ({ showModal, closeModal }) => {
  const [isSignUp, setIsSignUp] = useState(false);  // State to toggle between sign in and sign up

  // Handle tab change (Sign In or Sign Up)
  const handleTabChange = (isSignUp) => {
    setIsSignUp(isSignUp);  // Set the state to either Sign Up or Sign In
  };

  return (
    <div
      className={`modal fade ${showModal ? 'show' : ''}`}  // Add 'show' class if modal is visible
      id="signin-modal"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      style={{ display: showModal ? 'block' : 'none' }}  // Inline style for visibility
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <button
              type="button"
              className="close"
              onClick={closeModal}  // Close modal when clicked
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div className="form-box">
              <div className="form-tab">
                {/* AuthTab: Handles the tabs for Sign In and Sign Up */}
                <AuthTab isSignUp={isSignUp} onTabChange={handleTabChange} />
                
                {/* AuthForm: Form that handles the actual login/signup process */}
                <AuthForm isSignUp={isSignUp} />
                
                {/* AuthChoice: Handles the social login options (Google, Facebook) */}
                <AuthChoice isSignUp={isSignUp} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
