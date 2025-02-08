import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from '../css/AdminLogin.module.css';
import { login } from '../../../api/admin/auth';
import { fetchUserData } from '../../../api/admin/adminDashboard';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const navigate = useNavigate();  

  useEffect(() => {
    const checkUserRole = async () => {
      const userData = await fetchUserData();
      if (userData) {
        if (userData.role === 'admin' || userData.role === 'seller') {
          navigate('/admin');
        }
      }
    };
    checkUserRole();
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true); 
    setErrorMessage(''); 

    try {
      const data = await login(username,  toLatinNumbers(password));
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      navigate('/admin');
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false); 
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toPersianNumbers = (num) => {
    return num.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  };
  
  const toLatinNumbers = (num) => {
    return num.replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
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
                value={password ? toPersianNumbers(password) : '•'.repeat(password.length)}
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
