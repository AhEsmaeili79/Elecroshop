import CategoryForm from './Form/CategoryForm';
import AdminLayout from "../../dashboard/AdminLayout";
import { useParams } from "react-router-dom"; 

const EditCategoryPage = () => {
const { categoryId } = useParams(); 
  return (
    <AdminLayout>
      <CategoryForm categoryId={categoryId} onSuccess={() => console.log("Category updated!")} />
    </AdminLayout>
  );
};

export default EditCategoryPage;
