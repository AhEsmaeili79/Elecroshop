import CategoryForm from './Form/CategoryForm';
import AdminLayout from "../../dashboard/AdminLayout";
import { toast } from "react-toastify";

const AddCategoryPage = () => {
  return (
    <AdminLayout>
      <CategoryForm onSuccess={() => toast.success("دسته بندی جدید با موفقیت اضافه شد")} />
    </AdminLayout>
  );
};

export default AddCategoryPage;
