# ElectroShop Backend

A robust Django REST API backend for the ElectroShop e-commerce platform, providing comprehensive functionality for product management, user authentication, order processing, and more.

## 🏗️ Architecture

### Technology Stack
- **Framework**: Django 5.1.2
- **API**: Django REST Framework 3.15.2
- **Authentication**: JWT with SimpleJWT 5.3.1
- **Database**: SQLite (development) / PostgreSQL (production)
- **Image Processing**: Pillow 11.0.0
- **Localization**: Persian date/time support with django-jalali
- **CORS**: django-cors-headers for cross-origin requests

### Project Structure
```
backend/
├── core/                   # Django project settings
│   ├── settings.py        # Main settings configuration
│   ├── urls.py           # Main URL routing
│   ├── asgi.py           # ASGI configuration
│   └── wsgi.py           # WSGI configuration
├── users/                 # User management app
├── product/              # Product management app
├── category/             # Category and brand management
├── cart/                 # Shopping cart functionality
├── order/                # Order processing and management
├── reviews/              # Product reviews and ratings
├── role_request/         # Role upgrade requests
├── utils/                # Utility functions
├── manage.py             # Django management script
└── requirements.txt      # Python dependencies
```

## 🚀 Features

### User Management
- **Custom User Model**: Extended Django user with role-based permissions
- **Multi-Role System**: Customer, Seller, and Admin roles
- **JWT Authentication**: Secure token-based authentication
- **Address Management**: User address storage and management
- **Profile Management**: User profile with image upload

### Product Management
- **Product CRUD**: Complete product lifecycle management
- **Image Processing**: Automatic image resizing and optimization
- **Category Hierarchy**: Nested category system with brands and models
- **Color Management**: Product color variants with quantity tracking
- **Wishlist System**: User wishlist functionality

### Shopping Cart
- **Persistent Cart**: User-specific cart storage
- **Quantity Management**: Add, update, and remove cart items
- **Color Selection**: Product color variant selection
- **Price Calculation**: Automatic total price calculation

### Order Processing
- **Order Management**: Complete order lifecycle
- **Payment Integration**: Support for cash and credit card payments
- **Order Tracking**: Order status tracking and management
- **Shipment Pricing**: Configurable shipment cost management

### Reviews & Ratings
- **Product Reviews**: User-generated product reviews
- **Rating System**: Product rating functionality
- **Review Management**: Review moderation and management

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- pip
- virtualenv (recommended)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ElectroShop/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   DATABASE_URL=sqlite:///db.sqlite3
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server**
   ```bash
   python manage.py runserver
   ```

## 📚 API Documentation

### Authentication Endpoints

#### User Registration
```http
POST /api/users/register/
Content-Type: application/json

{
    "username": "user@example.com",
    "email": "user@example.com",
    "password": "securepassword",
    "role": "customer"
}
```

#### User Login
```http
POST /api/users/login/
Content-Type: application/json

{
    "username": "user@example.com",
    "password": "securepassword"
}
```

#### Token Refresh
```http
POST /api/users/refresh/
Content-Type: application/json

{
    "refresh": "your-refresh-token"
}
```

### Product Endpoints

#### List Products
```http
GET /api/products/
Authorization: Bearer <access-token>
```

#### Create Product (Seller/Admin)
```http
POST /api/products/
Authorization: Bearer <access-token>
Content-Type: multipart/form-data

{
    "name": "Product Name",
    "price": 1000,
    "desc": "Product description",
    "category": 1,
    "brand": 1,
    "model": 1,
    "main_photo": <file>,
    "colors": [1, 2, 3]
}
```

#### Get Product Details
```http
GET /api/products/{id}/
Authorization: Bearer <access-token>
```

#### Update Product
```http
PUT /api/products/{id}/
Authorization: Bearer <access-token>
Content-Type: multipart/form-data
```

#### Delete Product
```http
DELETE /api/products/{id}/
Authorization: Bearer <access-token>
```

