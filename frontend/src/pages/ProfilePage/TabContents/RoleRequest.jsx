import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoleRequest, fetchUserRoleRequestStatus, deleteRoleRequest } from '../../../api/roleRequest';
import styles from "./css/rolerequest.module.css";
import { toast, ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
import moment from "moment-jalaali";

const UserRoleRequest = ({ user }) => {
  const [requestStatus, setRequestStatus] = useState(null);
  const [canRequestAgain, setCanRequestAgain] = useState(true); 
  const [requestId, setRequestId] = useState(null);
  const [requestTime, setRequestTime] = useState(null);
  const [requestDeniedTime, setRequestDeniedTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const navigate = useNavigate();
  const convertToPersianDate = (date) => moment(date).format("jYYYY/jMM/jDD HH:mm:ss");

  useEffect(() => {
    const getRequestStatus = async () => {
      try {
        const data = await fetchUserRoleRequestStatus();
        setRequestStatus(data.status);
        setRequestId(data.request_id);
        setRequestTime(data.request_time);
        setRequestDeniedTime(data.denied_time);

        const lastActionTime = localStorage.getItem('lastActionTime');
        if (lastActionTime) {
          const currentTime = new Date().getTime();
          const elapsedTime = currentTime - parseInt(lastActionTime);
          const timeLeft = 20 * 60 * 1000 - elapsedTime; 

          if (timeLeft > 0) {
            setCanRequestAgain(false); 
            setTimeRemaining(timeLeft); 
          } else {
            setCanRequestAgain(true); 
            localStorage.removeItem('lastActionTime'); 
          }
        } else {
          setCanRequestAgain(true); 
        }
      } catch (error) {
        console.error('Error fetching role request status:', error);
        toast.error('خطا در دریافت وضعیت درخواست نقش');
      }
    };

    getRequestStatus();
  }, []);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1000);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer); 
  }, [timeRemaining]);

  const handleRequestRoleChange = async () => {
    if (!canRequestAgain) {
      toast.error('شما باید 20 دقیقه صبر کنید تا درخواست دیگری ارسال کنید.');
      return;
    }

    try {
      const data = await createRoleRequest();
      setRequestStatus('pending');
      setRequestId(data.request_id);
      setRequestTime(data.request_time);
      setCanRequestAgain(false);
      setTimeRemaining(20 * 60 * 1000); 
      localStorage.setItem('lastActionTime', new Date().getTime().toString());
      toast.success('درخواست شما ارسال شده و در حال بررسی است.');
      navigate('/role-request')
      window.location.reload();
    } catch (error) {
      toast.error('ارسال درخواست با خطا مواجه شد.');
      console.error(error);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await deleteRoleRequest(requestId);
      setRequestStatus(null);
      setRequestId(null);
      setRequestTime(null);
      setCanRequestAgain(false);
      setTimeRemaining(20 * 60 * 1000); 
      localStorage.setItem('lastActionTime', new Date().getTime().toString()); 
      toast.success('درخواست شما لغو شد.');
    } catch (error) {
      toast.error('لغو درخواست با خطا مواجه شد.');
      console.error(error);
    }
  };

  const toPersianNumbers = (num) => {
    return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>مدیریت درخواست نقش</h2>

      {requestStatus === 'approved' ? (
        <div className={styles.successMessage}>
          <p>تبریک! نقش شما با موفقیت تغییر کرد.</p>
        </div>
      ) : canRequestAgain ? (
        <button onClick={handleRequestRoleChange}>درخواست برای فروشنده شدن</button>
      ) : requestStatus === 'pending' ? (
        <div className={styles.requestDetails}>
          <p className={styles.statusMessage}>درخواست شما در حال بررسی است.</p>
          <p className={styles.statusMessage}>زمان درخواست: {toPersianNumbers(convertToPersianDate(new Date(requestTime).toLocaleString()))}</p>
          {timeRemaining > 0 && (
            <p className={styles.statusMessage}>
              شما می‌توانید پس از {toPersianNumbers(Math.floor(timeRemaining / 60000))} دقیقه و {toPersianNumbers(Math.floor((timeRemaining % 60000) / 1000))} ثانیه دیگر درخواست جدید ارسال کنید.
            </p>
          )}
          <button onClick={handleDeleteRequest}>لغو درخواست</button>
        </div>
      ) : requestStatus === 'denied' ? (
        <div className={styles.denyStatus}>
          <p>درخواست شما رد شده است.</p>
          <p>زمان رد: {new Date(requestDeniedTime).toLocaleString()}</p>
          <p>وضعیت: رد شده</p>
          <button onClick={handleDeleteRequest}>حذف درخواست</button>
        </div>
      ) : (
        <p className={styles.statusMessage}> شما می‌توانید پس از {toPersianNumbers(Math.floor(timeRemaining / 60000))} دقیقه و {toPersianNumbers(Math.floor((timeRemaining % 60000) / 1000))} ثانیه دیگر درخواست جدید ارسال کنید.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserRoleRequest;
