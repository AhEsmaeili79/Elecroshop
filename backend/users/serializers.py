# users/serializers.py
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from users.models import CustomUser


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = CustomUser
        fields = ("id", "email", "username", "password")


from rest_framework import serializers
from .models import CustomUser


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "username",
            "email",
            "phonenumber",
            "date_birth",
            "address",
            "city",
            "street",
            "floor",
            "apartment",
            "zip_code",
            "profile_image",
            "additional_information",
        ]
        extra_kwargs = {
            "username": {
                "read_only": True
            },  # Username should be read-only if you don't want to allow changes
            "email": {"required": True},  # Ensure email is always required
        }
