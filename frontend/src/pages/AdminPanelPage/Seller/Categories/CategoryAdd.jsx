import CategoryForm from './Form/CategoryForm';
import AdminLayout from "../../dashboard/AdminLayout";

const AddCategoryPage = () => {
  return (
    <AdminLayout>
      <CategoryForm onSuccess={() => console.log("Category saved!")} />
    </AdminLayout>
  );
};

export default AddCategoryPage;
