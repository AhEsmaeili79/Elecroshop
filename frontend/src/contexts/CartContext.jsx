import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllCartItems } from '../api/cartApi';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshCart = () => {
        setCartItems([]); 
    };
    
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const items = await fetchAllCartItems();
                setCartItems(items);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCartItems();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, refreshCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};