from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView

from apps.authentication.api.v1.schemas import (
    login_request_schema,
    login_response_schema,
    logout_request_schema,
    logout_response_schema,
    register_request_schema,
    register_response_schema,
    token_refresh_request_schema,
    token_refresh_response_schema,
    user_profile_response_schema,
)
from apps.authentication.api.v1.schemas import LogoutResponseSerializer
from apps.authentication.api.v1.serializers import (
    TokenRefreshSerializer,
    UserLoginSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)
from apps.authentication.services import generate_jwt_tokens


class RegisterView(APIView):
    """View for user registration."""
    
    permission_classes = [AllowAny]
    
    @extend_schema(
        request=register_request_schema,
        responses={
            201: register_response_schema,
            400: OpenApiResponse(description='Validation error'),
        },
        summary='Register a new user',
        description='Register a new user with email or phone number. At least one of email or phone must be provided.',
        tags=['Authentication'],
    )
    def post(self, request):
        """Register a new user."""
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    'message': 'User registered successfully.',
                    'user': UserSerializer(user).data,
                    'tokens': user.tokens,
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """View for user login."""
    
    permission_classes = [AllowAny]
    
    @extend_schema(
        request=login_request_schema,
        responses={
            200: login_response_schema,
            400: OpenApiResponse(description='Invalid credentials'),
        },
        summary='User login',
        description='Authenticate user with email or phone number and password.',
        tags=['Authentication'],
    )
    def post(self, request):
        """Authenticate user and return JWT tokens."""
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = generate_jwt_tokens(user)
            
            return Response(
                {
                    'message': 'Login successful.',
                    'user': UserSerializer(user).data,
                    'tokens': tokens,
                },
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """View for user logout."""
    
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutResponseSerializer
    
    @extend_schema(
        request=logout_request_schema,
        responses={
            200: LogoutResponseSerializer,
            400: OpenApiResponse(description='Invalid token'),
            401: OpenApiResponse(description='Unauthorized'),
        },
        summary='User logout',
        description='Logout the currently authenticated user and blacklist the refresh token. Send the refresh token in the request body to blacklist it.',
        tags=['Authentication'],
    )
    def post(self, request):
        """Logout user and blacklist refresh token."""
        try:
            # Get refresh token from request body
            refresh_token = request.data.get('refresh')
            
            if refresh_token:
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response(
                {'message': 'Logout successful.'},
                status=status.HTTP_200_OK
            )
        except (TokenError, InvalidToken, Exception) as e:
            # If token is invalid or already blacklisted, still return success
            # to prevent information leakage about token validity
            return Response(
                {'message': 'Logout successful.'},
                status=status.HTTP_200_OK
            )


class TokenRefreshView(SimpleJWTTokenRefreshView):
    """View for refreshing access token."""
    
    serializer_class = TokenRefreshSerializer
    
    @extend_schema(
        request=token_refresh_request_schema,
        responses={
            200: token_refresh_response_schema,
            401: OpenApiResponse(description='Invalid refresh token'),
        },
        summary='Refresh access token',
        description='Refresh the access token using a valid refresh token.',
        tags=['Authentication'],
    )
    def post(self, request, *args, **kwargs):
        """Refresh access token."""
        return super().post(request, *args, **kwargs)


class UserProfileView(APIView):
    """View for getting current user profile."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        responses={
            200: user_profile_response_schema,
            401: OpenApiResponse(description='Unauthorized'),
        },
        summary='Get user profile',
        description='Get the profile of the currently authenticated user.',
        tags=['Authentication'],
    )
    def get(self, request):
        """Get current user profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

