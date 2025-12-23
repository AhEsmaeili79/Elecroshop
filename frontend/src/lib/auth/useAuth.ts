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
  useAuthRefreshCreate,
  useAuthLogoutCreate,
} from '@/api/authentication/authentication';
import type {
  OTPRequestRequest,
  PurposeEnum,
} from '@/api/authentication/models';
import type { UserLoginRequest } from '@/api/users/models/userLoginRequest';
import type { UserRegistrationRequest } from '@/api/users/models/userRegistrationRequest';
import type { User } from '@/api/users/models/user';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize user from storage and check authentication
  useEffect(() => {
    const updateAuthState = () => {
      const storedUser = getUser();
      const hasTokens = checkIsAuthenticated();
      
      if (storedUser && hasTokens) {
        setUserState(storedUser);
        setIsAuthenticated(true);
      } else {
        setUserState(null);
        setIsAuthenticated(false);
      }
    };

    // Initial check
    updateAuthState();

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_t' || e.key === 'auth_user' || e.key === null) {
        updateAuthState();
        // Dispatch event after state update
        setTimeout(() => {
          const storedUser = getUser();
          const hasTokens = checkIsAuthenticated();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth-state-changed', { 
              detail: { isAuthenticated: hasTokens && !!storedUser, user: storedUser } 
            }));
          }
        }, 0);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check on focus (in case localStorage was changed in same tab)
    const handleFocus = () => {
      updateAuthState();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Mutations
  const loginMutation = useAuthLoginCreate();
  const registerMutation = useAuthRegisterCreate();
  const otpRequestMutation = useAuthOtpRequestCreate();
  const refreshMutation = useAuthRefreshCreate();
  const logoutMutation = useAuthLogoutCreate();

  /**
   * Helper to handle successful authentication
   */
  const handleAuthSuccess = useCallback((tokens: { access: string; refresh: string }, userData: User) => {
    try {
      console.log('handleAuthSuccess called with:', {
        hasAccessToken: !!tokens?.access,
        hasRefreshToken: !!tokens?.refresh,
        accessTokenLength: tokens?.access?.length,
        refreshTokenLength: tokens?.refresh?.length,
        user: userData
      });

      if (!tokens?.access || !tokens?.refresh) {
        console.error('Invalid tokens provided:', tokens);
        throw new Error('Invalid tokens provided');
      }

      // Save tokens to localStorage
      setTokens(tokens);
      
      // Verify tokens were saved
      const savedAccess = getAccessToken();
      const savedRefresh = getRefreshToken();
      
      if (!savedAccess || !savedRefresh) {
        console.error('Failed to save tokens to localStorage');
        throw new Error('Failed to save tokens');
      }

      console.log('Tokens successfully saved to localStorage');

      // Save user data
      setUser(userData);
      setUserState(userData);
      setIsAuthenticated(true);

      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { isAuthenticated: true, user: userData } }));
      }

      console.log('Authentication state updated successfully');
    } catch (error) {
      console.error('Error in handleAuthSuccess:', error);
      throw error;
    }
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
      
      // customInstance returns data directly, not wrapped in response.data
      if (response?.tokens && response?.user) {
        console.log('Login successful, saving tokens:', { 
          access: response.tokens.access?.substring(0, 20) + '...', 
          refresh: response.tokens.refresh?.substring(0, 20) + '...' 
        });
        handleAuthSuccess(response.tokens, response.user);
        toast.success(response.message || 'Signed in successfully');
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
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
      // Login directly with OTP (verification happens during login)
      const loginData: UserLoginRequest = {
        email_or_phone: identifier,
        otp_code: otpCode,
      };

      const response = await loginMutation.mutateAsync({ data: loginData });

      // customInstance returns data directly, not wrapped in response.data
      if (response?.tokens && response?.user) {
        console.log('OTP login successful, saving tokens');
        handleAuthSuccess(response.tokens, response.user);
        toast.success(response.message || 'Signed in successfully');
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to sign in with OTP';
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
      
      // customInstance returns data directly, not wrapped in response.data
      if (response?.tokens && response?.user) {
        console.log('Signup successful, saving tokens');
        handleAuthSuccess(response.tokens, response.user);
        toast.success(response.message || 'Account created successfully');
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
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
      // Register with OTP directly (OTP validation validation happens during registration)
      const parsed = parseIdentifier(identifier);
      const registerData: UserRegistrationRequest = {
        email: parsed.email,
        phone: parsed.phone,
        password,
        otp_code: otpCode,
      };

      const response = await registerMutation.mutateAsync({ data: registerData });

      // customInstance returns data directly, not wrapped in response.data
      if (response?.tokens && response?.user) {
        console.log('OTP signup successful, saving tokens');
        handleAuthSuccess(response.tokens, response.user);
        toast.success(response.message || 'Account created successfully');
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
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
   * Refresh access token
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refresh = getRefreshToken();
    if (!refresh) {
      setIsAuthenticated(false);
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
        setIsAuthenticated(true);
        return true;
      }
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      // Refresh failed, clear tokens
      clearTokens();
      setUserState(null);
      setIsAuthenticated(false);
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
      setIsAuthenticated(false);
      setIsLoading(false);
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { isAuthenticated: false, user: null } }));
      }
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
    isAuthenticated,

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

    // Token management
    refreshToken,
    logout,

    // Utility
    checkAuth,
  };
};

