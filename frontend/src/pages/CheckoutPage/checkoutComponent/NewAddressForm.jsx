const NewAddressForm = ({ newAddress, setNewAddress, addAddress }) => {
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addAddress(newAddress);
      setNewAddress({
        titleAddress: "",
        address: "",
        city: "",
        street: "",
        floor: "",
        apartment: "",
        zip_code: "",
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const fieldLabels = {
    titleAddress: "عنوان آدرس",
    address: "آدرس",
    city: "شهر",
    street: "خیابان",
    floor: "طبقه",
    apartment: "واحد",
    zip_code: "کد پستی"
  };

  return (
    <div className="new-address-form">
      <h3>آدرس جدید</h3>
      {Object.keys(newAddress).map((key) => (
        <div className="form-group" key={key}>
          <label>{fieldLabels[key]} *</label>
          <input
            type="text"
            className="form-control rounded-lg"
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
        ذخیره آدرس
      </button>
    </div>
  );
};

export default NewAddressForm;
