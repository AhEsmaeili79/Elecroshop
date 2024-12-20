import Header from '../../components/Header/Header';
import Body from './Body';
import { UserProvider } from '../../contexts/UserContext';
import HomePageFooter from '../../components/Footer/HomePageFooter';

const HomePage = () => {
    return (
        <>
      <UserProvider>
        <Header />
        <Body />
        <HomePageFooter />
      </UserProvider>
    </>
    );
};

export default HomePage;