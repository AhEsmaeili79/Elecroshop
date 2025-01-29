import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllCartItems } from '../api/cartApi';

// Create CartContext
const CartContext = createContext();

// CartProvider component to provide the cart data to the rest of the app
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null); // Assuming you manage token state

    const refreshCart = () => {
        setCartItems([]); // Clear the cart
    };
    
    useEffect(() => {
        const loadCartItems = async () => {
            if (!token) {
                // If token is not available, do not fetch cart items
                setLoading(false);
                return;
            }

            try {
                const items = await fetchAllCartItems(token); // Pass token to API
                setCartItems(items);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCartItems();
    }, [token]); // Dependency on token

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, refreshCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
