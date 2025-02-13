import ProductForm from "./Form/ProductForm";
import AdminLayout from "../../dashboard/AdminLayout";

const AddProductPage = () => {
 

  return (
    <AdminLayout>
      <ProductForm productId={null}  />
    </AdminLayout>
  );
};

export default AddProductPage;
