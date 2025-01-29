import AppRouter from './router/AppRouter';
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
            <AppRouter />
          </WishlistProvider>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
