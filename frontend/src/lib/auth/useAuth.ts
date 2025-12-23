/**
 * Authentication Hook
 * Provides comprehensive authentication functionality including signin, signup, OTP, and JWT management
 */

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  useAuthLoginCreate,
  useAuthRegisterCreate,
  useAuthOtpRequestCreate,
  useAuthOtpVerifyCreate,
  useAuthRefreshCreate,
  useAuthLogoutCreate,
} from '@/api/authentication/authentication';
import type {
  UserLoginRequest,
  UserRegistrationRequest,
  OTPRequestRequest,
  OTPVerifyRequest,
  PurposeEnum,
  User,
} from '@/api/authentication/models';
import {
  setTokens,
  clearTokens,
  setUser,
  getUser,
  getAccessToken,
  getRefreshToken,
  isAuthenticated as checkIsAuthenticated,
} from './tokenStorage';

interface UseAuthReturn {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Sign in methods
  signInWithPassword: (identifier: string, password: string) => Promise<void>;
  signInWithOTP: (identifier: string) => Promise<void>;
  verifyOTPAndSignIn: (identifier: string, otpCode: string) => Promise<void>;

  // Sign up methods
  signUpWithPassword: (identifier: string, password: string) => Promise<void>;
  signUpWithOTP: (identifier: string, password: string) => Promise<void>;
  verifyOTPAndSignUp: (identifier: string, otpCode: string, password: string) => Promise<void>;

  // OTP methods
  requestOTP: (identifier: string, purpose: PurposeEnum) => Promise<void>;
  verifyOTP: (identifier: string, otpCode: string, purpose: PurposeEnum) => Promise<void>;

  // Token management
  refreshToken: () => Promise<boolean>;
  logout: () => Promise<void>;

