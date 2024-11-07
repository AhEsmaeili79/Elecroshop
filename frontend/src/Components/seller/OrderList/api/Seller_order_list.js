import axios from 'axios';

const getSellerOrders = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/order/orders/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Replace with your auth method
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to load orders.');
  }
};

export { getSellerOrders };
