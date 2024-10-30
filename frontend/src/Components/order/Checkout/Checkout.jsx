import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { fetchCartItems } from '../../Cart/api/cartApi'; // Ensure this is the correct import
import { createOrder } from '../api/orderApi'; // Ensure this is the correct import

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentType, setPaymentType] = useState('cash'); // Default payment type
    const [address, setAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const getCartItems = async () => {
            try {
                const items = await fetchCartItems();
                setCartItems(items);
                calculateTotalPrice(items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        getCartItems();
    }, []);

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const handleOrderSubmit = async (event) => {
        event.preventDefault();

        // Construct order data
        const orderData = {
            payment_type: 'cash',
            address: 'gdggt',
            total_price: totalPrice + 10.00, // Assuming this includes the shipment price
            items: cartItems.map(item => ({
                product: item.product.id,  // Ensure you reference the product ID correctly
                quantity: item.quantity
            })),
        };

        console.log('Order Data:', orderData); // Debugging: check what data is being sent

        try {
            const response = await createOrder(orderData);
            console.log('Order created successfully:', response);
            // Redirect to the order confirmation page
            navigate(`/order-confirmation/${response.id}`); // Assuming the order ID is returned
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    return (
        <div>
            <h1>Checkout</h1>
            <form onSubmit={handleOrderSubmit}>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Payment Type:</label>
                    <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
                        <option value="cash">Cash</option>
                        <option value="credit_card">Credit Card</option>
                    </select>
                </div>
                <h2>Cart Items:</h2>
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            {item.product.name} x {item.quantity} = ${item.product.price * item.quantity}
                        </li>
                    ))}
                </ul>
                <h3>Total Price: ${totalPrice + 10.00}</h3>
                <button type="submit">Place Order</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default Checkout;
