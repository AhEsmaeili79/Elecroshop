# ElectroShop Frontend

A modern, responsive React frontend for the ElectroShop e-commerce platform, built with React 19, Vite, and Bootstrap 5. Features a comprehensive user interface for browsing products, managing carts, processing orders, and administrative functions.

## 🏗️ Architecture

### Technology Stack
- **Framework**: React 19 with Vite 6.0.3
- **Routing**: React Router DOM 7.0.2
- **State Management**: React Context API
- **UI Framework**: Bootstrap 5.3.3 with custom components
- **HTTP Client**: Axios 1.7.9
- **Icons**: React Icons 5.4.0
- **Maps**: Google Maps API with React Google Maps
- **Charts**: Chart.js 4.4.7 with React Chart.js 2
- **Localization**: Persian date support with moment-jalaali
- **Notifications**: React Toastify 11.0.3

### Project Structure
```
frontend/
├── public/                  # Static assets
├── src/
│   ├── api/                # API integration layer
│   │   ├── auth.js         # Authentication API calls
│   │   ├── cartApi.js      # Cart management API
│   │   ├── admin/          # Admin-specific API calls
│   │   └── seller/         # Seller-specific API calls
│   ├── components/         # Reusable UI components
│   │   ├── Header/         # Header components
│   │   ├── ProductCard/    # Product display components
│   │   ├── Cart/           # Cart-related components
│   │   ├── Footer/         # Footer components
│   │   └── ...             # Other component categories
│   ├── pages/              # Page components
│   │   ├── HomePage/       # Home page
│   │   ├── ProductListPage/ # Product listing
│   │   ├── ProductDetailPage/ # Product details
│   │   ├── CartPage/       # Shopping cart
│   │   ├── CheckoutPage/   # Checkout process
│   │   ├── AuthPage/       # Authentication
│   │   ├── ProfilePage/    # User profile
│   │   └── AdminPanelPage/ # Admin dashboard
│   ├── contexts/           # React context providers
│   │   ├── UserContext.jsx # User state management
│   │   ├── CartContext.jsx # Cart state management
│   │   └── WishlistContext.jsx # Wishlist state
│   ├── hooks/              # Custom React hooks
│   ├── router/             # Routing configuration
│   ├── utils/              # Utility functions
│   ├── assets/             # Static assets (CSS, images, fonts)
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Application entry point
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🚀 Features

### User Interface
- **Responsive Design**: Mobile-first responsive layout
- **RTL Support**: Right-to-left language support for Persian
- **Modern UI**: Clean, modern interface with Bootstrap 5
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: User-friendly error messages and notifications

### Product Management
- **Product Browsing**: Grid and list view options
- **Product Details**: Comprehensive product information display
- **Image Gallery**: Product image carousel with zoom functionality
- **Color Selection**: Product color variant selection
- **Search & Filter**: Advanced product search and filtering
- **Pagination**: Efficient product listing pagination

### Shopping Experience
- **Shopping Cart**: Persistent cart with quantity management
- **Wishlist**: User wishlist functionality
- **Checkout Process**: Streamlined checkout with address selection
- **Order Tracking**: Order status and history
- **Payment Integration**: Support for multiple payment methods

### User Management
- **Authentication**: Login/register with JWT tokens
- **Profile Management**: User profile editing and address management
- **Role-based Access**: Different interfaces for customers, sellers, and admins
- **Session Management**: Automatic token refresh and logout

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel
- **Product Management**: CRUD operations for products
- **Order Management**: Order tracking and status updates
- **User Management**: User oversight and role management
- **Analytics**: Sales and user analytics with charts

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Modern web browser

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ElectroShop/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 📚 Component Documentation

### Core Components

#### Header Components
- **Header.jsx**: Main navigation header
- **HeaderTop.jsx**: Top header with user menu
- **HeaderMiddle.jsx**: Middle header with search
- **HeaderBottom.jsx**: Bottom header with categories
- **CartHeader.jsx**: Cart-specific header

#### Product Components
- **ProductCard.jsx**: Product card for listings
- **ProductListCard.jsx**: Product card for list view
- **ProductDetail.jsx**: Detailed product view
- **ProductImages.jsx**: Product image gallery

#### Cart Components
- **CartPage.jsx**: Main cart page
- **CartItem.jsx**: Individual cart item
- **CartSummary.jsx**: Cart totals and checkout

#### Form Components
- **AuthForm.jsx**: Authentication forms
- **CheckoutForm.jsx**: Checkout process forms
- **ProfileForm.jsx**: Profile editing forms

### Page Components

#### Main Pages
- **HomePage.jsx**: Landing page with featured products
- **ProductListPage.jsx**: Product catalog with filters
- **ProductDetailPage.jsx**: Individual product page
- **CartPage.jsx**: Shopping cart management
- **CheckoutPage.jsx**: Order checkout process

#### User Pages
- **AuthPage.jsx**: Login and registration
- **ProfilePage.jsx**: User profile management
- **OrderListPage.jsx**: User order history
- **OrderDetailPage.jsx**: Individual order details

#### Admin Pages
- **AdminDashboard.jsx**: Admin dashboard
- **RoleRequestPage.jsx**: Role request management
- **SellerDashboard.jsx**: Seller-specific dashboard

## 🔧 Configuration

### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

### API Configuration
```javascript
// src/api/config.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### Context Providers
```javascript
// src/App.jsx
import { UserProvider } from './contexts/UserContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <AppRouter />
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  )
}
```

