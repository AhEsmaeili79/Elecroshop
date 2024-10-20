from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, UserProfileView

router = DefaultRouter()
router.register(r"users", CustomUserViewSet)

urlpatterns = [
    path("", include(router.urls)),  # Include user-related routes
    path("profile/", UserProfileView.as_view(), name="user-profile"),
]
