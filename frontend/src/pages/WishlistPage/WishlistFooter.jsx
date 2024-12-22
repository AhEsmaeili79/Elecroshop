const WishlistFooter = () => {
    return (
        <div className="wishlist-share">
            <div className="social-icons social-icons-sm mb-2">
                <label className="social-label">اشتراک گذاری در:</label>
                <a href="#" className="social-icon" title="Facebook" target="_blank">
                    <i className="icon-facebook-f"></i>
                </a>
                <a href="#" className="social-icon" title="Twitter" target="_blank">
                    <i className="icon-twitter"></i>
                </a>
                <a href="#" className="social-icon" title="Instagram" target="_blank">
                    <i className="icon-instagram"></i>
                </a>
                <a href="#" className="social-icon" title="Youtube" target="_blank">
                    <i className="icon-youtube"></i>
                </a>
                <a href="#" className="social-icon" title="Pinterest" target="_blank">
                    <i className="icon-pinterest"></i>
                </a>
            </div>
        </div>
    );
};

export default WishlistFooter;
