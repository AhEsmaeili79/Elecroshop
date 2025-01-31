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

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"username": user.username}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)  
            token.blacklist()  
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST
            ) 

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [
        IsAuthenticated
    ]  

    def get_object(self):
        return self.request.user 


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user  

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Address.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.username != self.request.user:
            raise PermissionDenied("You do not have permission to edit this address.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.username != self.request.user:
            raise PermissionDenied("You do not have permission to delete this address.")
        instance.delete()
        
        
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.role in [User.ADMIN, User.SELLER]:
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