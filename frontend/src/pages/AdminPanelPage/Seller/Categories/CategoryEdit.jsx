import CategoryForm from './Form/CategoryForm';
import AdminLayout from "../../dashboard/AdminLayout";
import { useParams } from "react-router-dom"; 
import { toast } from "react-toastify";

const EditCategoryPage = () => {
const { categoryId } = useParams(); 
  return (
    <AdminLayout>
      <CategoryForm categoryId={categoryId} onSuccess={() => toast.success("دسته بندی با موفقیت بروز شد!")} />
    </AdminLayout>
  );
};

export default EditCategoryPage;
