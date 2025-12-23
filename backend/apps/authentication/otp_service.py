"""
OTP Service for generating, storing, and verifying OTP codes.
Handles rate limiting, Redis storage with hashing, and expiration.
"""
import hashlib
import logging
import random
import time
from typing import Optional, Tuple

import redis
from django.conf import settings

logger = logging.getLogger('apps.authentication')

# Redis connection - lazy initialization
_redis_client = None

def get_redis_client():
    """Get or create Redis client."""
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            decode_responses=False  # We need bytes for hashing
        )
    return _redis_client


class OTPService:
    """Service for OTP generation, storage, and verification."""
    
    # OTP configuration
    OTP_LENGTH = 6
    OTP_EXPIRATION_SECONDS = 180  # 3 minutes
    OTP_MAX_ATTEMPTS = 3
    OTP_COOLDOWN_SECONDS = 60  # 1 minute between requests
    OTP_LOCKOUT_SECONDS = 3600  # 1 hour lockout after 3 requests
    
    @staticmethod
    def generate_otp() -> str:
        """Generate a random 6-digit OTP code."""
        return str(random.randint(100000, 999999))
    
    @staticmethod
    def hash_otp(otp: str) -> str:
        """Hash OTP using SHA256."""
        return hashlib.sha256(otp.encode()).hexdigest()
    
    @staticmethod
    def get_redis_keys(identifier: str, purpose: str) -> dict:
        """
        Get all Redis keys for a given identifier and purpose.
        
        Args:
            identifier: Email or phone number
            purpose: 'register' or 'login'
            
        Returns:
            Dictionary with all Redis keys
        """
        prefix = f"otp:{purpose}:{identifier}"
        return {
            'otp_hash': f"{prefix}:hash",
            'attempts': f"{prefix}:attempts",
            'last_request': f"{prefix}:last_request",
            'lockout': f"{prefix}:lockout",
            'request_count': f"{prefix}:request_count",
            'request_times': f"{prefix}:request_times",
        }
    
    @classmethod
    def check_rate_limit(cls, identifier: str, purpose: str) -> Tuple[bool, Optional[str]]:
        """
        Check if OTP request is allowed based on rate limiting rules.
        
        Rules:
        - 3 requests maximum
        - 1 minute cooldown between requests
        - 1 hour lockout after 3 consecutive requests
        
        Args:
            identifier: Email or phone number
            purpose: 'register' or 'login'
            
        Returns:
            Tuple of (is_allowed, error_message)
        """
        keys = cls.get_redis_keys(identifier, purpose)
        redis_client = get_redis_client()
        
        # Check lockout (1 hour after 3 requests)
        lockout_until = redis_client.get(keys['lockout'])
        if lockout_until:
            lockout_time = int(lockout_until)
            current_time = int(time.time())
            if current_time < lockout_time:
                remaining = lockout_time - current_time
                minutes = remaining // 60
                seconds = remaining % 60
                return False, f"Too many OTP requests. Please wait {minutes}m {seconds}s before requesting again."
        
        # Check cooldown (1 minute between requests)
        last_request = redis_client.get(keys['last_request'])
        if last_request:
            last_request_time = int(last_request)
            current_time = int(time.time())
            elapsed = current_time - last_request_time
            
            if elapsed < cls.OTP_COOLDOWN_SECONDS:
                remaining = cls.OTP_COOLDOWN_SECONDS - elapsed
                return False, f"Please wait {remaining} seconds before requesting another OTP."
        
        # Check request count
        request_count = redis_client.get(keys['request_count'])
        if request_count:
            count = int(request_count)
            current_time = int(time.time())
            
            # Check if requests were consecutive (within 5 minutes)
            request_times_str = redis_client.get(keys['request_times'])
            if request_times_str:
                request_times = [int(t) for t in request_times_str.decode().split(',') if t]
                
                # Check if all 3 requests were within 5 minutes
                if len(request_times) >= cls.OTP_MAX_ATTEMPTS:
                    time_span = current_time - request_times[0]
                    if time_span < 300:  # 5 minutes
                        # Apply 1 hour lockout
                        lockout_until = current_time + cls.OTP_LOCKOUT_SECONDS
                        redis_client.setex(keys['lockout'], cls.OTP_LOCKOUT_SECONDS, lockout_until)
                        return False, "Too many consecutive OTP requests. Please wait 1 hour before requesting again."
        
        return True, None
    
    @classmethod
    def generate_and_store_otp(cls, identifier: str, purpose: str) -> Tuple[str, bool, Optional[str]]:
        """
        Generate OTP, store in Redis with hashing, and handle rate limiting.
        
        Args:
            identifier: Email or phone number
            purpose: 'register' or 'login'
            
        Returns:
            Tuple of (otp_code, success, error_message)
        """
        # Check rate limiting
        is_allowed, error_message = cls.check_rate_limit(identifier, purpose)
        if not is_allowed:
            return "", False, error_message
        
        # Generate OTP
        otp_code = cls.generate_otp()
        otp_hash = cls.hash_otp(otp_code)
        
        keys = cls.get_redis_keys(identifier, purpose)
        redis_client = get_redis_client()
        current_time = int(time.time())
        
        # Store hashed OTP with expiration
        redis_client.setex(keys['otp_hash'], cls.OTP_EXPIRATION_SECONDS, otp_hash.encode())
        
        # Update request tracking
        redis_client.setex(keys['last_request'], cls.OTP_COOLDOWN_SECONDS, current_time)
        
        # Update request count and times
        request_count = redis_client.incr(keys['request_count'])
        redis_client.expire(keys['request_count'], 3600)  # Expire after 1 hour
        
        # Store request times (keep last 3)
        request_times_str = redis_client.get(keys['request_times'])
        if request_times_str:
            request_times = [t for t in request_times_str.decode().split(',') if t]
            request_times.append(str(current_time))
            # Keep only last 3
            request_times = request_times[-3:]
        else:
            request_times = [str(current_time)]
        
        redis_client.setex(keys['request_times'], 3600, ','.join(request_times))
        
        logger.info(
            f"OTP generated for {purpose}: identifier={identifier}, "
            f"request_count={request_count}"
        )
        
        return otp_code, True, None
    
    @classmethod
    def verify_otp(cls, identifier: str, purpose: str, otp_code: str) -> Tuple[bool, Optional[str]]:
        """
        Verify OTP code against stored hash.
        
        Args:
            identifier: Email or phone number
            purpose: 'register' or 'login'
            otp_code: OTP code to verify
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        keys = cls.get_redis_keys(identifier, purpose)
        redis_client = get_redis_client()
        
        # Get stored hash
        stored_hash = redis_client.get(keys['otp_hash'])
        if not stored_hash:
            return False, "OTP code has expired or does not exist."
        
        # Hash the provided OTP
        provided_hash = cls.hash_otp(otp_code)
        
        # Compare hashes (constant-time comparison)
        if not hashlib.compare_digest(stored_hash.decode(), provided_hash):
            # Increment failed attempts
            attempts = redis_client.incr(keys['attempts'])
            redis_client.expire(keys['attempts'], cls.OTP_EXPIRATION_SECONDS)
            
            if attempts >= 3:
                # Delete OTP after 3 failed attempts
                redis_client.delete(keys['otp_hash'])
                return False, "Too many failed attempts. OTP code has been invalidated."
            
            return False, f"Invalid OTP code. {3 - attempts} attempts remaining."
        
        # OTP is valid - delete it and reset attempts
        redis_client.delete(keys['otp_hash'])
        redis_client.delete(keys['attempts'])
        redis_client.delete(keys['request_count'])
        redis_client.delete(keys['request_times'])
        
        logger.info(f"OTP verified successfully for {purpose}: identifier={identifier}")
        return True, None
    
    @classmethod
    def clear_otp_data(cls, identifier: str, purpose: str) -> None:
        """Clear all OTP-related data for an identifier."""
        keys = cls.get_redis_keys(identifier, purpose)
        redis_client = get_redis_client()
        for key in keys.values():
            redis_client.delete(key)
