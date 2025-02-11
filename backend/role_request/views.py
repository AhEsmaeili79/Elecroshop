from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import RoleRequest
from .serializers import RoleRequestSerializer
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

class RoleRequestCreateView(generics.CreateAPIView):
    queryset = RoleRequest.objects.all()
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        latest_request = (
            RoleRequest.objects.filter(user=request.user)
            .order_by("-request_time")
            .first()
        )

        if latest_request:
            time_since_last_request = timezone.now() - latest_request.request_time
            if time_since_last_request < timedelta(hours=24):
                return Response(
                    {"error": "You can only submit a new request once every 24 hours."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                latest_request.delete()

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
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

        request_instance.status = status

        if status == "approved":
            user = request_instance.user 
            user.role = "seller"  
            user.save()
        elif status == "denied":
            request_instance.denied_time = timezone.now()  

        request_instance.save()
        return Response({"message": "Status updated successfully"}, status=200)


class UserRoleRequestView(generics.RetrieveAPIView):
    serializer_class = RoleRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return RoleRequest.objects.get(user=self.request.user)
        except RoleRequest.DoesNotExist:
            return None 


class UserRoleRequestStatusView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        latest_request = (
            RoleRequest.objects.filter(user=request.user)
            .order_by("-request_time")
            .first()
        )

        if not latest_request:
            return Response(
                {"status": None, "can_request_again": True, "request_id": None}
            )

        time_since_last_request = timezone.now() - latest_request.request_time
        can_request_again = (
            latest_request.status == "denied"
            and time_since_last_request.total_seconds() > 86400
        )

        return Response(
            {
                "status": latest_request.status,
                "request_time": latest_request.request_time,
                "can_request_again": can_request_again,
                "request_id": latest_request.id,
                "denied_time": latest_request.denied_time,
            }
        )


class RoleRequestDeleteView(generics.DestroyAPIView):
    queryset = RoleRequest.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        request_instance = self.get_object()

        if request_instance.user != request.user:
            return Response(
                {"error": "You are not authorized to Cancel this request."},
                status=status.HTTP_403_FORBIDDEN,
            )

        request_instance.delete()
        return Response(
            {"message": "Role request Canceled successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
