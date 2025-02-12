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
          className="form-control rounded-lg p-2"
          value={selectedAddressId || ""}
          onChange={(e) => setSelectedAddressId(e.target.value)}
          style={{cursor:'pointer'}}
        >
          {addresses.map((addr) => (
            <option key={addr.id} value={addr.id}>
              {addr.titleAddress} - {addr.address}, {addr.city}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12">
          <button
            type="button"
            className="btn btn-outline-primary rounded-lg"
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            {showAddressForm ? "لغو" : "افزودن آدرس جدید"}
          </button>
        </div>

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
