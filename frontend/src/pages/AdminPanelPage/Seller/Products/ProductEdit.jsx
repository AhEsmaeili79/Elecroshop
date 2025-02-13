import AdminLayout from '../../dashboard/AdminLayout';
import ProductForm from './Form/ProductForm';
import { useParams } from "react-router-dom"; 

const EditProductPage = () => {
  const { productId } = useParams();  


  return (
    <AdminLayout>
      <ProductForm productId={productId} />
    </AdminLayout>
  );
};

export default EditProductPage;