### Cart Endpoints

#### Get User Cart
```http
GET /api/cart/
Authorization: Bearer <access-token>
```

#### Add Item to Cart
```http
POST /api/cart/add/
Authorization: Bearer <access-token>
Content-Type: application/json

{
    "product_id": 1,
    "color_id": 1,
    "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/update/
Authorization: Bearer <access-token>
Content-Type: application/json

{
    "cart_item_id": 1,
    "quantity": 3
}
```

#### Remove Cart Item
```http
DELETE /api/cart/remove/
Authorization: Bearer <access-token>
Content-Type: application/json

{
    "cart_item_id": 1
}
```

### Order Endpoints

#### List User Orders
```http
GET /api/orders/
Authorization: Bearer <access-token>
```

#### Create Order
```http
POST /api/orders/
Authorization: Bearer <access-token>
Content-Type: application/json

{
    "address_id": 1,
    "shipment_price_id": 1,
    "payment_type": "cash"
}
```

#### Get Order Details
```http
GET /api/orders/{id}/
Authorization: Bearer <access-token>
```

### Category Endpoints

#### List Categories
```http
GET /api/category/
Authorization: Bearer <access-token>
```

#### Create Category (Admin)
```http
POST /api/category/
Authorization: Bearer <access-token>
Content-Type: multipart/form-data

{
    "name": "Category Name",
    "image": <file>
}
```

## 🔧 Configuration

### Django Settings

Key settings in `core/settings.py`:

```python
# Authentication
AUTH_USER_MODEL = "users.CustomUser"
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
}

# REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        'rest_framework.authentication.SessionAuthentication',
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}

# CORS Configuration
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True
```

### Database Configuration

For production, update the database settings:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "your_db_name",
        "USER": "your_db_user",
        "PASSWORD": "your_db_password",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
```

## 🧪 Testing

### Running Tests
```bash
python manage.py test
```

### Running Specific App Tests
```bash
python manage.py test users
python manage.py test product
python manage.py test cart
```

## 📊 Models Overview

### User Models
- **CustomUser**: Extended user model with roles and profile fields
- **Address**: User address management

### Product Models
- **Product**: Main product model with images and metadata
- **Color**: Product color variants
- **ProductColorQuantity**: Color-specific inventory tracking
- **Wishlist**: User wishlist items

### Category Models
- **Category**: Main product categories
- **SubCategory**: Sub-categories within main categories
- **Brand**: Product brands
- **Model**: Brand-specific models

### Cart Models
- **Cart**: User shopping cart
- **CartItem**: Individual cart items with quantity

### Order Models
- **Order**: Main order information
- **OrderItem**: Individual order items
- **Payment**: Payment information and tracking
- **ShipmentPrice**: Configurable shipment costs

## 🔒 Security

### Authentication
- JWT-based authentication with refresh tokens
- Role-based access control
- Secure password validation

### Data Protection
- CSRF protection enabled
- CORS configuration for frontend integration
- Input validation and sanitization

### File Upload Security
- Image file validation
- Automatic image resizing
- Secure file storage paths

## 🚀 Deployment

### Production Checklist
1. Set `DEBUG=False` in settings
2. Configure production database
3. Set up static file serving
4. Configure CORS for production domain
5. Set secure `SECRET_KEY`
6. Configure logging
7. Set up SSL/HTTPS

### Environment Variables
```env
SECRET_KEY=your-production-secret-key
DEBUG=False
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=postgresql://user:password@localhost/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS settings match your frontend URL
2. **Image Upload Issues**: Check media directory permissions
3. **Database Migration Errors**: Run `python manage.py migrate --run-syncdb`
4. **JWT Token Issues**: Verify token expiration settings

### Logging
The application includes comprehensive logging configuration. Check console output for detailed error information.

## 📝 Contributing

1. Follow Django coding standards
2. Add tests for new features
3. Update documentation for API changes
4. Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License.
