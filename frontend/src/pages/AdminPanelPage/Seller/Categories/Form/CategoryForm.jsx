import { useState, useEffect } from "react";
import ImagePlaceholder from "../../../../../assets/images/landscape-placeholder.svg";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  fetchCategoryDetail,
} from "../../../../../api/seller/category";
import { FaCamera } from "react-icons/fa";
import AdminLayout from "../../../dashboard/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CategoryForm = ({ categoryId, onSuccess }) => {
  const [categoryData, setCategoryData] = useState({ name: "", image: null });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const category = await fetchCategoryDetail(categoryId);
          setCategoryData({ name: category.name, image: category.image });
          setImagePreview(category.image);
        } catch (error) {
          toast.error("خطا در دریافت اطلاعات دسته‌بندی");
        }
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setCategoryData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", categoryData.name);

      if (imagePreview && imagePreview !== categoryData.image) {
        formData.append("image", categoryData.image);
      }

      if (categoryId) {
        await updateCategory(categoryId, formData);
        navigate("/admin/category");
      } else {
        await addCategory(formData);
        navigate("/admin/category");
      }

      onSuccess();
    } catch (error) {
      toast.error("خطا در ذخیره‌سازی دسته‌بندی");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) {
      try {
        setLoading(true);
        await deleteCategory(categoryId);
        onSuccess();
        navigate("/admin/category");
      } catch (error) {
        toast.error("خطا در حذف دسته‌بندی");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="container" dir="rtl">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 bg-white rounded-lg shadow-md p-4 p-md-5">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              {categoryId ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
            </h2>
            {categoryId && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  disabled={loading}
                  style={{backgroundColor:'red',fontSize:'15px'}}
                >
                  {loading ? "در حال حذف..." : "حذف دسته‌ بندی"}
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label fw-bold mb-2">
                  نام دسته‌بندی *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={categoryData.name}
                  onChange={handleChange}
                  required
                  dir="rtl"
                  className="form-control rounded-lg py-2 px-3 shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="text-center mb-4">
                <label htmlFor="image" className="image-upload-label d-block">
                  <img
                    src={imagePreview || ImagePlaceholder}
                    alt="پیش‌نمایش تصویر"
                    className="img-fluid rounded shadow-sm"
                  />
                  <div className="edit-icon">
                    <FaCamera />
                  </div>
                </label>
                <input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="d-none"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-100 disabled:opacity-50"
                disabled={loading}
                style={{ fontSize: "15px" }}
              >
                {loading
                  ? "در حال ذخیره..."
                  : categoryId
                  ? "به‌روزرسانی دسته‌بندی"
                  : "افزودن دسته‌بندی"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;
