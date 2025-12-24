import logging
import os

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
    otp_request_error_schema,
    otp_request_response_schema,
    otp_request_schema,
    otp_verify_error_schema,
    otp_verify_response_schema,
    otp_verify_schema,
    register_request_schema,
    register_response_schema,
    token_refresh_request_schema,
    token_refresh_response_schema,
)
from apps.authentication.api.v1.schemas import LogoutResponseSerializer
from apps.authentication.api.v1.serializers import (
    OTPRequestSerializer,
    OTPVerifySerializer,
    TokenRefreshSerializer,
    UserLoginSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)
from apps.authentication.otp_service import OTPService
from apps.authentication.services import generate_jwt_tokens
from apps.authentication.tasks import send_email_otp, send_sms_otp
from apps.users.selectors import user_exists_by_email, user_exists_by_phone
from apps.users.services import create_user


class RegisterView(APIView):
    """View for user registration with optional OTP."""
    
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
        description='Register a new user with email or phone number. Supports both password and OTP-based registration.',
        tags=['Authentication'],
    )
    def post(self, request):
        """Register a new user with password or OTP."""
        serializer = UserRegistrationSerializer(data=request.data)
        
        if not serializer.is_valid():
            logger.warning(
                f'User registration failed: errors={serializer.errors}, '
                f'ip={request.META.get("REMOTE_ADDR")}'
            )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        email = validated_data.get('email')
        phone = validated_data.get('phone')
        password = validated_data.get('password')
        otp_code = validated_data.get('otp_code')
        
        # If OTP is provided, validate it during registration
        if otp_code:
            identifier = email or phone
            is_valid, error_message = OTPService.verify_otp(identifier, 'register', otp_code)

            if not is_valid:
                logger.warning(
                    f'OTP verification failed for registration: identifier={identifier}, '
                    f'ip={request.META.get("REMOTE_ADDR")}'
                )
                return Response(
                    {'otp_code': [error_message]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # OTP verified, create user (serializer will handle temp password)
            user = serializer.save()
            logger.info(
                f'User registration successful with OTP: user_id={user.id}, '
                f'email={user.email}, phone={user.phone}, ip={request.META.get("REMOTE_ADDR")}'
            )
            return Response(
                {
                    'message': 'User registered successfully with OTP.',
                    'user': UserSerializer(user).data,
                    'tokens': user.tokens,
                },
                status=status.HTTP_201_CREATED
            )
        
        # Password-based registration
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


class LoginView(APIView):
    """View for user login with optional OTP."""
    
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
        description='Authenticate user with email or phone number and password or OTP.',
        tags=['Authentication'],
    )
    def post(self, request):
        """Authenticate user and return JWT tokens."""
        serializer = UserLoginSerializer(data=request.data)
        email_or_phone = request.data.get('email_or_phone', 'N/A')
        ip_address = request.META.get('REMOTE_ADDR')
        
        if not serializer.is_valid():
            logger.warning(
                f'Login failed: identifier={email_or_phone}, '
                f'errors={serializer.errors}, ip={ip_address}'
            )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        user = validated_data['user']
        otp_code = request.data.get('otp_code')
        
        # If OTP is provided, verify it
        if otp_code:
            is_valid, error_message = OTPService.verify_otp(email_or_phone, 'login', otp_code)
            
            if not is_valid:
                logger.warning(
                    f'OTP verification failed for login: identifier={email_or_phone}, '
                    f'ip={ip_address}'
                )
                return Response(
                    {'otp_code': [error_message]},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Authentication successful
        tokens = generate_jwt_tokens(user)
        logger.info(
            f'Login successful: user_id={user.id}, '
            f'identifier={email_or_phone}, method={"OTP" if otp_code else "password"}, ip={ip_address}'
        )
        return Response(
            {
                'message': 'Login successful.',
                'user': UserSerializer(user).data,
                'tokens': tokens,
            },
            status=status.HTTP_200_OK
        )


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


class OTPRequestView(APIView):
    """View for requesting OTP code."""
    
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]
    
    @extend_schema(
        request=otp_request_schema,
        responses={
            200: otp_request_response_schema,
            400: otp_request_error_schema,
        },
        summary='Request OTP code',
        description='Request an OTP code for registration or login. Rate limited: 3 requests max, 1 min cooldown, 1 hour lockout after 3 consecutive requests.',
        tags=['Authentication'],
    )
    def post(self, request):
        """Request OTP code for registration or login."""
        serializer = OTPRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        email = validated_data.get('email')
        phone = validated_data.get('phone')
        purpose = validated_data.get('purpose')
        normalized_identifier = validated_data.get('normalized_identifier')
        original_identifier = validated_data.get('original_identifier')
        
        # Check if user exists (for login, user must exist; for registration, user must not exist)
        user_exists = (email and user_exists_by_email(email)) or (phone and user_exists_by_phone(phone))
        if purpose == 'login' and not user_exists:
            logger.warning(
                f'OTP request denied: user not found, identifier={normalized_identifier}, purpose={purpose}, '
                f'ip={request.META.get("REMOTE_ADDR")}'
            )
            return Response(
                {
                    'error': 'User not found. Please check your email/phone.',
                    'identifier': original_identifier,
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate and store OTP (use normalized identifier for Redis)
        otp_code, success, error_message = OTPService.generate_and_store_otp(normalized_identifier, purpose)
        
        if not success:
            logger.warning(
                f'OTP request failed: identifier={normalized_identifier}, purpose={purpose}, '
                f'reason={error_message}, ip={request.META.get("REMOTE_ADDR")}'
            )
            return Response(
                {
                    'error': error_message,
                    'identifier': original_identifier,
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Send OTP via Celery
        is_development = os.environ.get('DEVELOPMENT', 'False').lower() == 'true'
        
        if email:
            send_email_otp.delay(email, otp_code)
        if phone:
            send_sms_otp.delay(phone, otp_code)
        
        logger.info(
            f'OTP requested: identifier={normalized_identifier}, purpose={purpose}, '
            f'ip={request.META.get("REMOTE_ADDR")}'
        )
        
        response_data = {
            'message': 'OTP code has been sent successfully.',
            'identifier': original_identifier,
            'purpose': purpose,
        }
        
        # In development mode, include OTP in response
        if is_development:
            response_data['otp_code'] = otp_code
            response_data['dev_mode'] = True
        
        return Response(response_data, status=status.HTTP_200_OK)


class OTPVerifyView(APIView):
    """View for verifying OTP code."""
    
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]
    
    @extend_schema(
        request=otp_verify_schema,
        responses={
            200: otp_verify_response_schema,
            400: otp_verify_error_schema,
        },
        summary='Verify OTP code',
        description='Verify an OTP code for registration or login.',
        tags=['Authentication'],
    )
    def post(self, request):
        """Verify OTP code."""
        serializer = OTPVerifySerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        email = validated_data.get('email')
        phone = validated_data.get('phone')
        otp_code = validated_data.get('otp_code')
        purpose = validated_data.get('purpose')
        normalized_identifier = validated_data.get('normalized_identifier')
        original_identifier = validated_data.get('original_identifier')
        
        # Verify OTP (use normalized identifier for Redis)
        is_valid, error_message = OTPService.verify_otp(normalized_identifier, purpose, otp_code)
        
        if not is_valid:
            logger.warning(
                f'OTP verification failed: identifier={normalized_identifier}, purpose={purpose}, '
                f'ip={request.META.get("REMOTE_ADDR")}'
            )
            return Response(
                {
                    'error': error_message,
                    'identifier': original_identifier,
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        logger.info(
            f'OTP verified successfully: identifier={normalized_identifier}, purpose={purpose}, '
            f'ip={request.META.get("REMOTE_ADDR")}'
        )
        
        return Response(
            {
                'message': 'OTP code verified successfully.',
                'identifier': original_identifier,
                'purpose': purpose,
            },
            status=status.HTTP_200_OK
        )

