import PropTypes from 'prop-types';
import ProductListCard from '../../components/ProductCard/ProductListCard';

const ProductCardList = ({ products, reviewsData }) => (
    <div className="products mb-3">
        <div className="row justify-content-center">
            {products.map((product) => (
                <ProductListCard key={product.id} product={product} reviewsData={reviewsData} />
            ))}
        </div>
    </div>
);

ProductCardList.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object).isRequired,
    reviewsData: PropTypes.object.isRequired,
};

export default ProductCardList;
