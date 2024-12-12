# users/views.py

from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSignupSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()


# View for user signup
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer

    def create(self, request, *args, **kwargs):
        # Handle user signup
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"username": user.username}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View for user logout
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can log out

    def post(self, request):
        try:
            # Get the refresh token from the request body
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)  # Create a token instance
            token.blacklist()  # Blacklist the refresh token
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST
            )  # Return an error if something goes wrong


# View to retrieve user details
class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [
        IsAuthenticated
    ]  # Only authenticated users can access this view

    def get_object(self):
        return self.request.user  # Return the logged-in user


# View for retrieving and updating user profile
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user  # Return the logged-in user

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()  # Save the updated user data
            return Response(serializer.data)  # Return the updated user data
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return errors if validation fails
