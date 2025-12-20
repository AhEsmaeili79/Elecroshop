from django.urls import path

from apps.users.api.v1.views import (
    PasswordUpdateView,
    UserProfileView,
    UserUpdateProfileView,
)

app_name = 'users'

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='me'),
    path('update/', UserUpdateProfileView.as_view(), name='update'),
    path('password/update/', PasswordUpdateView.as_view(), name='password-update'),
]

