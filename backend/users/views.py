from django.shortcuts import render

# Create your views here.
from djoser.views import UserViewSet
from .models import CustomUser
from .serializers import CustomUserCreateSerializer


class CustomUserViewSet(UserViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserCreateSerializer
