# Development Dockerfile with hot reload support
FROM python:3.13-alpine

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    cargo \
    rust \
    libpq \
    postgresql-client \
    && pip install --no-cache-dir --upgrade pip

# Set environment variables for development
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings

# Set work directory
WORKDIR /app

# Copy requirements and install Python dependencies (dev requirements)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create logs and staticfiles directories
RUN mkdir -p /app/logs /app/staticfiles && \
    chmod 775 /app/logs /app/staticfiles

# Expose port
EXPOSE 8000

# Default command (will be overridden by docker-compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