  // Utility
  checkAuth: () => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user from storage
  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUserState(storedUser);
    }
  }, []);

  // Mutations
  const loginMutation = useAuthLoginCreate();
  const registerMutation = useAuthRegisterCreate();
  const otpRequestMutation = useAuthOtpRequestCreate();
  const otpVerifyMutation = useAuthOtpVerifyCreate();
  const refreshMutation = useAuthRefreshCreate();
  const logoutMutation = useAuthLogoutCreate();

  /**
   * Helper to handle successful authentication
   */
  const handleAuthSuccess = useCallback((tokens: { access: string; refresh: string }, userData: User) => {
    setTokens(tokens);
    setUser(userData);
    setUserState(userData);
  }, []);

  /**
   * Helper to parse identifier (email or phone)
   */
  const parseIdentifier = useCallback((identifier: string) => {
    const isEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    return {
      email: isEmailFormat ? identifier : null,
      phone: !isEmailFormat ? identifier : null,
    };
  }, []);

  /**
   * Sign in with password
   */
  const signInWithPassword = useCallback(async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const loginData: UserLoginRequest = {
        email_or_phone: identifier,
        password,
      };

      const response = await loginMutation.mutateAsync({ data: loginData });
      
      if (response.data?.tokens && response.data?.user) {
        handleAuthSuccess(response.data.tokens, response.data.user);
        toast.success(response.data.message || 'Signed in successfully');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to sign in';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loginMutation, handleAuthSuccess]);

  /**
   * Sign in with OTP (request OTP first)
   */
  const signInWithOTP = useCallback(async (identifier: string) => {
    setIsLoading(true);
    try {
      await requestOTP(identifier, 'login');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verify OTP and sign in
   */
  const verifyOTPAndSignIn = useCallback(async (identifier: string, otpCode: string) => {
    setIsLoading(true);
    try {
      // First verify OTP
      await verifyOTP(identifier, otpCode, 'login');

      // Then login with OTP
      const loginData: UserLoginRequest = {
        email_or_phone: identifier,
        otp_code: otpCode,
      };

      const response = await loginMutation.mutateAsync({ data: loginData });
      
      if (response.data?.tokens && response.data?.user) {
        handleAuthSuccess(response.data.tokens, response.data.user);
        toast.success(response.data.message || 'Signed in successfully');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to verify OTP and sign in';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loginMutation, handleAuthSuccess]);

  /**
   * Sign up with password
   */
  const signUpWithPassword = useCallback(async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const parsed = parseIdentifier(identifier);
      const registerData: UserRegistrationRequest = {
        email: parsed.email,
        phone: parsed.phone,
        password,
      };

      const response = await registerMutation.mutateAsync({ data: registerData });
      
      if (response.data?.tokens && response.data?.user) {
        handleAuthSuccess(response.data.tokens, response.data.user);
        toast.success(response.data.message || 'Account created successfully');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to create account';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [registerMutation, handleAuthSuccess, parseIdentifier]);

  /**
   * Sign up with OTP (request OTP first)
   */
  const signUpWithOTP = useCallback(async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      await requestOTP(identifier, 'register');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verify OTP and sign up
   */
  const verifyOTPAndSignUp = useCallback(async (identifier: string, otpCode: string, password: string) => {
    setIsLoading(true);
    try {
      // First verify OTP
      await verifyOTP(identifier, otpCode, 'register');

      // Then register with OTP
      const parsed = parseIdentifier(identifier);
      const registerData: UserRegistrationRequest = {
        email: parsed.email,
        phone: parsed.phone,
        password,
        otp_code: otpCode,
      };

      const response = await registerMutation.mutateAsync({ data: registerData });
      
      if (response.data?.tokens && response.data?.user) {
        handleAuthSuccess(response.data.tokens, response.data.user);
        toast.success(response.data.message || 'Account created successfully');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to verify OTP and create account';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [registerMutation, handleAuthSuccess, parseIdentifier]);

  /**
   * Request OTP
   */
  const requestOTP = useCallback(async (identifier: string, purpose: PurposeEnum) => {
    try {
      const otpRequest: OTPRequestRequest = {
        identifier,
        purpose,
      };

      const response = await otpRequestMutation.mutateAsync({ data: otpRequest });
      
      const message = response.data?.message || 'OTP sent successfully';
      toast.success(message);
      
      // In development mode, show OTP code if available
      if (response.data?.dev_mode && response.data?.otp_code) {
        console.log('🔐 Development OTP Code:', response.data.otp_code);
        toast.success(`Development OTP: ${response.data.otp_code}`, { duration: 10000 });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to send OTP';
      toast.error(errorMessage);
      throw error;
    }
  }, [otpRequestMutation]);

  /**
   * Verify OTP
   */
  const verifyOTP = useCallback(async (identifier: string, otpCode: string, purpose: PurposeEnum) => {
    try {
      const otpVerify: OTPVerifyRequest = {
        identifier,
        otp_code: otpCode,
        purpose,
      };

      const response = await otpVerifyMutation.mutateAsync({ data: otpVerify });
      
      const message = response.data?.message || 'OTP verified successfully';
      toast.success(message);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || 'Invalid OTP code';
      toast.error(errorMessage);
      throw error;
    }
  }, [otpVerifyMutation]);

  /**
   * Refresh access token
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refresh = getRefreshToken();
    if (!refresh) {
      return false;
    }

    try {
      const response = await refreshMutation.mutateAsync({
        data: { refresh },
      });

      if (response.data?.access && response.data?.refresh) {
        setTokens({
          access: response.data.access,
          refresh: response.data.refresh,
        });
        return true;
      }
      return false;
    } catch (error) {
      // Refresh failed, clear tokens
      clearTokens();
      setUserState(null);
      return false;
    }
  }, [refreshMutation]);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          await logoutMutation.mutateAsync({
            data: { refresh },
          });
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout API call failed:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUserState(null);
      setIsLoading(false);
      toast.success('Logged out successfully');
      router.push('/signin');
    }
  }, [logoutMutation, router]);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback((): boolean => {
    return checkIsAuthenticated();
  }, []);

  return {
    // State
    user,
    isLoading,
    isAuthenticated: checkIsAuthenticated() && !!user,

    // Sign in methods
    signInWithPassword,
    signInWithOTP,
    verifyOTPAndSignIn,

    // Sign up methods
    signUpWithPassword,
    signUpWithOTP,
    verifyOTPAndSignUp,

    // OTP methods
    requestOTP,
    verifyOTP,

    // Token management
    refreshToken,
    logout,

    // Utility
    checkAuth,
  };
};
