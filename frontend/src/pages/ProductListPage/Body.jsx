import { FaSpinner } from "react-icons/fa"; 
import Pagination from "../../components/Pagination/Pagination";
import BreadCrumb from "../../components/Breadcrumb/BreadCrumb";
import AsideProduct from "../../components/Aside/Aside";
import ProductListHeader from "../../components/Header/ProductListHeader/ProductListHeader";
import ToolBox from "../../components/Toolbox/Toolbox";
import ProductCardList from "./ProductCardList";
import useProducts from "../../hooks/useProducts";

const Body = () => {
    const { 
        products, 
        loading, 
        error, 
        currentPage, 
        productsPerPage, 
        setCurrentPage, 
        setSelectedCategory, 
        setSelectedBrand, 
        setSelectedColor, 
        sortBy, 
        setSortBy, 
        reviewsData, 
        categoryName, 
        priceRange,
        setPriceRange
    } = useProducts();

    const filteredProducts = products.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <main className="main">
            <ProductListHeader categoryName={categoryName} />
            <BreadCrumb categoryName={categoryName}/>
            <div className="page-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9">
                            <ToolBox
                                totalProducts={filteredProducts.length}
                                currentPage={currentPage}     
                                productsPerPage={productsPerPage}  
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                            />
                            {loading && (
                                <div className="spinner-container">
                                    <FaSpinner className="spinner-icon" />
                                </div>
                            )}
                            {error && <p>{error}</p>}
                            {currentProducts.length === 0 ? (
                                <p>هیچ محصولی مطابق با فیلتر شما وجود ندارد</p>
                            ) : (
                                <ProductCardList products={currentProducts} reviewsData={reviewsData} />
                            )}
                            <Pagination
                                totalProducts={filteredProducts.length} 
                                productsPerPage={productsPerPage}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        </div>
                        <AsideProduct 
                            setSelectedCategory={setSelectedCategory} 
                            setSelectedBrand={setSelectedBrand} 
                            setSelectedColor={setSelectedColor} 
                            CategoryFiltered={categoryName} 
                            setPriceRange={setPriceRange} 
                            priceRange={priceRange}  
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Body;
