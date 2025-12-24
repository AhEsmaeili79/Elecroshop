import logging

from django.db import transaction
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger('apps.users')

from apps.users.api.v1.schemas import (
    password_update_view_schema,
    user_profile_view_schema,
    user_update_profile_view_schema,
)
from apps.users.api.v1.serializers import (
    PasswordUpdateSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


class UserProfileView(APIView):
    """View for getting current user profile."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(**user_profile_view_schema)
    def get(self, request):
        """Get current user profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserUpdateProfileView(APIView):
    """View for updating current user profile."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(**user_update_profile_view_schema)
    @transaction.atomic
    def patch(self, request):
        """Update current user profile."""
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        user_id = request.user.id
        ip_address = request.META.get('REMOTE_ADDR')
        
        if serializer.is_valid():
            old_email = request.user.email
            old_phone = request.user.phone
            old_first_name = request.user.first_name
            old_last_name = request.user.last_name
            serializer.save()
            # Return updated user data using UserSerializer
            user_serializer = UserSerializer(serializer.instance)
            
            # Log profile update
            changes = []
            if old_email != serializer.instance.email:
                changes.append(f'email: {old_email} -> {serializer.instance.email}')
            if old_phone != serializer.instance.phone:
                changes.append(f'phone: {old_phone} -> {serializer.instance.phone}')
            if old_first_name != serializer.instance.first_name:
                changes.append(f'first_name: {old_first_name} -> {serializer.instance.first_name}')
            if old_last_name != serializer.instance.last_name:
                changes.append(f'last_name: {old_last_name} -> {serializer.instance.last_name}')
            
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
    
    @extend_schema(**password_update_view_schema)
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

