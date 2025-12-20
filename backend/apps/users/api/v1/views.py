from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.api.v1.schemas import (
    user_profile_response_schema,
    user_update_request_schema,
    user_update_response_schema,
    validation_error_response_schema,
)
from apps.users.api.v1.serializers import UserSerializer, UserUpdateSerializer


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
    def patch(self, request):
        """Update current user profile."""
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            # Return updated user data using UserSerializer
            user_serializer = UserSerializer(serializer.instance)
            return Response(
                user_serializer.data,
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

