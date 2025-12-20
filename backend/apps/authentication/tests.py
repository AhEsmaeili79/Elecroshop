"""
Comprehensive tests for Authentication API endpoints.
Tests all conditions: success cases, validation errors, edge cases.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthenticationAPITestCase(TestCase):
    """Test cases for Authentication API endpoints."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.logout_url = '/api/auth/logout/'
        self.refresh_url = '/api/auth/refresh/'
        
        # Test user data
        self.test_email = 'test@example.com'
        self.test_phone = '+1234567890'
        self.test_password = 'TestPassword123!'
        
        # Create a test user for login/logout tests
        self.existing_user = User.objects.create_user(
            email='existing@example.com',
            phone='+9876543210',
            password='ExistingPassword123!'
        )
    
    # ==================== REGISTER TESTS ====================
    
    def test_register_with_email_success(self):
        """Test successful registration with email."""
        data = {
            'email': 'newuser@example.com',
            'password': 'NewPassword123!',
            'password_confirm': 'NewPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], 'newuser@example.com')
        
        # Verify user was created
        user = User.objects.get(email='newuser@example.com')
        self.assertIsNotNone(user)
        self.assertTrue(user.check_password('NewPassword123!'))
    
    def test_register_with_phone_success(self):
        """Test successful registration with phone number."""
        data = {
            'phone': '+1111111111',
            'password': 'PhonePassword123!',
            'password_confirm': 'PhonePassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['phone'], '+1111111111')
        
        # Verify user was created
        user = User.objects.get(phone='+1111111111')
        self.assertIsNotNone(user)
    
    def test_register_with_email_and_phone_success(self):
        """Test successful registration with both email and phone."""
        data = {
            'email': 'both@example.com',
            'phone': '+2222222222',
            'password': 'BothPassword123!',
            'password_confirm': 'BothPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['email'], 'both@example.com')
        self.assertEqual(response.data['user']['phone'], '+2222222222')
    
    def test_register_missing_password(self):
        """Test registration fails when password is missing."""
        data = {
            'email': 'test@example.com',
            'password_confirm': 'TestPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_register_missing_password_confirm(self):
        """Test registration fails when password_confirm is missing."""
        data = {
            'email': 'test@example.com',
            'password': 'TestPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_confirm', response.data)
    
    def test_register_password_mismatch(self):
        """Test registration fails when passwords don't match."""
        data = {
            'email': 'test@example.com',
            'password': 'TestPassword123!',
            'password_confirm': 'DifferentPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_register_duplicate_email(self):
        """Test registration fails with duplicate email."""
        data = {
            'email': self.existing_user.email,
            'password': 'TestPassword123!',
            'password_confirm': 'TestPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_register_duplicate_phone(self):
        """Test registration fails with duplicate phone."""
        data = {
            'phone': self.existing_user.phone,
            'password': 'TestPassword123!',
            'password_confirm': 'TestPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', response.data)
    
    def test_register_weak_password(self):
        """Test registration fails with weak password."""
        data = {
            'email': 'test@example.com',
            'password': '123',  # Too short
            'password_confirm': '123'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_register_no_email_no_phone(self):
        """Test registration fails when neither email nor phone is provided."""
        data = {
            'password': 'TestPassword123!',
            'password_confirm': 'TestPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_invalid_email_format(self):
        """Test registration fails with invalid email format."""
        data = {
            'email': 'invalid-email',
            'password': 'TestPassword123!',
            'password_confirm': 'TestPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    # ==================== LOGIN TESTS ====================
    
    def test_login_with_email_success(self):
        """Test successful login with email."""
        data = {
            'email_or_phone': self.existing_user.email,
            'password': 'ExistingPassword123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], self.existing_user.email)
    
    def test_login_with_phone_success(self):
        """Test successful login with phone number."""
        data = {
            'email_or_phone': self.existing_user.phone,
            'password': 'ExistingPassword123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['phone'], self.existing_user.phone)
    
    def test_login_invalid_email(self):
        """Test login fails with invalid email."""
        data = {
            'email_or_phone': 'nonexistent@example.com',
            'password': 'ExistingPassword123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)
    
    def test_login_invalid_phone(self):
        """Test login fails with invalid phone."""
        data = {
            'email_or_phone': '+9999999999',
            'password': 'ExistingPassword123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)
    
    def test_login_wrong_password(self):
        """Test login fails with wrong password."""
        data = {
            'email_or_phone': self.existing_user.email,
            'password': 'WrongPassword123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)
    
    def test_login_missing_email_or_phone(self):
        """Test login fails when email_or_phone is missing."""
        data = {
            'password': 'ExistingPassword123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email_or_phone', response.data)
    
    def test_login_missing_password(self):
        """Test login fails when password is missing."""
        data = {
            'email_or_phone': self.existing_user.email
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_login_inactive_user(self):
        """Test login fails for inactive user."""
        inactive_user = User.objects.create_user(
            email='inactive@example.com',
            password='InactivePassword123!',
            is_active=False
        )
        data = {
            'email_or_phone': inactive_user.email,
            'password': 'InactivePassword123!'
        }
        response = self.client.post(self.login_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    # ==================== LOGOUT TESTS ====================
    
    def test_logout_with_token_success(self):
        """Test successful logout with refresh token."""
        # Login first to get tokens
        login_data = {
            'email_or_phone': self.existing_user.email,
            'password': 'ExistingPassword123!'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        refresh_token = login_response.data['tokens']['refresh']
        access_token = login_response.data['tokens']['access']
        
        # Logout with token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_data = {'refresh': refresh_token}
        response = self.client.post(self.logout_url, logout_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Logout successful.')
    
    def test_logout_without_token_success(self):
        """Test logout succeeds even without refresh token (security best practice)."""
        # Login first to get access token
        login_data = {
            'email_or_phone': self.existing_user.email,
            'password': 'ExistingPassword123!'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        access_token = login_response.data['tokens']['access']
        
        # Logout without refresh token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.post(self.logout_url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
    
    def test_logout_unauthorized(self):
        """Test logout fails without authentication."""
        response = self.client.post(self.logout_url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_logout_invalid_token(self):
        """Test logout handles invalid refresh token gracefully."""
        # Login first to get access token
        login_data = {
            'email_or_phone': self.existing_user.email,
            'password': 'ExistingPassword123!'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        access_token = login_response.data['tokens']['access']
        
        # Logout with invalid refresh token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_data = {'refresh': 'invalid_token_string'}
        response = self.client.post(self.logout_url, logout_data, format='json')
        
        # Should still return success (security best practice)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    # ==================== TOKEN REFRESH TESTS ====================
    
    def test_refresh_token_success(self):
        """Test successful token refresh."""
        # Login first to get tokens
        login_data = {
            'email_or_phone': self.existing_user.email,
            'password': 'ExistingPassword123!'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        refresh_token = login_response.data['tokens']['refresh']
        
        # Refresh token
        refresh_data = {'refresh': refresh_token}
        response = self.client.post(self.refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        # New tokens should be different
        self.assertNotEqual(response.data['access'], login_response.data['tokens']['access'])
    
    def test_refresh_token_invalid(self):
        """Test refresh fails with invalid token."""
        refresh_data = {'refresh': 'invalid_token_string'}
        response = self.client.post(self.refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_refresh_token_missing(self):
        """Test refresh fails when refresh token is missing."""
        response = self.client.post(self.refresh_url, {}, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('refresh', response.data)
    
    def test_refresh_token_empty_string(self):
        """Test refresh fails with empty refresh token."""
        refresh_data = {'refresh': ''}
        response = self.client.post(self.refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_refresh_token_blacklisted(self):
        """Test refresh fails with blacklisted token."""
        # Login and get tokens
        login_data = {
            'email_or_phone': self.existing_user.email,
            'password': 'ExistingPassword123!'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        refresh_token = login_response.data['tokens']['refresh']
        access_token = login_response.data['tokens']['access']
        
        # Logout to blacklist the token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        self.client.post(self.logout_url, {'refresh': refresh_token}, format='json')
        
        # Try to refresh with blacklisted token
        self.client.credentials()  # Clear auth
        refresh_data = {'refresh': refresh_token}
        response = self.client.post(self.refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_refresh_token_rotation(self):
        """Test that refresh token rotation works (new refresh token issued)."""
        # Login first
        login_data = {
            'email_or_phone': self.existing_user.email,
            'password': 'ExistingPassword123!'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        old_refresh_token = login_response.data['tokens']['refresh']
        
        # Refresh token
        refresh_data = {'refresh': old_refresh_token}
        response = self.client.post(self.refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # New refresh token should be different (rotation enabled)
        new_refresh_token = response.data['refresh']
        self.assertNotEqual(new_refresh_token, old_refresh_token)
        
        # Old refresh token should be blacklisted
        old_refresh_data = {'refresh': old_refresh_token}
        response = self.client.post(self.refresh_url, old_refresh_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # New refresh token should work
        new_refresh_data = {'refresh': new_refresh_token}
        response = self.client.post(self.refresh_url, new_refresh_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
