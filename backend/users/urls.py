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
    # Endpoint for user login (token generation)
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # Endpoint for refreshing access tokens
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Endpoint to get user details (authenticated user)
    path("me/", UserDetailView.as_view(), name="user_detail"),
    # Endpoint for user logout (invalidating the refresh token)
    path("logout/", LogoutView.as_view(), name="logout"),
    # Duplicate signup path removed (it's already defined above)
    # path("signup/", SignupView.as_view(), name="signup"),  # This line is redundant
    # Endpoint to retrieve and update user profile information
    path("user/", UserProfileView.as_view(), name="update-user"),
    path('', include(router.urls)),
    path('login/admin/', LoginView.as_view(), name='login'),
]
