import { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchCategories,
  fetchBrands,
  fetchModels,
  fetchProductDetails,
  createProduct,
  updateProduct,
} from "../../../../../api/seller/Products";
import ImagePlaceholder from '../../../../../assets/images/landscape-placeholder.svg';

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  required,
  multiple,
  accept,
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="form-label fw-bold mb-2">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      multiple={multiple}
      accept={accept}
      dir="rtl"
      className="form-control rounded-lg py-2 px-3 shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
    />
  </div>
);

const ProductForm = ({ productId }) => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    desc: "",
    model: "",
    category: "",
    brand: "",
    images: {
      main_photo: null,
      photo1: null,
      photo2: null,
      photo3: null,
    },
  });
  
  const [imagePreviews, setImagePreviews] = useState({});


  const photoLabels = ["main_photo", "photo1", "photo2", "photo3"];

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cats, brds, mods] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
          fetchModels(),
        ]);
        setCategories(cats);
        setBrands(brds);
        setModels(mods);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();

    if (productId) {
      loadProductDetails();
    }
  }, [productId]);  

  const loadProductDetails = async () => {
    try {
      const data = await fetchProductDetails(productId);
      console.log(data);
      setProductData({
        name: data.name,
        price: data.price,
        desc: data.desc,
        model: data.model,
        category: data.category,
        brand: data.brand,
        images: {
          main_photo: data.main_photo,
          photo1: data.photo1,
          photo2: data.photo2,
          photo3: data.photo3,
        },
      });
  
      setImagePreviews({
        main_photo: data.main_photo || ImagePlaceholder,
        photo1: data.photo1 || ImagePlaceholder,
        photo2: data.photo2 || ImagePlaceholder,
        photo3: data.photo3 || ImagePlaceholder,
      });
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: name === "category" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
      setProductData((prev) => ({
        ...prev,
        images: { ...prev.images, [name]: file },
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const urlToFile = async (url, imageName) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], imageName, { type: blob.type });
    };
  
    const formData = new FormData();
    for (const [key, value] of Object.entries(productData)) {
      if (key === "images") {
        for (const [imgKey, imgValue] of Object.entries(value)) {
          if (typeof imgValue === "string" && imgValue.startsWith("http")) {
            const file = await urlToFile(imgValue, `${imgKey}.jpg`);
            formData.append(imgKey, file);
          } else if (imgValue) {
            formData.append(imgKey, imgValue);
          }
        }
      } else {
        formData.append(key, value);
      }
    }
  
    try {
      if (productId) {
        await updateProduct(productId, formData);
        toast.success("محصول با موفقیت به‌روزرسانی شد!");
        navigate('/admin/products');
      } else {
        await createProduct(formData);
        toast.success("محصول با موفقیت اضافه شد!");
        navigate('/admin/products');
      }
    } catch (error) {
      toast.error("خطا در ذخیره محصول: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" dir="rtl">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 bg-white rounded-lg shadow-md p-4 p-md-5">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            {productId ? "ویرایش محصول" : "افزودن محصول"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              {photoLabels.map((label, index) => (
                <div className="col-6 col-md-4 col-lg-3 text-center" key={label}>
                  <label>{index === 0 ? "تصویر اصلی" : `تصویر شماره ${index}`}</label>
                  <label htmlFor={label} className="image-upload-label d-block">
                  <img
                      src={
                        imagePreviews[label] || 
                        (productId && productData.images[label]) || 
                        ImagePlaceholder
                      }
                      alt={label}
                      className="img-fluid rounded shadow-sm"
                    />
                    <div className="edit-icon">
                      <FaCamera />
                    </div>
                  </label>
                  <input
                    id={label}
                    type="file"
                    name={label}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="d-none"
                  />
                </div>
              ))}
            </div>

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <InputField
                  label="نام محصول *"
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <InputField
                  label="قیمت *"
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label>توضیحات</label>
              <textarea
                name="desc"
                value={productData.desc}
                onChange={handleChange}
                className="form-control rounded-lg py-2 px-3 shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="row">
              <div className="col-12 col-md-4 mb-3">
                <label>دسته‌بندی *</label>
                <select
                    name="category"
                    value={String(productData.category)}  
                    onChange={handleChange}
                    className="form-control rounded-lg py-2 px-3 shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    required
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>  {/* Ensure value is string */}
                        {cat.name}
                      </option>
                    ))}
                  </select>

                                </div>

              <div className="col-12 col-md-4 mb-3">
                <label>برند *</label>
                <select
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  className="form-control rounded-lg py-2 px-3 shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">انتخاب برند</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4 mb-3">
                <label>مدل *</label>
                <select
                  name="model"
                  value={productData.model}
                  onChange={handleChange}
                  className="form-control rounded-lg py-2 px-3 shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                  required
                  style={{ cursor: 'pointer', fontWeight: '200' }}
                >
                  <option value="">انتخاب مدل</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-100 disabled:opacity-50"
              disabled={loading}
              style={{ fontSize: '15px' }}
            >
              {loading ? "در حال ذخیره..." : productId ? "به‌روزرسانی محصول" : "افزودن محصول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
