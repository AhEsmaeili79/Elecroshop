# ElectroShop Backend

Django REST API backend for ElectroShop e-commerce platform with ASGI support.

## Architecture

- **Development**: WSGI with Django runserver
- **Production**: ASGI with Granian server + Nginx

## Settings Structure

- `config/settings/dev.py` - Development settings (WSGI, debug tools)
- `config/settings/productions.py` - Production settings (ASGI, optimized)

## Development Setup

```bash
# Start development environment
docker-compose up -d

# Access at http://localhost:8090
```

## Production Setup

1. Create production environment file:
   ```bash
   cp .env.prod.example .env.prod
   # Edit .env.prod with your production values
   ```

2. Build and deploy:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Production Environment Variables

Required for production:
- `SECRET_KEY` - Django secret key
- `POSTGRES_PASSWORD` - Database password
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts
- `PRODUCTION=true` - Enables production settings

## Services

### Development
- Django (WSGI) on port 8000
- Nginx proxy on port 8090
- PostgreSQL on port 5436
- Redis on port 6380

### Production
- Granian (ASGI) on port 8000
- Nginx on ports 80/443
- PostgreSQL on port 5432
- Redis on port 6379
- Celery worker for background tasks

## Performance Features

- ASGI with Granian for high concurrency
- Nginx with optimized configuration
- Redis caching and session storage
- Connection pooling
- Gzip compression
- Rate limiting
- Static file serving
