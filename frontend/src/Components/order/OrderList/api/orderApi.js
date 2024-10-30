// api/orderApi.js
import axios from 'axios';

export const fetchUserOrders = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/order/orders/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Replace with your auth method
        }
    });
    return response.data; // Assuming the API returns an array of orders
};


export const fetchOrderDetails = async (orderId) => {
    const response = await fetch(`http://127.0.0.1:8000/api/order/orders/${orderId}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Replace with your auth method
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch order details');
    }

    return await response.json();
};