from django.urls import path
from .views import (
    RoleRequestCreateView,
    RoleRequestListView,
    RoleRequestUpdateView,
    UserRoleRequestView,
    UserRoleRequestStatusView,
    RoleRequestDeleteView,
)

urlpatterns = [
    path("request/", RoleRequestCreateView.as_view(), name="create_role_request"),
    path("requests/", RoleRequestListView.as_view(), name="list_role_requests"),
    path(
        "request/<int:pk>/", RoleRequestUpdateView.as_view(), name="update_role_request"
    ),
    path(
        "request/user/", UserRoleRequestView.as_view(), name="user_role_request"
    ),  
    path(
        "request/status/",
        UserRoleRequestStatusView.as_view(),
        name="role_request_status",
    ),
    path(
        "request/<int:pk>/delete/",
        RoleRequestDeleteView.as_view(),
        name="role-request-delete",
    ),
]
