import logging

from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView as SimpleJWTTokenRefreshView

logger = logging.getLogger('apps.authentication')

from apps.authentication.api.v1.schemas import (
    login_request_schema,
    login_response_schema,
    logout_request_schema,
    logout_response_schema,
    register_request_schema,
    register_response_schema,
    token_refresh_request_schema,
    token_refresh_response_schema,
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
    throttle_classes = [AnonRateThrottle]
    throttle_scope = 'register'
    
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
            logger.info(
                f'User registration successful: user_id={user.id}, '
                f'email={user.email}, phone={user.phone}, ip={request.META.get("REMOTE_ADDR")}'
            )
            return Response(
                {
                    'message': 'User registered successfully.',
                    'user': UserSerializer(user).data,
                    'tokens': user.tokens,
                },
                status=status.HTTP_201_CREATED
            )
        
        logger.warning(
            f'User registration failed: errors={serializer.errors}, '
            f'ip={request.META.get("REMOTE_ADDR")}'
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """View for user login."""
    
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]
    throttle_scope = 'login'
    
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
        email_or_phone = request.data.get('email_or_phone', 'N/A')
        ip_address = request.META.get('REMOTE_ADDR')
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = generate_jwt_tokens(user)
            logger.info(
                f'Login successful: user_id={user.id}, '
                f'identifier={email_or_phone}, ip={ip_address}'
            )
            return Response(
                {
                    'message': 'Login successful.',
                    'user': UserSerializer(user).data,
                    'tokens': tokens,
                },
                status=status.HTTP_200_OK
            )
        
        logger.warning(
            f'Login failed: identifier={email_or_phone}, '
            f'errors={serializer.errors}, ip={ip_address}'
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
            user_id = request.user.id if request.user.is_authenticated else None
            ip_address = request.META.get('REMOTE_ADDR')
            
            if refresh_token:
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            logger.info(
                f'Logout successful: user_id={user_id}, ip={ip_address}'
            )
            return Response(
                {'message': 'Logout successful.'},
                status=status.HTTP_200_OK
            )
        except (TokenError, InvalidToken, Exception) as e:
            # If token is invalid or already blacklisted, still return success
            # to prevent information leakage about token validity
            logger.warning(
                f'Logout with invalid token: user_id={request.user.id if request.user.is_authenticated else None}, '
                f'ip={request.META.get("REMOTE_ADDR")}, error={str(e)}'
            )
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

