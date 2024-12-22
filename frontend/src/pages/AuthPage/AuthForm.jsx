// src/auth/AuthForm.jsx
import { useState } from 'react';
import { loginUser, signupUser } from '../../api/auth'; // Import the API functions

const AuthForm = ({ isSignUp }) => {
  const [username, setUsername] = useState('');  // State to store username input
  const [email, setEmail] = useState('');        // State to store email input (for sign-up only)
  const [password, setPassword] = useState('');  // State to store password input
  const [error, setError] = useState('');        // State to handle error messages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
      if (isSignUp) {
        // Call the signupUser API function if sign-up is selected
        try {
          await signupUser(username, email, password);
          window.location.href = '/';
          alert('ثبت نام با موفقیت انجام شد!');
          isSignUp = false;
        }
        catch (error) {
          setError('ثبت نام ناموفق بود. لطفاً دوباره تلاش کنید.');
          console.error('Signup failed:', error);
        }
      } 
      else {
        // Call the loginUser API function if sign-in is selected
        try { await loginUser(username, password);
          window.location.href = '/';
        }
        catch (error) {
          setError('ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.');
          console.error('Login failed:', error);
        } 
      }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Username input field (for both sign-in and sign-up) */}
      <div className="form-group">
        <label htmlFor="username">{isSignUp ? 'نام کاربری *' : 'نام کاربری (یا ایمیل) *'}</label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
          required
        />
      </div>

      {/* Email input field (only for sign-up) */}
      {isSignUp && (
        <div className="form-group">
          <label htmlFor="email">آدرس ایمیل شما *</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
          />
        </div>
      )}

      {/* Password input field */}
      <div className="form-group">
        <label htmlFor="password">کلمه عبور *</label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          required
        />
      </div>

      {/* Confirm Password (only for sign-up) */}
      {isSignUp && (
        <div className="form-group">
          <label htmlFor="confirm-password">تأیید کلمه عبور *</label>
          <input
            type="password"
            className="form-control"
            id="confirm-password"
            name="confirm-password"
            required
          />
        </div>
      )}

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-footer">
        <button type="submit" className="btn btn-outline-primary-2">
          <span>{isSignUp ? 'ثبت نام' : 'ورود'}</span>
          <i className="icon-long-arrow-right"></i>
        </button>

        {/* Privacy Policy for Sign-Up */}
        {isSignUp && (
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="register-policy"
              required
            />
            <label className="custom-control-label" htmlFor="register-policy">
              من با <a href="#">سیاست حفظ حریم خصوصی</a> موافقم *
            </label>
          </div>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
