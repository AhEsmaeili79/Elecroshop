import HeaderSection from '../../components/Header/HeaderMiddle/HeaderSection';
import Body from './Body';
import Footer from '../../components/Footer/Footer';
import { UserProvider } from '../../contexts/UserContext';

const WishlistPage = () => {
    return (
        <>
      <UserProvider>
        <HeaderSection/>
        <Body/>
        <Footer />
      </UserProvider>
    </>
    );
};

export default WishlistPage;