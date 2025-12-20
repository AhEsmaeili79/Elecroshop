import logging

from django.db import transaction
from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger('apps.users')

from apps.users.api.v1.schemas import (
    password_update_request_schema,
    password_update_response_schema,
    user_profile_response_schema,
    user_update_request_schema,
    user_update_response_schema,
    validation_error_response_schema,
)
from apps.users.api.v1.serializers import (
    PasswordUpdateSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


class UserProfileView(APIView):
    """View for getting current user profile."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        responses={
            200: user_profile_response_schema,
            401: OpenApiResponse(description='Unauthorized - Authentication credentials were not provided or are invalid.'),
        },
        summary='Get user profile',
        description='Retrieve the profile information of the currently authenticated user. Returns user details including ID, email, phone number, creation date, and active status.',
        tags=['Users'],
        operation_id='get_user_profile',
    )
    def get(self, request):
        """Get current user profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserUpdateProfileView(APIView):
    """View for updating current user profile."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        request=user_update_request_schema,
        responses={
            200: user_update_response_schema,
            400: validation_error_response_schema,
            401: OpenApiResponse(description='Unauthorized - Authentication credentials were not provided or are invalid.'),
        },
        summary='Update user profile',
        tags=['Users'],
        operation_id='update_user_profile',
        examples=[
            {
                'email': 'test@example.com',
                'phone': '+1234567890',
            },
            {
                'email': 'updated@example.com',
            },
            {
                'phone': '+989123456789',
            },
        ],
    )
    @transaction.atomic
    def patch(self, request):
        """Update current user profile."""
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        user_id = request.user.id
        ip_address = request.META.get('REMOTE_ADDR')
        
        if serializer.is_valid():
            old_email = request.user.email
            old_phone = request.user.phone
            serializer.save()
            # Return updated user data using UserSerializer
            user_serializer = UserSerializer(serializer.instance)
            
            # Log profile update
            changes = []
            if old_email != serializer.instance.email:
                changes.append(f'email: {old_email} -> {serializer.instance.email}')
            if old_phone != serializer.instance.phone:
                changes.append(f'phone: {old_phone} -> {serializer.instance.phone}')
            
            logger.info(
                f'Profile updated: user_id={user_id}, changes={", ".join(changes) if changes else "none"}, '
                f'ip={ip_address}'
            )
            return Response(
                user_serializer.data,
                status=status.HTTP_200_OK
            )
        
        logger.warning(
            f'Profile update failed: user_id={user_id}, errors={serializer.errors}, '
            f'ip={ip_address}'
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordUpdateView(APIView):
    """View for updating user password."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        request=password_update_request_schema,
        responses={
            200: password_update_response_schema,
            400: validation_error_response_schema,
            401: OpenApiResponse(description='Unauthorized - Authentication credentials were not provided or are invalid.'),
        },
        summary='Update user password',
        description='Update the password for the currently authenticated user. Requires current password verification.',
        tags=['Users'],
        operation_id='update_user_password',
    )
    @transaction.atomic
    def post(self, request):
        """Update user password."""
        serializer = PasswordUpdateSerializer(data=request.data, context={'request': request})
        user_id = request.user.id
        ip_address = request.META.get('REMOTE_ADDR')
        
        if serializer.is_valid():
            serializer.save()
            logger.info(
                f'Password updated: user_id={user_id}, ip={ip_address}'
            )
            return Response(
                {'message': 'Password updated successfully.'},
                status=status.HTTP_200_OK
            )
        
        logger.warning(
            f'Password update failed: user_id={user_id}, errors={serializer.errors}, '
            f'ip={ip_address}'
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

