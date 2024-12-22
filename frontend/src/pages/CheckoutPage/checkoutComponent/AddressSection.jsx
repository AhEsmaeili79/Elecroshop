import NewAddressForm from './NewAddressForm';

const AddressSection = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  showAddressForm,
  setShowAddressForm,
  newAddress,
  setNewAddress,
  addAddress
}) => {
  return (
    <div>
      <div className="form-group">
        <label>آدرس خود را انتخاب کنید *</label>
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
        {showAddressForm ? "لغو" : "افزودن آدرس جدید"}
      </button>

      {showAddressForm && (
        <NewAddressForm 
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          addAddress={addAddress}
        />
      )}
    </div>
  );
};

export default AddressSection;
