import HeaderSection from '../../components/Header/HeaderMiddle/HeaderSection.jsx';
import Body from './Body';
import Footer from '../../components/Footer/Footer.jsx';
import { UserProvider } from '../../contexts/UserContext.jsx';

const Checkout = () => {
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

export default Checkout;