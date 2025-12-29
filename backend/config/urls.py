from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
]

# Include Silk only in development
if getattr(settings, 'DEVELOPMENT', False):
    urlpatterns.append(path('silk/', include('silk.urls', namespace='silk')))

# API URLs
urlpatterns += [
    path('api/auth/', include('apps.authentication.api.v1.urls')),
    path('api/users/', include('apps.users.api.v1.urls')),
    path('api/products/', include('apps.products.api.v1.urls')),
    # OpenAPI Schema
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    # Swagger UI
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # ReDoc
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
