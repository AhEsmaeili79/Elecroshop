// src/components/AdminLoginPage.js
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from '../css/AdminLogin.module.css';
import { login } from '../../../api/adminDashboard.js'; 

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [passwordVisible, setPasswordVisible] = useState(false); 

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true); 
    setErrorMessage(''); // Reset error message before API call

    try {
      const data = await login(username, password);
      console.log('Login Successful', data);
      // You can now store the tokens in localStorage or context, depending on your app's needs.
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      // Redirect or update state to show that the user is logged in
      window.location.href = '/admin/dashboard'; // Example: Redirect to admin dashboard
    } catch (error) {
      setErrorMessage(error.message); // Display the error message from the API
    }

    setIsLoading(false); 
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <div className={`container-fluid d-flex justify-content-center align-items-center vh-100 ${styles.containerWrapper}`}>
        <div className={`card shadow-lg rounded ${styles.cardWrapper}`}>
          <h3 className={`card-title text-center mb-1 text-primary ${styles.cardTitle}`}>ورود به مدیریت</h3>
          {errorMessage && (
            <div className={`alert alert-danger mb-1 ${styles.errorMessage}`} role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-1">
              <label htmlFor="username" className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                نام کاربری
              </label>
              <input
                type="text"
                className={`form-control ${styles.inputField}`}
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="نام کاربری خود را وارد کنید"
              />
            </div>

            <div className={`mb-1 position-relative ${styles.passwordWrapper}`}>
              <label htmlFor="password" className="form-label" style={{ fontWeight: '600', color: '#333' }}>
                رمز عبور
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                className={`form-control ${styles.inputField}`}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="رمز عبور خود را وارد کنید"
              />
              <button
                type="button"
                className={`position-absolute start-0 translate-middle-y btn btn-link ${styles.passwordToggleBtn}`}
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-100 ${styles.submitButton}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                'ورود'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
