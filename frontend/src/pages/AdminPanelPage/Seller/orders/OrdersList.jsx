import { useEffect, useState } from 'react';
import { fetchUserOrders } from '../../../../api/seller/orders';
import { Link } from 'react-router-dom';
import AdminLayout from "../../dashboard/AdminLayout";

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await fetchUserOrders();
                setOrders(data);
            } catch (err) {
                setError('خطا در دریافت سفارشات. لطفا دوباره تلاش کنید.');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, []);

    if (loading) return <div>در حال بارگذاری سفارشات...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!orders.length) return <div>هیچ سفارشی یافت نشد.</div>;

    return (
        <AdminLayout>
            <div className="container my-5">
                <h1 className="text-center mb-4">سفارشات شما</h1>
                <div className="row">
                    {orders.map(order => (
                        <div className="col-md-4 mb-4" key={order.id}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">کد سفارش: {order.order_code}</h5>
                                    <p><strong>مجموع قیمت:</strong> {order.total_amount} تومان</p>
                                    <p><strong>وضعیت:</strong> {order.status}</p>
                                    <p><strong>قیمت ارسال:</strong> {order.shipment_price_amount} تومان</p>
                                    <p><strong>آدرس:</strong> {order.address}</p>
                                    <p><strong>نوع پرداخت:</strong> {order.payment_type}</p>

                                    <div>
                                        <h6>محصولات:</h6>
                                        {order.items.map(item => (
                                            <div key={item.id} className="mb-3">
                                                <div className="d-flex">
                                                    <img
                                                        src={item.product_image}
                                                        alt={item.product_name}
                                                        style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                                        className="me-3"
                                                    />
                                                    <div>
                                                        <p className="mb-1"><strong>{item.product_name}</strong></p>
                                                        <p><strong>قیمت:</strong> {item.product_price} تومان</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link to={`/admin/orders/${order.order_code}`} className="btn btn-primary">مشاهده جزئیات</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrdersList;