## 🎨 Styling

### CSS Architecture
- **Bootstrap 5**: Base framework for responsive design
- **Custom CSS**: Component-specific styles
- **RTL Support**: Persian language support with RTL CSS
- **Responsive Design**: Mobile-first approach

### Key CSS Files
- `src/assets/css/main.min.css`: Main Bootstrap styles
- `src/assets/css/bootstrap.min.rtl.css`: RTL Bootstrap styles
- Component-specific CSS files in respective component folders

### Styling Guidelines
1. Use Bootstrap classes for layout and spacing
2. Create custom CSS for component-specific styling
3. Follow mobile-first responsive design
4. Support both LTR and RTL layouts
5. Use CSS variables for consistent theming

## 🔄 State Management

### Context API Usage
```javascript
// User Context
const { user, login, logout, updateProfile } = useContext(UserContext)

// Cart Context
const { cart, addToCart, removeFromCart, updateQuantity } = useContext(CartContext)

// Wishlist Context
const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext)
```

### Local Storage
- User authentication tokens
- Cart data persistence
- User preferences
- Theme settings

## 🧪 Testing

### Running Tests
```bash
npm run test
# or
yarn test
```

### Testing Guidelines
1. Test component rendering
2. Test user interactions
3. Test API integration
4. Test responsive behavior
5. Test accessibility features

## 🚀 Performance Optimization

### Code Splitting
- Route-based code splitting with React Router
- Lazy loading of components
- Dynamic imports for heavy components

### Image Optimization
- Responsive images with srcset
- Lazy loading for product images
- Image compression and optimization

### Bundle Optimization
- Tree shaking for unused code
- Minification for production builds
- Gzip compression for static assets

## 🔒 Security

### Authentication
- JWT token management
- Automatic token refresh
- Secure token storage
- Logout functionality

### Data Protection
- Input validation
- XSS prevention
- CSRF protection
- Secure API communication

## 🌐 Internationalization

### RTL Support
- Persian language support
- RTL layout components
- RTL-specific styling
- Date/time localization

### Localization Features
- Persian date formatting
- RTL text direction
- Cultural adaptations
- Currency formatting

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS settings match frontend URL
2. **API Connection Issues**: Check API base URL configuration
3. **Build Errors**: Clear node_modules and reinstall dependencies
4. **RTL Layout Issues**: Verify RTL CSS imports and component structure

### Development Tips
1. Use React Developer Tools for debugging
2. Check browser console for errors
3. Verify API responses in Network tab
4. Test responsive design across devices

## 📝 Contributing

### Development Guidelines
1. Follow React best practices
2. Use functional components with hooks
3. Implement proper error handling
4. Add loading states for async operations
5. Test components across different screen sizes

### Code Style
- Use ESLint for code linting
- Follow consistent naming conventions
- Add proper JSDoc comments
- Use TypeScript for type safety (future enhancement)

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the component documentation
- Review the API integration examples
- Test with the provided sample data
- Create an issue in the repository
