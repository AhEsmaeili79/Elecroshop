import ProductForm from './Form/ProductForm';
import { useParams } from "react-router-dom"; 

const EditProductPage = () => {
  const { productId } = useParams();  

  console.log(productId)
  const handleSuccess = () => {
    console.log("Product saved successfully!");
  };

  return (
    <div className="container">
      <ProductForm productId={productId} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditProductPage;
