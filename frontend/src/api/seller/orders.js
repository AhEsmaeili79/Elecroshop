import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/order';

export const fetchUserOrders = async () => {
    const response = await axios.get(`${API_URL}`+ '/orders/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    return response.data;
};


export const fetchOrderDetails = async (orderCode) => {
    try {
        const response = await axios.get(`${API_URL}/?order_code=${orderCode}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}` 
            }
        });
        return response.data;
    } catch (error) {
      console.log();
      throw error;
    }
};
