import HeaderImg from '../../../../assets/images/page-header-bg.jpg';

const UserDetailHeader = () => {
    return (
        <div className="page-header text-center" style={{ backgroundImage: `url(${HeaderImg})` }}>
            <div className="container">
                <h1 className="page-title">My Account<span>Shop</span></h1>
            </div>
        </div>
    );
};

export default UserDetailHeader;
