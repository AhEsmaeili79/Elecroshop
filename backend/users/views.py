# users/views.py

from rest_framework import status, generics, permissions,viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSignupSerializer, UserSerializer,AddressSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .permissions import IsOwner
from .models import Address
from rest_framework.exceptions import PermissionDenied

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


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        """
        Ensure the user only sees their own addresses.
        This will return all addresses for the currently authenticated user.
        """
        return Address.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically set the logged-in user as the owner of the address.
        """
        serializer.save(username=self.request.user)

    def perform_update(self, serializer):
        """
        Ensure the user can only update their own addresses.
        """
        if serializer.instance.username != self.request.user:
            raise PermissionDenied("You do not have permission to edit this address.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Ensure the user can only delete their own addresses.
        """
        if instance.username != self.request.user:
            raise PermissionDenied("You do not have permission to delete this address.")
        instance.delete()
        
        
class LoginView(APIView):
    """
    View to login user as either Admin or Seller.
    Only Admin and Seller can log in.
    """

    def post(self, request):
        # If the request is form-encoded, you can access the data like this:
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate user using Django's authenticate function
        user = authenticate(username=username, password=password)

        if user is not None:
            # Check if the user has the right role (Admin or Seller)
            if user.role in [User.ADMIN, User.SELLER]:
                # Create and return JWT tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({
                    'access': access_token,
                    'refresh': str(refresh),
                }, status=status.HTTP_200_OK)

            else:
                return Response({
                    'detail': 'You do not have permission to access this resource.'
                }, status=status.HTTP_403_FORBIDDEN)
        
        # If authentication fails, return unauthorized
        return Response({
            'detail': 'Invalid credentials.'
        }, status=status.HTTP_401_UNAUTHORIZED)