# users/serializers.py
import os
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


# Serializer for user signup
class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Password should not be readable

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        # Create a user instance with the provided data
        user = User(**validated_data)
        user.set_password(validated_data["password"])  # Hash the password before saving
        user.save()
        return user


# Serializer for user details
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)  # Email is read-only
    username = serializers.CharField(read_only=True)  # Username is read-only
    role = serializers.CharField(read_only=True)  # Role is read-only
    profile_image = serializers.ImageField(required=False, allow_null=True)  # Make it optional
    
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "role",
            "first_name",
            "last_name",
            "profile_image",
            "phonenumber",
            "date_birth",
            "additional_information",
        ]

    def update(self, instance, validated_data):
        # Check if profile_image is being updated
        profile_image = validated_data.pop('profile_image', None)
        
        if profile_image is not None:
            # If a new profile image is provided, delete the old one
            if instance.profile_image:
                old_image_path = instance.profile_image.path
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)  # Delete the old image from the file system

            # Update with the new profile image
            instance.profile_image = profile_image
        else:
            # If no new profile image, keep the current one by not modifying it
            current_image_name = instance.profile_image.name.split('/')[-1]
            new_image_name = validated_data.get('profile_image', '').split('/')[-1]
            if current_image_name == new_image_name:
                # Do not update the profile image if the image name is the same
                validated_data.pop('profile_image', None)  # Remove profile_image from validated data

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
