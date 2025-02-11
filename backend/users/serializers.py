import os
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Address
User = get_user_model()

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data["password"])  
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True) 
    username = serializers.CharField(read_only=True) 
    role = serializers.CharField(read_only=True)
    profile_image = serializers.ImageField(required=False, allow_null=True)  
    
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
        profile_image = validated_data.pop('profile_image', None)
        
        if profile_image is not None:
            if instance.profile_image:
                old_image_path = instance.profile_image.path
                if os.path.exists(old_image_path):
                    os.remove(old_image_path) 

            instance.profile_image = profile_image
        else:
            current_image_name = instance.profile_image.name.split('/')[-1]
            new_image_name = validated_data.get('profile_image', '').split('/')[-1]
            if current_image_name == new_image_name:
                validated_data.pop('profile_image', None) 

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'username', 'titleAddress', 'address', 'city', 'street', 'floor', 'apartment', 'zip_code']
        read_only_fields = ['username']

    def create(self, validated_data):
        validated_data['username'] = self.context['request'].user
        return super().create(validated_data)