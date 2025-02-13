import { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchCategories,
  fetchBrands,
  fetchModels,
  fetchProductDetails,
  createProduct,
  updateProduct,
} from "../../../../../api/seller/Products";

const InputField = ({ label, type, name, value, onChange, required, multiple, accept }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">{label}</label>
    <input
      type={type}
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      multiple={multiple}
      accept={accept}
      dir="rtl"
    />
  </div>
);

const ProductForm = ({ productId, onSuccess }) => {
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

  const photoLabels = ["main_photo", "photo1", "photo2", "photo3"];

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
    if (productId) loadProductDetails();
  }, [productId]);

  const loadInitialData = async () => {
    try {
      const [cats, brds, mods] = await Promise.all([fetchCategories(), fetchBrands(), fetchModels()]);
      setCategories(cats);
      setBrands(brds);
      setModels(mods);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  const loadProductDetails = async () => {
    try {
      const data = await fetchProductDetails(productId);
      setProductData({
        name: data.name,
        price: data.price,
        desc: data.desc,
        model: data.model,
        category: data.category.id,
        brand: data.brand,
        images: {
          main_photo: null,
          photo1: null,
          photo2: null,
          photo3: null,
        },
      });
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchModels();
    if (productId) fetchProductDetails();
  }, [productId]);

  // Handlers for Form Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: name === "category" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProductData((prev) => ({
      ...prev,
      images: { ...prev.images, [name]: files[0] },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key === "images") {
        Object.entries(value).forEach(([imgKey, imgValue]) => {
          if (imgValue) formData.append(imgKey, imgValue);
        });
      } else {
        formData.append(key, value);
      }
    });

    try {
      if (productId) {
        await updateProduct(productId, formData);
        toast.success("محصول با موفقیت به‌روزرسانی شد!");
      } else {
        await createProduct(formData);
        toast.success("محصول با موفقیت اضافه شد!");
      }
      onSuccess();
    } catch (error) {
      toast.error("خطا در ذخیره محصول: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{productId ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="image-upload-row" style={{ display: "flex", gap: "20px" }}>
            {photoLabels.map((label, index) => (
              <div className="image-upload-container" key={label}>
                <label>{index === 0 ? "Main Photo" : `Photo ${index}`}</label>
                <label htmlFor={label} className="image-upload-label">
                  <img
                    src={
                      productData.images[label]
                        ? URL.createObjectURL(productData.images[label])
                        : "https://picsum.photos/800"
                    }
                    alt={label}
                    className="profile-image"
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
                  style={{ display: "none" }}
                />
              </div>
            ))}
          </div>
        <InputField label="Product Name *" type="text" name="name" value={productData.name} onChange={handleChange} required />
        <InputField label="Price *" type="number" name="price" value={productData.price} onChange={handleChange} required />
        <label>Description</label>
        <textarea name="desc" value={productData.desc} onChange={handleChange} className="form-control rounded-lg" />

        <label>Category *</label>
        <select name="category" value={productData.category} onChange={handleChange} className="form-control rounded-lg" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <label>Brand *</label>
        <select name="brand" value={productData.brand} onChange={handleChange} className="form-control rounded-lg" required>
          <option value="">Select Brand</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </select>

        <label>Model *</label>
        <select name="model" value={productData.model} onChange={handleChange} className="form-control rounded-lg" required>
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>

        


        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full" disabled={loading}>
          {loading ? "Saving..." : productId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
