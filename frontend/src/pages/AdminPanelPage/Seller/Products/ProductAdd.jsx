import ProductForm from "./Form/ProductForm";
import AdminLayout from "../../dashboard/AdminLayout";

const AddProductPage = () => {
  const handleSuccess = () => {
    alert("Product saved successfully!");
    window.location.reload();
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
