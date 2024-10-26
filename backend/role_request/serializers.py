# role_request/serializers.py
from rest_framework import serializers
from .models import RoleRequest

from django.contrib.auth import get_user_model

User = get_user_model()


# show user infromation
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]  # Specify the fields you want to include


# show requests information
class RoleRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Use the nested user serializer

    class Meta:
        model = RoleRequest
        fields = [
            "id",
            "user",
            "status",
            "request_time",
        ]
        read_only_fields = [
            "user",  # Make sure user is read-only
            "request_time",
        ]
