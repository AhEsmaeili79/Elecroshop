
import Pagination from "./Components/Pagination";
import BreadCrumb from "../Header/Breadcrumb/BreadCrumb";
import AsideProduct from "./Components/Aside";
import ProductListHeader from "./Components/ProductListHeader";
import ToolBox from "./Components/Toolbox";
import ProductCardList from './Components/ProductCardList';
import useProducts from "./Components/hooks/useProducts";

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
        priceRange, // Add priceRange from the hook
        setPriceRange // Add setPriceRange to handle changes
    } = useProducts();

    // Filter products by price range
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
                                totalProducts={filteredProducts.length} // Use filteredProducts here
                                currentPage={currentPage}     
                                productsPerPage={productsPerPage}  
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                            />
                            {loading && <p>Loading...</p>}
                            {error && <p>{error}</p>}
                            <ProductCardList products={currentProducts} reviewsData={reviewsData} />
                            <Pagination
                                totalProducts={filteredProducts.length} // Use filteredProducts here
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
                            priceRange={priceRange}  // Pass priceRange to AsideProduct
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};


export default Body;
