import AppRouter from './router/AppRouter';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <WishlistProvider>
          <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop rtl={true} closeOnClick pauseOnHover theme="light" limit={1}/>
            <AppRouter />
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
