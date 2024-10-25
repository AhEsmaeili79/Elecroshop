# users/serializers.py
from enum import unique
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data["password"])  # Hash the password
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "profile_image",
            "phonenumber",
            "date_birth",
            "address",
            "city",
            "street",
            "floor",
            "apartment",
            "role",
            "zip_code",
            "additional_information",
        ]


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)
    username = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "role",
            "first_name",
            "last_name",
            "profile_image",
            "phonenumber",
            "date_birth",
            "address",
            "city",
            "street",
            "floor",
            "apartment",
            "zip_code",
            "additional_information",
        ]
