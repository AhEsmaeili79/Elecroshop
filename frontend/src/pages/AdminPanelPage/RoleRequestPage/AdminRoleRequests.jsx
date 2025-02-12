import { useEffect, useState } from 'react';
import { fetchRoleRequests, updateRoleRequest } from '../../../api/admin/RoleRequest';
import styles from '../css/RoleRequest.module.css';
import AdminLayout from '../dashboard/AdminLayout';
import moment from 'moment-jalaali';

const AdminRoleRequests = () => {
  const [requests, setRequests] = useState([]);

  const getRoleRequests = async () => {
    try {
      const data = await fetchRoleRequests();
      setRequests(data);
    } catch (error) {
      console.error('نمایش اطلاعات با مشکل مواجه شد', error);
    }
  };

  const toPersianNumbers = (num) => {
    return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
  };

  const handleUpdateRequest = async (requestId, status) => {
    try {
      await updateRoleRequest(requestId, status);
      getRoleRequests();
    } catch (error) {
      console.error('بروزرسانی اطلاعات با مشکل مواجه شد', error);
    }
  };

  useEffect(() => {
    getRoleRequests();
  }, []);

  return (
    <AdminLayout>
      <div className={`container ${styles['rtl-layout']}`}>
        <h2 className={`my-4 ${styles['heading-title']}`}>مدیریت درخواست‌های نقش</h2>
        <div className={`table-responsive ${styles['admin-table-container']}`}>
          <table className={`table table-bordered ${styles['admin-role-table']}`}>
            <thead>
              <tr>
                <th>نام کاربری</th>
                <th>ایمیل</th>
                <th>زمان درخواست</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className={styles['admin-table-row']}>
                  <td>{request.user.username}</td>
                  <td>{request.user.email}</td>
                  <td>
                    {toPersianNumbers(moment(request.request_time).locale('fa').format('jYYYY/jMM/jDD HH:mm:ss'))}
                  </td>
                  <td>
                    <span className={`badge ${styles[`admin-badge-${request.status}`]}`}>
                      {request.status === 'pending' ? 'در انتظار' :
                        request.status === 'approved' ? 'تایید شده' : 'رد شده'}
                    </span>
                  </td>
                  <td>
                    {request.status === 'pending' && (
                      <>
                        <button
                          className={`btn btn-success ${styles['admin-action-button']}`}
                          onClick={() => handleUpdateRequest(request.id, 'approved')}
                        >
                          تایید
                        </button>
                        <button
                          className={`btn btn-danger ${styles['admin-action-button']}`}
                          onClick={() => handleUpdateRequest(request.id, 'denied')}
                        >
                          رد
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRoleRequests;
