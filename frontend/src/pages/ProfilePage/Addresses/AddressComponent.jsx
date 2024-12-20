import { useState, useEffect } from 'react';
import { getAddress, addAddress, updateAddress, deleteAddress } from '../../../api/addresses';
import './AddressComponent.css'; // Custom CSS for modal and form

const AddressComponent = () => {
  const [addressList, setAddressList] = useState([]); // For storing all addresses
  const [formData, setFormData] = useState({
    id: '',
    titleAddress: '',
    address: '',
    city: '',
    street: '',
    floor: '',
    apartment: '',
    zip_code: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch all user addresses when the component loads
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    getAddress()
      .then((response) => setAddressList(response.data))
      .catch((error) => console.error('Error fetching addresses:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      updateAddress(selectedAddressId, formData)
        .then(() => {
          alert('Address updated successfully');
          setIsEditing(false);
          fetchAddresses(); // Fetch updated list of addresses
        })
        .catch((error) => console.error('Error updating address:', error));
    } else {
      addAddress(formData)
        .then(() => {
          alert('Address added successfully');
          fetchAddresses(); // Fetch updated list of addresses
        })
        .catch((error) => console.error('Error adding address:', error));
    }

    // Close modal and reset the form
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    deleteAddress(id)
      .then(() => {
        alert('Address deleted successfully');
        fetchAddresses(); // Fetch updated list of addresses
      })
      .catch((error) => console.error('Error deleting address:', error));
  };

  const handleEdit = (address) => {
    setFormData(address);
    setIsEditing(true);
    setSelectedAddressId(address.id);
    setIsModalOpen(true); // Open the modal to edit the address
  };

  const handleAddNew = () => {
    setIsEditing(false); // Ensure we're not in edit mode when adding
    resetForm(); // Reset the form data
    setIsModalOpen(true); // Open the modal for adding a new address
  };

  const resetForm = () => {
    setFormData({
      id: '',
      titleAddress: '',
      address: '',
      city: '',
      street: '',
      floor: '',
      apartment: '',
      zip_code: '',
    });
  };

  return (
    <div className="tab-pane fade" id="tab-address" role="tabpanel" aria-labelledby="tab-address-link">
      <p>The following addresses will be used on the checkout page by default.</p>

      <div className="row">
        {addressList.length > 0 ? (
          addressList.map((address) => (
            <div key={address.id} className="col-lg-6">
              <div className="card card-dashboard">
                <div className="card-body">
                  <h3 className="card-title">{address.titleAddress}</h3>

                  <p>
                    {address.titleAddress}<br />
                    {address.address}<br />
                    {address.city}, {address.street} {address.zip_code}<br />
                  </p>
                  <a onClick={() => handleEdit(address)} className="text-primary address-edit-new">Edit <i className="icon-edit"></i></a>
                  <a onClick={() => handleDelete(address.id)} className="text-danger address-edit-new">Delete<i className="fa fa-trash" aria-hidden="true"></i></a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No addresses available.</p>
        )}
      </div>

      {/* Add New Address Button */}
      <button className="btn btn-success" onClick={handleAddNew}>
        Add New Address
      </button>

      {/* Custom Modal for Editing and Adding Address */}
      {isModalOpen && (
        <div className="custom-modal-new">
          <div className="modal-overlay-new" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal-content-new">
            <div className="modal-header-new">
              <h5>{isEditing ? 'Edit Address' : 'Add Address'}</h5>
              <button className="close-modal-new" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group-new">
                  <label htmlFor="titleAddress">Title Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titleAddress"
                    name="titleAddress"
                    placeholder="Title Address"
                    value={formData.titleAddress}
                    onChange={(e) => setFormData({ ...formData, titleAddress: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="street">Street</label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    name="street"
                    placeholder="Street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="floor">Floor</label>
                  <input
                    type="number"
                    className="form-control"
                    id="floor"
                    name="floor"
                    placeholder="Floor"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="apartment">Apartment</label>
                  <input
                    type="number"
                    className="form-control"
                    id="apartment"
                    name="apartment"
                    placeholder="Apartment"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="zip_code">Zip Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip_code"
                    name="zip_code"
                    placeholder="Zip Code"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="address">Address</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-footer-new">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">{isEditing ? 'Update Address' : 'Add Address'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponent;
