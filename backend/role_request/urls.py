# role_request/urls.py
from django.urls import path
from .views import RoleRequestCreateView, RoleRequestListView, RoleRequestUpdateView

urlpatterns = [
    path("request/", RoleRequestCreateView.as_view(), name="create_role_request"),
    path("requests/", RoleRequestListView.as_view(), name="list_role_requests"),
    path(
        "request/<int:pk>/", RoleRequestUpdateView.as_view(), name="update_role_request"
    ),
]
