# role_request/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import RoleRequest
from .serializers import RoleRequestSerializer
from django.contrib.auth import get_user_model
from rest_framework import status
from .permissions import IsAdminOrSuperUser

User = get_user_model()


class RoleRequestCreateView(generics.CreateAPIView):
    queryset = RoleRequest.objects.all()
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Save the current user

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoleRequestListView(generics.ListAPIView):
    queryset = RoleRequest.objects.all()
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAdminUser]

    User = get_user_model()
    user = User.objects.get(username="amirhossein")  # replace with the admin username
    print(user.is_superuser, user.is_staff)  # Only admin can access this view


import logging

logger = logging.getLogger(__name__)


class RoleRequestUpdateView(generics.UpdateAPIView):
    queryset = RoleRequest.objects.all()
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAdminUser]  # Ensure this is set

    def patch(self, request, *args, **kwargs):
        request_instance = self.get_object()  # Retrieve the role request instance
        status = request.data.get("status")  # Get the status from request data

        if status not in ["approved", "denied"]:
            return Response({"error": "Invalid status"}, status=400)

        request_instance.status = status

        if status == "approved":
            user = request_instance.user  # Get the user associated with the request
            user.role = "seller"  # Update the user's role
            user.save()  # Save the user

        request_instance.save()  # Save the role request instance
        return Response({"message": "Status updated successfully"}, status=200)
