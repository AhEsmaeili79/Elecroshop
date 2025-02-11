from rest_framework import serializers
from .models import RoleRequest

from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]  


class RoleRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = RoleRequest
        fields = ["id", "user", "status", "request_time", "denied_time"]
        read_only_fields = [
            "user",  
            "request_time",
            "denied_time",
        ]
