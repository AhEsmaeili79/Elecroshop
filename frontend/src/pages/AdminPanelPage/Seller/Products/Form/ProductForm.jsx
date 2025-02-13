import { useState, useEffect } from "react";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL + "/products/";
const token = localStorage.getItem("access_token");

const InputField = ({ label, type, name, value, onChange, required, multiple, accept }) => (
  <>
    <label>{label}</label>
    <input
      type={type}
      className="form-control rounded-lg"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      multiple={multiple}
      accept={accept}
    />
  </>
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

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/category/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };


  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/category/brands/`);
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/category/models/`);
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}${productId}/`);
      const data = response.data;
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

  // UseEffect to load initial data
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


  console.log(productData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key === "images") {
        Object.entries(value).forEach(([imgKey, imgValue]) => {
          if (imgValue) formData.append(imgKey, imgValue);
        });
      }  else {
        formData.append(key, value);
      }
    });

    try {
      if (productId) {
        await axios.put(`${API_URL}${productId}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully!");
      } else {
        await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Error saving product: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{productId ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="image-upload-container">
          <label>Main Photo</label>
          <label htmlFor="main_photo" className="image-upload-label">
            <img
              src={productData.images.main_photo ? URL.createObjectURL(productData.images.main_photo) : "https://picsum.photos/800"}
              alt="Main"
              className="profile-image"
            />
            <div className="edit-icon">
              <FaCamera />
            </div>
          </label>
          <input id="main_photo" type="file" name="main_photo" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </div>

        <label>Additional Photos</label>
        <InputField type="file" name="photo1" onChange={handleFileChange} accept="image/*" />
        <InputField type="file" name="photo2" onChange={handleFileChange} accept="image/*" />
        <InputField type="file" name="photo3" onChange={handleFileChange} accept="image/*" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full" disabled={loading}>
          {loading ? "Saving..." : productId ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
