import { useState } from 'react';
import { loginUser, signupUser } from '../../api/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AuthForm = ({ isSignUp }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signupUser(username, email,  toLatinNumbers(password));
        window.location.href = '/';
        alert('ثبت نام با موفقیت انجام شد!');
      } else {
        await loginUser(username, toLatinNumbers(password));
        window.location.href = '/';
      }
    } catch (error) {
      setError(
        isSignUp
          ? 'ثبت نام ناموفق بود. لطفاً دوباره تلاش کنید.'
          : 'ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.'
      );
      console.error(isSignUp ? 'Signup failed:' : 'Login failed:', error);
    }
  };

  const toPersianNumbers = (num) => {
    return num.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  };
  
  const toLatinNumbers = (num) => {
    return num.replace(/[۰-۹]/g, (d) => '0123456789'['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">{isSignUp ? 'نام کاربری *' : 'نام کاربری *'}</label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {isSignUp && (
        <div className="form-group">
          <label htmlFor="email">آدرس ایمیل شما *</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      )}

      <div className="form-group position-relative">
        <label htmlFor="password">کلمه عبور *</label>
        <div className="position-relative">
          <span
            className="position-absolute left-0 pl-2 cursor-pointer"
            style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 10, marginLeft: '10px', left: '0', cursor: 'pointer' }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          <input
            type="text"
            className="form-control pl-4"
            id="password"
            name="password"
            value={showPassword ? toPersianNumbers(password) : '•'.repeat(password.length)}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
      </div>

      {isSignUp && (
        <div className="form-group">
          <label htmlFor="confirm-password">تأیید کلمه عبور *</label>
          <input type="password" className="form-control" id="confirm-password" name="confirm-password" required />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-footer">
        <button type="submit" className="btn btn-outline-primary-2">
          <span>{isSignUp ? 'ثبت نام' : 'ورود'}</span>
          <i className="icon-long-arrow-right"></i>
        </button>
        {isSignUp && (
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id="register-policy" required />
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
