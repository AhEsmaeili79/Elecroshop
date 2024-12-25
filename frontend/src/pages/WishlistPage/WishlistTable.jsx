import { Link, useNavigate } from 'react-router-dom';
import "./css/Wishlist.rtl.css";

const WishlistTable = ({
    wishlist,
    loading,
    error,
    onRemove,
    onAddToCart,
    onRemoveFromCart,
    cartItems,
    loadingProductId,
}) => {
    if (loading) return <div>در حال بارگذاری...</div>;
    if (error) return <div>خطا: {error}</div>;

    // Check if product is already in the cart
    const isProductInCart = (productId) => {
        return cartItems.some((item) => item.product.id === productId);
    };
    const navigate = useNavigate();
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
                {wishlist.map((item) => (
                    <tr key={item.product.id}>
                        <td className="product-col">
                            <div className="product wishlist-media">
                                <figure className="product-media">
                                    <Link to={`/product/${item.product.id}`}>
                                        <img
                                            className="wishlist-media"
                                            src={item.product.main_photo}
                                            alt={item.product.name}
                                        />
                                    </Link>
                                </figure>
                                <h3 className="product-title">
                                    <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                                </h3>
                            </div>
                        </td>
                        <td className="price-col">{item.product.price} تومان</td>
                        <td className="stock-col">
                            <span className={item.product.quantity > 0 ? "in-stock" : "out-of-stock"}>
                                {item.product.quantity > 0 ? "موجود در انبار" : "تمام شده"}
                            </span>
                        </td>
                        <td className="action-col">
                            {item.product.quantity > 0 ? (
                                <button
                                    className={`btn btn-block btn-outline-primary-2 ${loadingProductId === item.product.id ? "disabled" : ""}`}
                                    onClick={() =>
                                        isProductInCart(item.product.id)
                                            ? onRemoveFromCart(item.product.id)
                                            : navigate(`/product/${item.product.id}`)
                                    }
                                    disabled={loadingProductId === item.product.id}
                                >
                                    {loadingProductId === item.product.id
                                        ? "در حال پردازش..."
                                        : isProductInCart(item.product.id)
                                        ? "حذف از سبد خرید"
                                        : "افزودن به سبد خرید"}
                                </button>
                            ) : (
                                <button className="btn btn-block btn-outline-primary-2 disabled">تمام شده</button>
                            )}
                        </td>
                        <td className="remove-col">
                            <button className="btn-remove" onClick={() => onRemove(item.product.id)}>
                                <i className="icon-close"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default WishlistTable;
