# users/urls.py

from django.urls import path,include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  # View to obtain access and refresh tokens
    TokenRefreshView,  # View to refresh access tokens
)
from .views import SignupView, UserDetailView, LogoutView, UserProfileView,AddressViewSet,LoginView

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')


urlpatterns = [
    # Endpoint for user signup
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", UserDetailView.as_view(), name="user_detail"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("user/", UserProfileView.as_view(), name="update-user"),
    path('', include(router.urls)),
    path('login/admin/', LoginView.as_view(), name='login'),
]
