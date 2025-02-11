import { Link, useNavigate } from "react-router-dom"; 
import "./css/Wishlist.rtl.css";

const WishlistTable = ({
    wishlist = [],
    loading = false,
    error = null,
    onRemove,
    onRemoveFromCart,
    cartItems = [],
    loadingProductId = null,
}) => {
    const navigate = useNavigate(); 

    if (loading) return <div>در حال بارگذاری...</div>;
    if (error) return <div>خطا: {error.message || "مشکلی پیش آمد"}</div>;

    const isProductInCart = (productId) => {
        return cartItems.some((item) => item.product.id === productId);
    };

    function formatPrice(price) {
        const formattedPrice = price.toLocaleString();
        
        const persianNumerals = formattedPrice.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 1728));
        return persianNumerals;
    }

    return (
        <table className="table table-wishlist table-mobile">
            <thead>
                <tr>
                    <th>محصول</th>
                    <th>قیمت</th>
                    <th>وضعیت موجودی</th>
                    <th>عملیات</th>
                    <th>حذف</th>
                </tr>
            </thead>
            <tbody>
                {wishlist.length > 0 ? (
                    wishlist.map((item) => {
                        const product = item.product || {};
                        const inCart = isProductInCart(product.id);
                        const isLoading = loadingProductId === product.id;
                        const isOutOfStock = product.quantity <= 0;

                        return (
                            <tr key={product.id}>
                                <td className="product-col">
                                    <div className="product wishlist-media">
                                        <figure className="product-media">
                                            <Link to={`/product/${product.id}`}>
                                                <img
                                                    className="wishlist-media"
                                                    src={product.main_photo}
                                                    alt={product.name || "محصول"}
                                                    loading="lazy"
                                                />
                                            </Link>
                                        </figure>
                                        <h3 className="product-title wishlist-product-title">
                                            <Link to={`/product/${product.id}`}>
                                                {product.name}
                                            </Link>
                                        </h3>
                                    </div>
                                </td>
                                <td className="price-col">{formatPrice(product.price) ? `${formatPrice(product.price)} تومان` : "نامشخص"}</td>
                                <td className="stock-col">
                                    <span className={isOutOfStock ? "out-of-stock" : "in-stock"}>
                                        {isOutOfStock ? "تمام شده" : "موجود در انبار"}
                                    </span>
                                </td>
                                <td className="action-col">
                                    {isOutOfStock ? (
                                        <button className="btn btn-block btn-outline-primary-2 disabled">
                                            تمام شده
                                        </button>
                                    ) : (
                                        <button
                                            className={`btn btn-block btn-outline-primary-2 ${
                                                isLoading ? "disabled" : ""
                                            }`}
                                            onClick={() => 
                                                inCart ? onRemoveFromCart(product.id) : navigate(`/product/${product.id}`) 
                                            }
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "در حال پردازش..." : inCart ? "حذف از سبد خرید" : "مشاهده محصول"}
                                        </button>
                                    )}
                                </td>
                                <td className="remove-col">
                                    <button className="btn-remove" onClick={() => onRemove(product.id)}>
                                        <i className="icon-close"></i>
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center">
                            لیست علاقه‌مندی‌های شما خالی است
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default WishlistTable;
