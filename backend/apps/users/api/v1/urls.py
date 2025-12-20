from django.urls import path

from apps.users.api.v1.views import (
    UserProfileView,
    UserUpdateProfileView,
)

app_name = 'users'

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='me'),
    path('update/', UserUpdateProfileView.as_view(), name='update'),
]

