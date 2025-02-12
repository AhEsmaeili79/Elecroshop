import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BreadCrumb from '../../components/Breadcrumb/BreadCrumb';
import ProductTopPage from "../../pages/ProductDetailPage/ProductDetailTop/ProductTopPage";
import ProductTabs from "./ProductDetailBottom/ProductTabs";
const Body = () => {
    const { productId } = useParams();  

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId]);

    return (
        <>
            <main className="main">
                <BreadCrumb />
                <div className="page-content">
                    <div className="container">
                        <ProductTopPage productId={productId} />
                        <ProductTabs productId={productId} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Body;
