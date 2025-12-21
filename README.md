# ElectroShop - E-commerce Platform

A modern, full-stack e-commerce platform built with Django REST Framework backend and React frontend, featuring a comprehensive online shopping experience with multi-role user management, product management, cart functionality, and order processing.

## 🚀 Features

### Core E-commerce Features
- **Product Management**: Complete CRUD operations for products with image handling
- **Category & Brand Management**: Hierarchical category system with brands and models
- **Shopping Cart**: Persistent cart functionality with quantity management
- **Wishlist**: User wishlist management
- **Order Processing**: Complete order lifecycle from cart to delivery
- **Payment Integration**: Support for cash and credit card payments
- **User Reviews**: Product review and rating system

### User Management
- **Multi-Role System**: Customer, Seller, and Admin roles
- **Role Request System**: Users can request role upgrades
- **Profile Management**: User profiles with address management
- **Authentication**: JWT-based authentication with refresh tokens

### Admin Features
- **Admin Dashboard**: Comprehensive admin panel for managing the platform
- **Seller Management**: Tools for sellers to manage their products
- **Order Management**: Complete order tracking and management
- **User Management**: Admin tools for user oversight

### Technical Features
- **Responsive Design**: Mobile-first responsive UI
- **RTL Support**: Right-to-left language support (Persian)
- **Image Optimization**: Automatic image resizing and optimization
- **API Documentation**: RESTful API with comprehensive endpoints
- **Real-time Updates**: Dynamic cart and wishlist updates

## 🏗️ Architecture

### Backend (Django)
- **Framework**: Django 6.0 with Django REST Framework
- **Database**: PostgreSQL (Dockerized)
- **Authentication**: JWT with SimpleJWT
- **File Handling**: Pillow for image processing
- **Localization**: Persian date/time support
- **Containerization**: Docker & Docker Compose

### Frontend (React)
- **Framework**: React 19 with Vite
- **Routing**: React Router DOM
- **State Management**: React Context API
- **UI Components**: Bootstrap 5 with custom components
- **HTTP Client**: Axios for API communication
- **Maps Integration**: Google Maps API
- **Charts**: Chart.js for analytics

## 📁 Project Structure

```
ElectroShop/
├── backend/                 # Django REST API
│   ├── core/               # Django settings and configuration
│   ├── users/              # User management and authentication
│   ├── product/            # Product management
│   ├── category/           # Category and brand management
│   ├── cart/               # Shopping cart functionality
│   ├── order/              # Order processing and management
│   ├── reviews/            # Product reviews and ratings
│   ├── role_request/       # Role upgrade requests
│   └── utils/              # Utility functions
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React context providers
│   │   ├── api/            # API integration
│   │   ├── hooks/          # Custom React hooks
│   │   └── router/         # Routing configuration
│   └── public/             # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Docker and Docker Compose installed
- OR Python 3.8+ and Node.js 16+ for local development

### Docker Setup (Recommended)

1. **Create a `.env` file** in the `backend` directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_DB=electroshop
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_NAME=electroshop
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
```

2. **Build and run with Docker Compose**:
```bash
cd backend
docker-compose up --build
```

The application will be available at `http://localhost:8000`

**Useful Docker Commands**:
```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build

# Access Django shell
docker-compose exec web python manage.py shell

# Create superuser
docker-compose exec web python manage.py createsuperuser
```

### Local Development Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (for local development)
If running locally without Docker, create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
DB_NAME=electroshop
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

## 🚀 Usage

### Development
1. Start the backend server: `python manage.py runserver`
2. Start the frontend development server: `npm run dev`
3. Access the application at `http://localhost:3000`
4. Access the admin panel at `http://localhost:8000/admin`

### Production
1. Set `DEBUG=False` in your `.env` file
2. Use strong `SECRET_KEY` and secure `POSTGRES_PASSWORD`
3. Configure production database settings
4. Set up static file serving (or use a CDN)
5. Configure CORS settings for your domain in `.env`
6. Build the frontend: `npm run build`
7. Use `docker-compose -f docker-compose.prod.yml up -d` for production (if you create a production compose file)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/users/login/` - User login
- `POST /api/users/register/` - User registration
- `POST /api/users/refresh/` - Refresh JWT token

### Product Endpoints
- `GET /api/products/` - List all products
- `POST /api/products/` - Create new product (Seller/Admin)
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product (Seller/Admin)
- `DELETE /api/products/{id}/` - Delete product (Seller/Admin)

### Cart Endpoints
- `GET /api/cart/` - Get user cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/` - Update cart item quantity
- `DELETE /api/cart/remove/` - Remove item from cart

### Order Endpoints
- `GET /api/orders/` - List user orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details

## 🎨 UI Components

The frontend includes a comprehensive set of reusable components:
- **Header Components**: Navigation, cart, user menu
- **Product Components**: Product cards, product lists, product details
- **Form Components**: Authentication forms, checkout forms
- **Layout Components**: Responsive layouts, sidebars, modals
- **Utility Components**: Loading spinners, pagination, breadcrumbs

## 🔧 Customization

### Adding New Features
1. Create Django models in appropriate apps
2. Add serializers for API endpoints
3. Create views and URL patterns
4. Add React components for frontend
5. Update routing configuration

### Styling
- Bootstrap 5 is used as the base framework
- Custom CSS files are in `src/assets/css/`
- RTL support is included for Persian language

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the backend and frontend README files
- Review the API endpoints and component documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] Inventory management
- [ ] Analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced payment gateways
- [ ] Social media integration
