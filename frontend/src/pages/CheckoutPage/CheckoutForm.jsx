import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { createOrder, fetchCartItems ,fetchOrderByCode } from "../../api/orderApi";
import { getAddress, addAddress } from "../../api/addresses";
import { fetchUserData } from "../../api/user";
import { useCart } from "../../contexts/CartContext";
import UserDetails from './checkoutComponent/UserDetails';
import AddressSection from './checkoutComponent/AddressSection';
import Summary from './checkoutComponent/Summary';
import CheckoutButtons from './checkoutComponent/CheckoutButtons';
import ErrorMessages from './checkoutComponent/ErrorMessages';
import './css/CheckoutForm.rtl.css';

const CheckoutForm = () => {
  const [userData, setUserData] = useState(null);
  const { cartItems, setCartItems } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [ordercode, setOrderCode] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [isProcessing, setIsProcessing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    titleAddress: "",
    address: "",
    city: "",
    street: "",
    floor: "",
    apartment: "",
    zip_code: "",
  });
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [paymentType, setPaymentType] = useState("credit_card");
  const [errorMessages, setErrorMessages] = useState({
    cartEmpty: false,
    shippingEmpty: false,
  });
  const [paymentReady, setPaymentReady] = useState(false);
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/');
    }
}, [navigate]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, cart, addressList] = await Promise.all([
          fetchUserData(),
          fetchCartItems(),
          getAddress()
        ]);
        setUserData(user);
        setCartItems(cart);
        setAddresses(addressList.data);
        if (addressList.data.length > 0) {
          setSelectedAddressId(addressList.data[0].id);
        }

        const storedShipping = localStorage.getItem('selectedShipping');
        if (storedShipping) {
          setSelectedShipping(JSON.parse(storedShipping));
        }
        if (!storedShipping) {
          navigate('/');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setErrorMessages({
      cartEmpty: cartItems.length === 0,
      shippingEmpty: !selectedShipping,
    });
  }, [cartItems, selectedShipping]);
  
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShipping) return;
  
    setIsProcessing(true);
  
    const orderData = {
      address: selectedAddressId,
      shipment_price: selectedShipping.id,
      payment_type: paymentType,
      items: [],
      total_amount: getTotalPrice() + (selectedShipping ? selectedShipping.price : 0),
    };
  
    try {
      const createdOrder = await createOrder(orderData);
      setOrderCode(createdOrder.order_code);
  
      if (paymentType === 'credit_card') {
        setPaymentReady(true);
      } else {
        refreshCart();
        localStorage.removeItem('selectedShipping');
        navigate(`/orders/${createdOrder.order_code}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePaymentRedirect = async () => {
    if (paymentType === 'credit_card' && paymentReady && ordercode) {
      setIsProcessing(true);
  
      try {
        await delay(2000); 
        const orderDetails = await fetchOrderByCode(ordercode);
        if (orderDetails[0] && orderDetails[0].payment) {
          const authority = orderDetails[0].payment.authority;
          refreshCart();
          localStorage.removeItem('selectedShipping');
          window.location.href = `https://www.zarinpal.com/pg/StartPay/${authority}`;
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  useEffect(() => {
    handlePaymentRedirect();
  }, [paymentReady, paymentType, ordercode]);

  return (
    <form onSubmit={handleOrderSubmit}>
      <ErrorMessages errorMessages={errorMessages} />
      <div className="row">
        <div className="col-lg-9">
          <h2 className="checkout-title">جزئیات صورتحساب</h2>
          <UserDetails userData={userData} />
          <AddressSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            showAddressForm={showAddressForm}
            setShowAddressForm={setShowAddressForm}
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            addAddress={addAddress}
          />
        </div>

        <aside className="col-lg-3">
          <Summary
            cartItems={cartItems}
            selectedShipping={selectedShipping}
          />
          <CheckoutButtons
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            errorMessages={errorMessages}
            paymentReady={paymentReady}
            isProcessing={isProcessing}
          />
        </aside>
      </div>
    </form>
  );
};

export default CheckoutForm;
