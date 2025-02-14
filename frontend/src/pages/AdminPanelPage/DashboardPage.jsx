import { useEffect, useState } from "react";
import AdminLayout from "./dashboard/AdminLayout";
import { fetchUserData } from "../../api/admin/adminDashboard";
import { fetchCategories, fetchBrands, fetchModels } from "../../api/admin/adminDashboard";
import { fetchUserOrders } from "../../api/admin/adminDashboard";
import { fetchSellerProducts } from "../../api/seller/Products";
import { fetchWishlist } from "../../api/admin/adminDashboard";
import moment from "moment-jalaali";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import styles from './css/AdminDashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const convertToPersianDate = (date) => moment(date).format("jYYYY/jMM/jDD HH:mm:ss");
const getPersianMonth = (date) => moment(date).locale('fa').format("jMM");

const DashboardPage = () => {
  const [user, setUser] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
    datasets: [
      { label: "تعداد سفارشات موفق", data: Array(12).fill(0), borderColor: "#4CAF50", backgroundColor: "rgba(76, 175, 80, 0.2)", fill: true },
      { label: "تعداد سفارشات در حال انجام", data: Array(12).fill(0), borderColor: "#FF5722", backgroundColor: "rgba(255, 87, 34, 0.2)", fill: true },
    ]
  });

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData();
      setUser(data);
    };
    
    getUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData, modelsData, ordersData, productsData, wishlistData] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
          fetchModels(),
          fetchUserOrders(),
          fetchSellerProducts(),
          fetchWishlist(),
        ]);

        setCategories(categoriesData);
        setBrands(brandsData);
        setModels(modelsData);
        setOrders(ordersData);
        setProducts(productsData);
        setWishlist(wishlistData);

        const orderStats = { successful: Array(12).fill(0), pending: Array(12).fill(0) };
        ordersData.forEach(order => {
          const monthIndex = parseInt(getPersianMonth(order.payment.created_at), 10) - 1;
          if (order.status === "successful") orderStats.successful[monthIndex]++;
          if (order.status === "pending") orderStats.pending[monthIndex]++;
        });

        setChartData(prevData => ({
          ...prevData,
          datasets: [
            { ...prevData.datasets[0], data: orderStats.successful },
            { ...prevData.datasets[1], data: orderStats.pending }
          ]
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getRoleInPersian = (role) => {
    const roles = { admin: "مدیر", seller: "فروشنده" };
    return roles[role] || "نامشخص";
  };

  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";

  return (
    <AdminLayout>
      <div className={styles.dashboardContainer}>
        <h1 className={styles.dashboardTitle}>داشبورد مدیریت</h1>
        <p className={styles.dashboardSubheading}>به پنل ادمین خوش آمدید</p>

        {user ? (
          <div className={styles.userCard}>
            <h2 className={styles.userCardTitle}>اطلاعات کاربر</h2>
            <p><strong>نام:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>نقش:</strong> {getRoleInPersian(user.role)}</p>
          </div>
        ) : (
          <p className={styles.errorMessage}>اطلاعات کاربر یافت نشد</p>
        )}

        <div className={styles.dashboardCards}>
          {isAdmin || isSeller ? (
            <>
              <DashboardCard title="دسته‌بندی‌ها" count={categories.length} link="/admin/category" />
              <DashboardCard title="محصولات" count={products.length} link="/admin/products" />
              <DashboardCard title="سفارش‌ها" count={orders.length} link="/admin/orders" />
            </>
          ) : null}
          
          {isAdmin && (
            <>
              <DashboardCard title="برندها" count={brands.length} link="/admin/brands" />
              <DashboardCard title="مدل‌ها" count={models.length} link="/admin/models" />
              <DashboardCard title="لیست علاقه‌مندی‌ها" count={wishlist.length} link="/admin/wishlist" />
            </>
          )}
        </div>

        <div className={styles.chartSection}>
          <h2 className={styles.chartTitle}>گراف تعداد سفارشات</h2>
          <Line data={chartData} />
        </div>

        {isAdmin && orders.length > 0 && (
          <div className={styles.ordersSection} dir="rtl">
            <h2 className={styles.ordersTitle}>سفارش‌های تکمیل شده</h2>
            <ul className={styles.ordersList}>
              {orders.filter(order => order.status === "successful").map((order) => (
                <li key={order.id} className={styles.ordersListItem}>
                  <div className={styles.orderDetails}>
                    <strong>شماره سفارش:</strong> {order.order_code} 
                    <span className={styles.orderDate}><strong>تاریخ:</strong> {convertToPersianDate(order.payment.created_at)}</span>
                    <span className={styles.orderAmount}><strong>مبلغ:</strong> {order.total_amount} تومان</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

const DashboardCard = ({ title, count, link }) => (
  <div className={styles.dashboardCard}>
    <h3 className={styles.dashboardCardTitle}>{title}</h3>
    <p className={styles.dashboardCardCount}>{count}</p>
    <a href={link} className={styles.dashboardCardLink}>مشاهده جزئیات</a>
  </div>
);

export default DashboardPage;
