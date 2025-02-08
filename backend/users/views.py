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
        try:
            if serializer.is_valid():
                user = serializer.save()
                return Response({"username": user.username}, status=status.HTTP_201_CREATED)
            else:
                error_messages = {
                    "username": "نام کاربری قبلا استفاده صحیح نیست. لطفا مجددا تلاش کنید.",
                    "password": "رمز عبور باید حداقل ۸ کاراکتر داشته باشد.",
                    "email": "لطفا یک ایمیل معتبر وارد کنید.",
                }

                translated_errors = {
                    field: error_messages.get(field, "خطا در وارد کردن اطلاعات.")
                    for field, error in serializer.errors.items()
                }
                return Response(translated_errors, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError as e:
            if 'username' in str(e):
                return Response({"username": "این نام کاربری قبلاً ثبت شده است. لطفاً نام کاربری دیگری انتخاب کنید."},
                                status=status.HTTP_401_UNAUTHORIZED)
            elif 'email' in str(e):
                return Response({"email": "این ایمیل قبلاً ثبت شده است. لطفاً ایمیل دیگری وارد کنید."},
                                status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({"error": "خطای پایگاه داده! لطفاً دوباره تلاش کنید."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({"error": "خطای غیرمنتظره ای رخ داده است. لطفاً دوباره تلاش کنید."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"detail": "توکن refresh را وارد کنید."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)

            token.blacklist()
            return Response(
                {"detail": "با موفقیت از سیستم خارج شدید."},
                status=status.HTTP_205_RESET_CONTENT
            )
        
        except KeyError:
            return Response(
                {"detail": "توکن refresh در داده‌ها یافت نشد."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": "مشکلی در خروج از سیستم به وجود آمده است. لطفا دوباره تلاش کنید."},
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
                    'detail': 'شما دسترسی لازم را ندارید'
                }, status=status.HTTP_403_FORBIDDEN)
        
        return Response({
            'detail': 'نام کاربری یا رمز عبور اشتباه است'
        }, status=status.HTTP_401_UNAUTHORIZED)
        