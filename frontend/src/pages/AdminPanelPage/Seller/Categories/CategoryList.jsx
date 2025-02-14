import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImagePlaceholder from "../../../../assets/images/landscape-placeholder.svg";
import { fetchCategories } from "../../../../api/seller/category";
import { FaEdit } from "react-icons/fa";
import AdminLayout from "../../dashboard/AdminLayout";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  return (
    <AdminLayout>
    <div className="container" dir="rtl">
      <div className="row justify-content-center rounded-lg">
        <div className="col-12 col-md-10 col-lg-8 bg-white rounded-lg shadow-md p-4 p-md-5 rounded-lg mt-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">دسته‌بندی‌های شما</h2>

          {loading ? (
            <p>در حال بارگذاری...</p>
          ) : categories.length > 0 ? (
            <ul className="list-group">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="list-group-item d-flex justify-content-between align-items-center rounded-lg"
                >
                  <div className="d-flex align-items-center rounded-lg">
                  <img
                        src={category.image || ImagePlaceholder}
                        alt={category.name}
                        className="img-fluid rounded shadow-sm"
                        style={{ width: "100px", height: "50px", objectFit: "contain" }}
                        />
                    <span className="ms-3 ml-4">{category.name}</span>
                  </div>
                  <Link
                    to={`/admin/category/edit/${category.id}`}
                    className="btn btn-sm btn-outline-primary rounded-lg"
                  >
                    ویرایش
                    <FaEdit className="me-1 ml-4" /> 
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>شما هنوز دسته‌بندی‌ای اضافه نکرده‌اید.</p>
          )}

          <Link to="/admin/category/add" className="btn btn-primary mt-4 rounded-lg">
            افزودن دسته‌بندی جدید
          </Link>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default CategoryList;
