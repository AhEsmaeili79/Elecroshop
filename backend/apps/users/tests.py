"""
Comprehensive tests for Users API endpoints.
Tests all conditions: success cases, validation errors, edge cases.
"""
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UsersAPITestCase(TestCase):
    """Test cases for Users API endpoints."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.client = APIClient()
        self.profile_url = '/api/users/me/'
        self.update_url = '/api/users/update/'
        self.password_update_url = '/api/users/password/update/'
        
        # Create test users
        self.test_user = User.objects.create_user(
            email='testuser@example.com',
            phone='+1111111111',
            password='TestPassword123!'
        )
        
        self.other_user = User.objects.create_user(
            email='other@example.com',
            phone='+2222222222',
            password='OtherPassword123!'
        )
        
        # Get JWT tokens for authenticated requests
        self.refresh = RefreshToken.for_user(self.test_user)
        self.access_token = str(self.refresh.access_token)
    
    def _authenticate(self):
        """Helper method to authenticate test user."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
    
    # ==================== GET PROFILE TESTS ====================
    
    def test_get_profile_success(self):
        """Test successful retrieval of user profile."""
        self._authenticate()
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('id', response.data)
        self.assertIn('email', response.data)
        self.assertIn('phone', response.data)
        self.assertIn('created_at', response.data)
        self.assertIn('is_active', response.data)
        self.assertEqual(response.data['email'], self.test_user.email)
        self.assertEqual(response.data['phone'], self.test_user.phone)
        self.assertEqual(response.data['id'], self.test_user.id)
    
    def test_get_profile_unauthorized(self):
        """Test get profile fails without authentication."""
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_profile_invalid_token(self):
        """Test get profile fails with invalid token."""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_profile_expired_token(self):
        """Test get profile fails with expired token."""
        # Create an expired token (simulated by using wrong token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjAwMDAwMDAwLCJqdGkiOiJleGFtcGxlIiwidXNlcl9pZCI6MX0.invalid')
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    # ==================== UPDATE PROFILE TESTS ====================
    
    def test_update_profile_email_only_success(self):
        """Test successful profile update with email only."""
        self._authenticate()
        data = {'email': 'updated@example.com'}
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'updated@example.com')
        self.assertEqual(response.data['phone'], self.test_user.phone)  # Phone unchanged
        
        # Verify in database
        self.test_user.refresh_from_db()
        self.assertEqual(self.test_user.email, 'updated@example.com')
    
    def test_update_profile_phone_only_success(self):
        """Test successful profile update with phone only."""
        self._authenticate()
        data = {'phone': '+9999999999'}
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['phone'], '+9999999999')
        self.assertEqual(response.data['email'], self.test_user.email)  # Email unchanged
        
        # Verify in database
        self.test_user.refresh_from_db()
        self.assertEqual(self.test_user.phone, '+9999999999')
    
    def test_update_profile_both_email_and_phone_success(self):
        """Test successful profile update with both email and phone."""
        self._authenticate()
        data = {
            'email': 'bothupdated@example.com',
            'phone': '+8888888888'
        }
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'bothupdated@example.com')
        self.assertEqual(response.data['phone'], '+8888888888')
        
        # Verify in database
        self.test_user.refresh_from_db()
        self.assertEqual(self.test_user.email, 'bothupdated@example.com')
        self.assertEqual(self.test_user.phone, '+8888888888')
    
    def test_update_profile_same_email_success(self):
        """Test updating profile with same email (should succeed)."""
        self._authenticate()
        data = {'email': self.test_user.email}
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_update_profile_same_phone_success(self):
        """Test updating profile with same phone (should succeed)."""
        self._authenticate()
        data = {'phone': self.test_user.phone}
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_update_profile_duplicate_email(self):
        """Test update fails with duplicate email."""
        self._authenticate()
        data = {'email': self.other_user.email}
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_update_profile_duplicate_phone(self):
        """Test update fails with duplicate phone."""
        self._authenticate()
        data = {'phone': self.other_user.phone}
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', response.data)
    
    def test_update_profile_invalid_email_format(self):
        """Test update fails with invalid email format."""
        self._authenticate()
        data = {'email': 'invalid-email-format'}
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_update_profile_remove_both_email_and_phone(self):
        """Test update fails when trying to remove both email and phone."""
        self._authenticate()
        data = {'email': None, 'phone': None}
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_profile_empty_data(self):
        """Test update with empty data (should keep existing values)."""
        self._authenticate()
        original_email = self.test_user.email
        original_phone = self.test_user.phone
        
        response = self.client.patch(self.update_url, {}, format='json')
        
        # Should succeed but no changes
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.test_user.refresh_from_db()
        self.assertEqual(self.test_user.email, original_email)
        self.assertEqual(self.test_user.phone, original_phone)
    
    def test_update_profile_unauthorized(self):
        """Test update fails without authentication."""
        data = {'email': 'test@example.com'}
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_profile_phone_too_long(self):
        """Test update fails with phone number too long."""
        self._authenticate()
        data = {'phone': 'a' * 21}  # Max length is 20
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_profile_email_too_long(self):
        """Test update fails with email too long."""
        self._authenticate()
        data = {'email': 'a' * 250 + '@example.com'}  # Max length is 254
        response = self.client.patch(self.update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    # ==================== UPDATE PASSWORD TESTS ====================
    
    def test_update_password_success(self):
        """Test successful password update."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password': 'NewPassword123!',
            'new_password_confirm': 'NewPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Password updated successfully.')
        
        # Verify password was changed
        self.test_user.refresh_from_db()
        self.assertTrue(self.test_user.check_password('NewPassword123!'))
        self.assertFalse(self.test_user.check_password('TestPassword123!'))
    
    def test_update_password_wrong_current_password(self):
        """Test password update fails with wrong current password."""
        self._authenticate()
        data = {
            'current_password': 'WrongPassword123!',
            'new_password': 'NewPassword123!',
            'new_password_confirm': 'NewPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('current_password', response.data)
    
    def test_update_password_mismatch(self):
        """Test password update fails when passwords don't match."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password': 'NewPassword123!',
            'new_password_confirm': 'DifferentPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_update_password_same_as_current(self):
        """Test password update fails when new password is same as current."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password': 'TestPassword123!',
            'new_password_confirm': 'TestPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)
    
    def test_update_password_weak_password(self):
        """Test password update fails with weak password."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password': '123',  # Too short
            'new_password_confirm': '123'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
    
    def test_update_password_missing_current_password(self):
        """Test password update fails when current_password is missing."""
        self._authenticate()
        data = {
            'new_password': 'NewPassword123!',
            'new_password_confirm': 'NewPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('current_password', response.data)
    
    def test_update_password_missing_new_password(self):
        """Test password update fails when new_password is missing."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password_confirm': 'NewPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password', response.data)
    
    def test_update_password_missing_confirm(self):
        """Test password update fails when new_password_confirm is missing."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password': 'NewPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('new_password_confirm', response.data)
    
    def test_update_password_unauthorized(self):
        """Test password update fails without authentication."""
        data = {
            'current_password': 'TestPassword123!',
            'new_password': 'NewPassword123!',
            'new_password_confirm': 'NewPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_password_empty_current_password(self):
        """Test password update fails with empty current password."""
        self._authenticate()
        data = {
            'current_password': '',
            'new_password': 'NewPassword123!',
            'new_password_confirm': 'NewPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_password_empty_new_password(self):
        """Test password update fails with empty new password."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password': '',
            'new_password_confirm': 'NewPassword123!'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_password_empty_confirm(self):
        """Test password update fails with empty password confirmation."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password': 'NewPassword123!',
            'new_password_confirm': ''
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_password_common_password(self):
        """Test password update fails with common password."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password': 'password',
            'new_password_confirm': 'password'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        # Should fail validation (common password)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_update_password_numeric_only(self):
        """Test password update fails with numeric-only password."""
        self._authenticate()
        data = {
            'current_password': 'TestPassword123!',
            'new_password': '12345678',
            'new_password_confirm': '12345678'
        }
        response = self.client.post(self.password_update_url, data, format='json')
        
        # Should fail validation (numeric only)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
