import { useEffect } from 'react';
import { fetchCartItems, updateCartItemQuantity, removeCartItem } from '../../../api/cartApi';
import CartItem from './CartItem';
import emptyCartImage from '../../../assets/images/demos/first_white_girl_drbl.gif';

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

  function formatPrice(price) {
    const formattedPrice = price.toLocaleString();
    const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
    return persianNumerals;
  }

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
    <div className={cartItems.length === 0 ? "col-lg-12" : "col-lg-9"}>
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
           <td colSpan="6" className="text-center"> 
            سبد خرید شما خالی است.
             <img 
               src={emptyCartImage} 
               alt="Empty Cart" 
               style={{ maxWidth: '200px', width: '100%', display: 'block', margin: '0 auto' }} 
             />
           </td>
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
