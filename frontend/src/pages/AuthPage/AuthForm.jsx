import { useState } from 'react';
import { loginUser, signupUser } from '../../api/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = ({ isSignUp, onSuccessfulSignup  }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);


    if (isSignUp && password !== confirmPassword) {
      setIsLoading(false);
      setError('کلمه عبور و تأیید کلمه عبور با هم مطابقت ندارند.');
      return;
    }

    try {
      if (isSignUp) {
        await signupUser(username, email, toLatinNumbers(password));
        toast.success('ثبت نام با موفقیت انجام شد!');
        setTimeout(() => {
          onSuccessfulSignup();
          setIsLoading(false); 
        }, 2000);
      } else {
        await loginUser(username, toLatinNumbers(password));
        toast.success(`${username} عزیز خوش آمدید! `);
        setTimeout(() => {
          window.location.href = '/';
        }, 1500)
      }
    } catch (error) {
      setIsLoading(false);

      if (isSignUp) {
        if (error.response?.status === 400) {
          setError('نام کاربری یا ایمیل وارد شده قبلاً ثبت شده است.');
        } else if (error.response?.status === 401) {
          setError('نام کاربری یا ایمیل وارد شده قبلاً ثبت شده است.');
        } else if (error.response?.status === 500) {
          setError('خطای سرور! لطفاً دوباره تلاش کنید.');
        } else {
          setError('ثبت نام ناموفق بود. لطفاً دوباره تلاش کنید.');
        }
      } else {
        if (error.response?.status === 400) {
          setError('لطفاً تمام فیلدها را پر کنید.');
        } else if (error.response?.status === 401) {
          setError('نام کاربری یا رمز عبور اشتباه است.');
        } else if (error.response?.status === 500) {
          setError('خطای سرور! لطفاً دوباره تلاش کنید.');
        } else {
          setError('ورود ناموفق بود. لطفاً اطلاعات خود را بررسی کنید.');
        }
      }

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
    <form onSubmit={handleSubmit} className="p-4 shadow-sm rounded-lg">
      <div className="form-group mb-4">
        <label htmlFor="username" className="font-weight-bold">{isSignUp ? 'نام کاربری *' : 'نام کاربری *'}</label>
        <input
          type="text"
          className="form-control rounded-lg p-3 border-0 shadow-sm"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {isSignUp && (
        <div className="form-group mb-4">
          <label htmlFor="email" className="font-weight-bold">آدرس ایمیل شما *</label>
          <input
            type="email"
            className="form-control rounded-lg p-3 border-0 shadow-sm"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      )}

      <div className="form-group position-relative mb-4">
        <label htmlFor="password" className="font-weight-bold">کلمه عبور *</label>
        <div className="position-relative">
          <span
            className="position-absolute left-0 pl-2 cursor-pointer"
            style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 10, marginLeft: '10px', left: '0', cursor: 'pointer' }}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control pl-4 rounded-lg p-3 border-0 shadow-sm"
            id="password"
            name="password"
            value={password ? toPersianNumbers(password) : '•'.repeat(password.length)}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      {isSignUp && (
        <div className="form-group position-relative mb-4">
          <label htmlFor="confirm-password" className="font-weight-bold">تأیید کلمه عبور *</label>
          <div className="position-relative">
            <span
              className="position-absolute left-0 pl-2 cursor-pointer"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                marginLeft: '10px',
                left: '0',
                cursor: 'pointer',
              }}
              onClick={() => setShowRepeatPassword((prev) => !prev)}
            >
              {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <input
              type={showRepeatPassword ? 'text' : 'password'}
              className="form-control pl-4 rounded-lg p-3 border-0 shadow-sm"
              id="confirm-password"
              name="confirm-password"
              value={toPersianNumbers(confirmPassword)}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
      )}

        {error && (
          <div 
            className="alert alert-danger text-center mb-3 rounded-lg" 
            role="alert" 
            style={{ 
              maxWidth: '80%', 
              marginLeft: 'auto', 
              marginRight: 'auto', 
              display: 'block' 
            }}
          >
            <strong>خطا:</strong> {error}
          </div>
        )}

      <div className="form-footer d-flex justify-content-between align-items-center">
        <button type="submit" className={`btn btn-lg btn-${isSignUp ? 'primary' : 'success'} w-100`} disabled={isLoading}>
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <span>{isSignUp ? 'ثبت نام' : 'ورود'}</span>
          )}
          <i className="icon-long-arrow-right"></i>
        </button>
        {isSignUp && (
          <div className="custom-control custom-checkbox mt-3">
            <input type="checkbox" className="custom-control-input rounded-lg" id="register-policy" required />
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