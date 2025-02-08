import React, { useState } from 'react';
import AuthForm from './AuthForm';
import AuthTab from './AuthTab';    
import AuthChoice from './AuthChoice'; 

const Modal = ({ showModal, closeModal }) => {
  const [isSignUp, setIsSignUp] = useState(false); 

  const handleTabChange = (isSignUp) => {
    setIsSignUp(isSignUp);  
  };

  return (
    <div
      className={`modal fade ${showModal ? 'show' : ''}`}  
      id="signin-modal"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      style={{ display: showModal ? 'block' : 'none' }}  
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <button
              type="button"
              className="close"
              onClick={closeModal}  
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div className="form-box">
              <div className="form-tab">
                <AuthTab isSignUp={isSignUp} onTabChange={handleTabChange} />
                
                <AuthForm isSignUp={isSignUp} />
                
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
