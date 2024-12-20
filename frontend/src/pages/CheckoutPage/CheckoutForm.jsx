import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { createOrder, fetchCartItems } from "../../api/orderApi";
import { getAddress, addAddress } from "../../api/addresses";
import { fetchUserData } from "../../api/user";
import { useCart } from "../../contexts/CartContext";
import './css/CheckoutForm.css';

const CheckoutForm = () => {
  const [userData, setUserData] = useState(null);
  const { cartItems, setCartItems } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
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
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  if (cartItems.length === 0) {
    navigate('/'); // Navigate to the home page
  }

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Check if cartItems or selectedShipping is empty and update errorMessages accordingly
    setErrorMessages({
      cartEmpty: cartItems.length === 0,
      shippingEmpty: !selectedShipping,
    });
  }, [cartItems, selectedShipping]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addAddress(newAddress);
      setAddresses((prev) => [...prev, response.data]);
      setShowAddressForm(false);
      setSelectedAddressId(response.data.id);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShipping) return;
    
    const orderData = {
      address: selectedAddressId,
      shipment_price: selectedShipping.id,
      payment_type: paymentType,
      items: [],
    };

    try {
      await createOrder(orderData);
      refreshCart();
      localStorage.removeItem('selectedShipping');
      localStorage.removeItem('cartItems');
      navigate('/orders');
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // Function to get the total price without duplicates
  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  return (
    <form onSubmit={handleOrderSubmit}>
      {errorMessages.cartEmpty && <div className="alert alert-danger error-message">Your cart is empty.</div>}
      {errorMessages.shippingEmpty && <div className="alert alert-danger error-message">Please select a shipping method.</div>}
      <div className="row">
        <div className="col-lg-9">
          <h2 className="checkout-title">Billing Details</h2>
          {userData && (
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" className="form-control" value={userData.first_name} disabled />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" className="form-control" value={userData.last_name} disabled />
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Choose Address *</label>
            <select
              className="form-control"
              value={selectedAddressId || ""}
              onChange={(e) => setSelectedAddressId(e.target.value)}
            >
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.titleAddress} - {addr.address}, {addr.city}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-link"
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            {showAddressForm ? "Cancel" : "Add New Address"}
          </button>

          {showAddressForm && (
            <div className="new-address-form">
              <h3>New Address</h3>
              {Object.keys(newAddress).map((key) => (
                <div className="form-group" key={key}>
                  <label>{key.replace(/_/g, " ")} *</label>
                  <input
                    type="text"
                    className="form-control"
                    name={key}
                    value={newAddress[key]}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNewAddressSubmit}
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        <aside className="col-lg-3">
          <div className="summary">
            <h3 className="summary-title">Your Order</h3>
            <table className="table table-summary">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={`/product/${item.product.id}`}>
                        {item.product.name}
                      </Link>
                    </td>
                    <td>${item.total_price}</td>
                  </tr>
                ))}
                <tr className="summary-total">
                  <td>Total:</td>
                  <td>${getTotalPrice()}</td>
                </tr>
                {selectedShipping && (
                  <tr className="summary-shipping">
                    <td>Shipping:</td>
                    <td>{selectedShipping.title} ${selectedShipping.price}</td>
                  </tr>
                )}
                <tr className="summary-total">
                  <td>Grand Total:</td>
                  <td>
                    ${getTotalPrice() + (selectedShipping ? selectedShipping.price : 0)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="form-group">
              <label>Payment Type *</label>
              <select
                className="form-control"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-outline-primary-2 btn-order btn-block"
              disabled={errorMessages.cartEmpty || errorMessages.shippingEmpty}
            >
              <span className="btn-text">Place Order</span>
              <span className="btn-hover-text">Proceed to Checkout</span>
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
};

export default CheckoutForm;
