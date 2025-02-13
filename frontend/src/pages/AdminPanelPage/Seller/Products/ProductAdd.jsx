import ProductForm from "./Form/ProductForm";
import AdminLayout from "../../dashboard/AdminLayout";
import { toast } from "react-toastify";
const AddProductPage = () => {
  const handleSuccess = () => {
    toast.success('محصول با موفقیت اضافه شد.')
  };

  return (
    <AdminLayout>
    <div className="max-w-2xl mx-auto mt-10">
      <ProductForm productId={null} onSuccess={handleSuccess} />
    </div>
    </AdminLayout>
  );
};

export default AddProductPage;
