import AppRouter from './router/AppRouter';
import { BrowserRouter as Router } from 'react-router-dom';  // Import Router
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

function App() {
  return (
    <Router>  {/* Wrap everything inside Router */}
      <CartProvider>
        <WishlistProvider>
          <AppRouter />
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
