import { useEffect } from 'react';
import { fetchCartItems, updateCartItemQuantity, removeCartItem } from '../../../api/cartApi';
import CartItem from './CartItem';

const CartSection = ({ cartItems, setCartItems, setTotalPrice }) => {

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const items = await fetchCartItems();
        setCartItems(items);
        calculateTotalPrice(items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    loadCartItems();
  }, [setCartItems]);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const updatedItem = await updateCartItemQuantity(itemId, quantity);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
        );
        calculateTotalPrice(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter((item) => item.id !== itemId);
        calculateTotalPrice(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };
  

  return (
    <div className="col-lg-9">
      <table className="table table-cart table-mobile">
        <thead>
          <tr>
            <th>محصول</th>
            <th>رنگ</th>
            <th>قیمت</th>
            <th>تعداد</th>
            <th>مجموع</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length === 0 ? (
            <tr>
              <td colSpan="5">سبد خرید شما خالی است.</td>
            </tr>
          ) : (
            cartItems.map((item) => (
              <CartItem 
                key={item.id} 
                item={item} 
                onUpdateQuantity={handleUpdateQuantity} 
                onRemove={handleRemoveItem} 
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CartSection;
