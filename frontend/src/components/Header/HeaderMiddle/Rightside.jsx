import Cart from '../HeaderHomePage/Cart';
import SearchToggle from '../HeaderHomePage/SearchToggle';
import Wishlist from '../HeaderHomePage/Wishlist';

const RightSide = () => (
  <div className="header-right">
    <SearchToggle />
    <Wishlist/>
    <Cart/>
  </div>
);


export default RightSide;
