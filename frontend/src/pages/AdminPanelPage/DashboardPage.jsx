import { useEffect, useState } from "react";
import AdminLayout from "./dashboard/AdminLayout";
import styles from "./css/AdminDashboard.module.css";
import { fetchUserData } from "../../api/adminDashboard";

const DashboardPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData();
      if (data) {
        setUser(data);
      }
    };
    getUserData();
  }, []);

  // Function to translate roles to Persian
  const getRoleInPersian = (role) => {
    if (role === "admin") return "مدیر";
    if (role === "seller") return "فروشنده";
    return "نامشخص"; // Default for unexpected roles
  };

  return (
    <AdminLayout>
      <div className={`${styles.dashboardContainer} p-4`}>
        <h1 className={`${styles.dashboardTitle} text-center`}>داشبورد مدیریت</h1>
        <p className={`${styles.dashboardText} text-muted text-center`}>
          به پنل ادمین خوش آمدید
        </p>

        {user ? (
          <div className={`${styles.dashboardCard} card shadow-lg p-4`}>
            <h2 className="text-primary">اطلاعات کاربر</h2>
            <p><strong>نام:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>نقش:</strong> {getRoleInPersian(user.role)}</p>
          </div>
        ) : (
          <p className="text-danger text-center">اطلاعات کاربر یافت نشد</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;