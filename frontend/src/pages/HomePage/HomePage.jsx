import Header from '../Header/Header';
import Body from './Body';
import { UserProvider } from '../../contexts/UserContext';
import HomePageFooter from '../Footer/HomePageFooter';

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