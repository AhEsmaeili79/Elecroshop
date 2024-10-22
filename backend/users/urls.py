from django.urls import path, include
from .views import UserProfileUpdateView

urlpatterns = [
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("profile/", UserProfileUpdateView.as_view(), name="user-profile-update"),
]
