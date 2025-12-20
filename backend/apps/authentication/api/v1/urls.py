from django.urls import path

from apps.authentication.api.v1.views import (
    LoginView,
    LogoutView,
    TokenRefreshView,
    UserProfileView,
    RegisterView,
)

app_name = 'authentication'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('me/', UserProfileView.as_view(), name='me'),
]

