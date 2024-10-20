from django.shortcuts import render

# Create your views here.
from djoser.views import UserViewSet
from .models import CustomUser
from .serializers import CustomUserCreateSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


class CustomUserViewSet(UserViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserCreateSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "phonenumber": user.phonenumber,
                "date_birth": user.date_birth,
                "address": user.address,
                "city": user.city,
                "street": user.street,
                "floor": user.floor,
                "apartment": user.apartment,
                "zip_code": user.zip_code,
                "additional_information": user.additional_information,
                "profile_image": (
                    request.build_absolute_uri(user.profile_image.url)
                    if user.profile_image
                    else None
                ),
            }
        )

    def patch(self, request):
        user = request.user
        data = request.data
        user.email = data.get("email", user.email)
        user.phonenumber = data.get("phonenumber", user.phonenumber)
        user.date_birth = data.get("date_birth", user.date_birth)
        user.address = data.get("address", user.address)
        user.city = data.get("city", user.city)
        user.street = data.get("street", user.street)
        user.floor = data.get("floor", user.floor)
        user.apartment = data.get("apartment", user.apartment)
        user.zip_code = data.get("zip_code", user.zip_code)
        user.additional_information = data.get(
            "additional_information", user.additional_information
        )

        # Update profile image if it exists in the request
        if "profile_image" in request.FILES:
            user.profile_image = request.FILES["profile_image"]

        user.save()
        return Response(
            {"message": "Profile updated successfully"}, status=status.HTTP_200_OK
        )
