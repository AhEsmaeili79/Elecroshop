import wishlistHeader from '../../../assets/images/page-header-bg.jpg'

const WishlistHeader = () => {
    return (
        <div className="page-header text-center" style={{ backgroundImage: `url(${wishlistHeader})` }}>
            <div className="container">
                <h1 className="page-title">علاقه مندی ها<span>فروشگاه</span></h1>
            </div>
        </div>
    );
};

export default WishlistHeader;
