# role_request/views.py
from django.utils import timezone
from datetime import timedelta
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
        # Check for existing request (either pending or canceled)
        existing_request = (
            RoleRequest.objects.filter(user=request.user)
            .order_by("-request_time")
            .first()
        )

        if existing_request:
            # Check if the existing request is canceled and if it's been less than an hour
            if existing_request.status == "canceled":
                time_since_cancellation = (
                    timezone.now() - existing_request.canceled_time
                )
                if time_since_cancellation < timezone.timedelta(hours=1):
                    return Response(
                        {
                            "error": "You can only send a new request after one hour from cancellation."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)  # This should save the user correctly
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoleRequestListView(generics.ListAPIView):
    queryset = RoleRequest.objects.all()
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAdminUser]


class RoleRequestUpdateView(generics.UpdateAPIView):
    queryset = RoleRequest.objects.all()
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        request_instance = self.get_object()
        status = request.data.get("status")

        if status not in ["approved", "denied"]:
            return Response({"error": "Invalid status"}, status=400)

        # Update the status of the role request instance
        request_instance.status = status

        if status == "approved":
            user = request_instance.user  # Get the user associated with the request
            user.role = "seller"  # Change the user's role to 'seller'
            user.save()  # Save the user with the updated role
        elif status == "denied":
            request_instance.denied_time = timezone.now()  # Set the denied time

        request_instance.save()
        return Response({"message": "Status updated successfully"}, status=200)


class RoleRequestCancelView(generics.UpdateAPIView):
    queryset = RoleRequest.objects.all()
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        # Retrieve the role request instance based on the provided ID in the URL
        request_instance = self.get_object()

        # Ensure the request belongs to the current authenticated user
        if request_instance.user != request.user:
            return Response(
                {"error": "You are not authorized to cancel this request."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Check if the user can cancel their request
        if request_instance.status == "pending":
            request_instance.status = "canceled"
            request_instance.canceled_time = (
                timezone.now()
            )  # Track when the request was canceled
            request_instance.save()

            return Response(
                {"message": "Role request canceled successfully."},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Only pending requests can be canceled."},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UserRoleRequestView(generics.RetrieveAPIView):
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Get the user's role request
        try:
            return RoleRequest.objects.get(user=self.request.user)
        except RoleRequest.DoesNotExist:
            return None  # Handle the case where the user does not have a request


class UserRoleRequestStatusView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Fetch the latest request for the current user
        latest_request = (
            RoleRequest.objects.filter(user=request.user)
            .order_by("-request_time")
            .first()
        )

        if not latest_request:
            return Response(
                {"status": None, "can_request_again": True, "request_id": None}
            )

        # Determine if the user can send a new request (24-hour rule)
        time_since_last_request = timezone.now() - latest_request.request_time
        can_request_again = (
            latest_request.status == "denied"
            and time_since_last_request.total_seconds() > 86400
        )

        # Build response data
        return Response(
            {
                "status": latest_request.status,
                "request_time": latest_request.request_time,
                "can_request_again": can_request_again,
                "request_id": latest_request.id,
            }
        )
