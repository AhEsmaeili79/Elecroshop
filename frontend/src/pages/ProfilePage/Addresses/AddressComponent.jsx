import { useState, useEffect } from 'react';
import { getAddress, addAddress, updateAddress, deleteAddress } from '../../../api/addresses';
import './AddressComponent.css';

const AddressComponent = () => {
  const [addressList, setAddressList] = useState([]); 
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
          alert('آدرس با موفقیت به روز شد');
          setIsEditing(false);
          fetchAddresses(); 
        })
        .catch((error) => console.error('Error updating address:', error));
    } else {
      addAddress(formData)
        .then(() => {
          alert('آدرس با موفقیت اضافه شد');
          fetchAddresses();
        })
        .catch((error) => console.error('Error adding address:', error));
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id) => {
    deleteAddress(id)
      .then(() => {
        alert('آدرس با موفقیت حذف شد');
        fetchAddresses(); 
      })
      .catch((error) => console.error('Error deleting address:', error));
  };

  const handleEdit = (address) => {
    setFormData(address);
    setIsEditing(true);
    setSelectedAddressId(address.id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    resetForm();
    setIsModalOpen(true); 
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
      <p>آدرس‌های زیر به طور پیش‌فرض در صفحه پرداخت استفاده خواهند شد.</p>

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
                  <a onClick={() => handleEdit(address)} className="text-primary address-edit-new">ویرایش <i className="icon-edit"></i></a>
                  <a onClick={() => handleDelete(address.id)} className="text-danger address-edit-new">حذف<i className="fa fa-trash" aria-hidden="true"></i></a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>آدرسی موجود نیست.</p>
        )}
      </div>

      <button className="btn btn-success" onClick={handleAddNew}>
        افزودن آدرس جدید
      </button>

      {isModalOpen && (
        <div className="custom-modal-new">
          <div className="modal-overlay-new" onClick={() => setIsModalOpen(false)}></div>
          <div className="modal-content-new">
            <div className="modal-header-new">
              <h5>{isEditing ? 'ویرایش آدرس' : 'افزودن آدرس'}</h5>
              <button className="close-modal-new" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group-new">
                  <label htmlFor="titleAddress">عنوان آدرس</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titleAddress"
                    name="titleAddress"
                    placeholder="عنوان آدرس"
                    value={formData.titleAddress}
                    onChange={(e) => setFormData({ ...formData, titleAddress: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="city">شهر</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    placeholder="شهر"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="street">خیابان</label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    name="street"
                    placeholder="خیابان"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="floor">طبقه</label>
                  <input
                    type="number"
                    className="form-control"
                    id="floor"
                    name="floor"
                    placeholder="طبقه"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="apartment">آپارتمان</label>
                  <input
                    type="number"
                    className="form-control"
                    id="apartment"
                    name="apartment"
                    placeholder="آپارتمان"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="zip_code">کد پستی</label>
                  <input
                    type="text"
                    className="form-control"
                    id="zip_code"
                    name="zip_code"
                    placeholder="کد پستی"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group-new">
                  <label htmlFor="address">آدرس</label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    placeholder="آدرس"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-footer-new">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>بستن</button>
                  <button type="submit" className="btn btn-primary">{isEditing ? 'به روز رسانی آدرس' : 'افزودن آدرس'}</button>
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
