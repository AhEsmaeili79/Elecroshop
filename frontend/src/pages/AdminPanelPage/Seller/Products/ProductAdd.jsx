import ProductForm from "./Form/ProductForm";
import AdminLayout from "../../dashboard/AdminLayout";
import { toast } from "react-toastify";

const AddProductPage = () => {
  const handleSuccess = () => {
    toast.success('محصول با موفقیت اضافه شد.')
  };

  return (
    <AdminLayout>
      <ProductForm productId={null} onSuccess={handleSuccess} />
    </AdminLayout>
  );
};

export default AddProductPage;
