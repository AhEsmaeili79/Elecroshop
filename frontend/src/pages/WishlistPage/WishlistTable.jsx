import { Link, useNavigate } from 'react-router-dom';
import "./css/Wishlist.css";

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
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Check if product is already in the cart
    const isProductInCart = (productId) => {
        return cartItems.some((item) => item.product.id === productId);
    };
    const navigate = useNavigate();
    return (
        <table className="table table-wishlist table-mobile">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Stock Status</th>
                    <th>Action</th>
                    <th>Remove</th>
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
                        <td className="price-col">${item.product.price}</td>
                        <td className="stock-col">
                            <span className={item.product.quantity > 0 ? "in-stock" : "out-of-stock"}>
                                {item.product.quantity > 0 ? "In stock" : "Out of stock"}
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
                                        ? "Processing..."
                                        : isProductInCart(item.product.id)
                                        ? "Remove from Cart"
                                        : "Add to Cart"}
                                </button>
                            ) : (
                                <button className="btn btn-block btn-outline-primary-2 disabled">Out of Stock</button>
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
