import os

from django.core.asgi import get_asgi_application

# Determine settings module based on environment
settings_module = os.environ.get('DJANGO_SETTINGS_MODULE')

if not settings_module:
    # Auto-detect based on environment variables
    if os.environ.get('PRODUCTION') == 'true' or os.environ.get('DJANGO_ENV') == 'production':
        settings_module = 'config.settings.production'
    else:
        settings_module = 'config.settings.dev'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_asgi_application()
