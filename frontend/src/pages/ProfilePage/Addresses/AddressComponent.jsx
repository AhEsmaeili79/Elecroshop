import { useState, useEffect } from 'react';
import { getAddress, addAddress, updateAddress, deleteAddress } from '../../../api/addresses';
import './AddressComponent.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // Validation states
  const [formErrors, setFormErrors] = useState({
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

    // Perform final validation before submitting
    if (validateForm()) {
      if (isEditing) {
        updateAddress(selectedAddressId, formData)
          .then(() => {
            toast.success('آدرس با موفقیت به روز شد');
            setIsEditing(false);
            fetchAddresses();
          })
          .catch((error) => console.error('Error updating address:', error));
      } else {
        addAddress(formData)
          .then(() => {
            toast.success('آدرس با موفقیت اضافه شد');
            fetchAddresses();
          })
          .catch((error) => console.error('Error adding address:', error));
      }

      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleDelete = (id) => {
    deleteAddress(id)
      .then(() => {
        toast.success('آدرس با موفقیت حذف شد');
        fetchAddresses(); 
      })
      .catch((error) => console.error('Error deleting address:', error));
  };


  const validateForm = () => {
    let valid = true;
    let errors = { ...formErrors };

    // Validate each field
    if (!formData.titleAddress) {
      errors.titleAddress = 'عنوان آدرس نمی‌تواند خالی باشد';
      valid = false;
    } else {
      errors.titleAddress = '';
    }

    if (!formData.address) {
      errors.address = 'آدرس نمی‌تواند خالی باشد';
      valid = false;
    } else {
      errors.address = '';
    }

    if (!formData.city) {
      errors.city = 'شهر نمی‌تواند خالی باشد';
      valid = false;
    } else {
      errors.city = '';
    }

    if (!formData.street) {
      errors.street = 'خیابان نمی‌تواند خالی باشد';
      valid = false;
    } else {
      errors.street = '';
    }

    if (!formData.zip_code || isNaN(formData.zip_code) || formData.zip_code.length !== 5) {
      errors.zip_code = 'کد پستی باید عددی باشد و طول آن باید 5 رقم باشد';
      valid = false;
    } else {
      errors.zip_code = '';
    }

    if (formData.floor !== '' && (isNaN(formData.floor) || formData.floor < 0)) {
      errors.floor = 'طبقه باید عددی و مثبت باشد';
      valid = false;
    } else {
      errors.floor = '';
    }

    if (formData.apartment !== '' && (isNaN(formData.apartment) || formData.apartment < 0)) {
      errors.apartment = 'واحد باید عددی و مثبت باشد';
      valid = false;
    } else {
      errors.apartment = '';
    }

    setFormErrors(errors);
    return valid;
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
    setFormErrors({
      titleAddress: '',
      address: '',
      city: '',
      street: '',
      floor: '',
      apartment: '',
      zip_code: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateForm(); 
  };

  return (
    <div className="tab-pane fade" id="tab-address" role="tabpanel" aria-labelledby="tab-address-link">
      <p>آدرس‌های زیر در صفحه پرداخت نمایش داده خواهند شد.</p>

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
                    className={`form-control ${formErrors.titleAddress ? 'is-invalid' : ''}`}
                    id="titleAddress"
                    name="titleAddress"
                    placeholder="عنوان آدرس"
                    value={formData.titleAddress}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {formErrors.titleAddress && <div className="invalid-feedback">{formErrors.titleAddress}</div>}
                </div>

                <div className="form-group-new">
                  <label htmlFor="city">شهر</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.city ? 'is-invalid' : ''}`}
                    id="city"
                    name="city"
                    placeholder="شهر"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {formErrors.city && <div className="invalid-feedback">{formErrors.city}</div>}
                </div>

                <div className="form-group-new">
                  <label htmlFor="street">خیابان</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.street ? 'is-invalid' : ''}`}
                    id="street"
                    name="street"
                    placeholder="خیابان"
                    value={formData.street}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {formErrors.street && <div className="invalid-feedback">{formErrors.street}</div>}
                </div>

                <div className="form-group-new">
                  <label htmlFor="floor">طبقه</label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.floor ? 'is-invalid' : ''}`}
                    id="floor"
                    name="floor"
                    placeholder="طبقه"
                    value={formData.floor}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {formErrors.floor && <div className="invalid-feedback">{formErrors.floor}</div>}
                </div>

                <div className="form-group-new">
                  <label htmlFor="apartment">واحد</label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.apartment ? 'is-invalid' : ''}`}
                    id="apartment"
                    name="apartment"
                    placeholder="واحد"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {formErrors.apartment && <div className="invalid-feedback">{formErrors.apartment}</div>}
                </div>

                <div className="form-group-new">
                  <label htmlFor="zip_code">کد پستی</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.zip_code ? 'is-invalid' : ''}`}
                    id="zip_code"
                    name="zip_code"
                    placeholder="کد پستی"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {formErrors.zip_code && <div className="invalid-feedback">{formErrors.zip_code}</div>}
                </div>

                <div className="form-group-new">
                  <label htmlFor="address">آدرس</label>
                  <textarea
                    className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                    id="address"
                    name="address"
                    placeholder="آدرس"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                  />
                  {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                </div>

                <div className="modal-footer-new">
                  <button type="submit" className="btn btn-success">{isEditing ? 'به روز رسانی آدرس' : 'افزودن آدرس'}</button>
                  <button type="button" className="btn btn-secondary" style={{marginLeft:'-1px'}} onClick={() => setIsModalOpen(false)}>بستن</button>
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
