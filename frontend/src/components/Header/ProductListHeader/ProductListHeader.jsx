import HeaderImg from '../../../assets/images/page-header-bg.jpg';

const ProductListHeader = ({ categoryName }) => {
    return (
        <div className="page-header text-center" style={{ backgroundImage: `url(${HeaderImg})` }}>
            <div className="container">
                <h1 className="page-title">
                {categoryName ? `${categoryName} دسته‌بندی` : 'محصولات '}<span>لیست</span>
                </h1>
            </div>
        </div>
    );
};

export default ProductListHeader;
