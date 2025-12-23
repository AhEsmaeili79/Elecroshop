"""
Celery tasks for sending OTP via SMS and Email.
"""
import logging
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import requests
from celery import shared_task
from django.conf import settings

logger = logging.getLogger('apps.authentication')


@shared_task(bind=True, max_retries=3)
def send_sms_otp(self, phone: str, otp_code: str):
    """
    Send OTP code via SMS using Melipayamak API.
    
    Args:
        phone: Phone number to send SMS to
        otp_code: OTP code to send
        
    Returns:
        dict: Result of SMS sending operation
    """
    # Check if in development mode
    is_development = os.environ.get('DEVELOPMENT', 'False').lower() == 'true'
    
    if is_development:
        logger.info(f"[DEV MODE] SMS OTP would be sent to {phone}: {otp_code}")
        return {
            'success': True,
            'message': 'OTP sent (dev mode)',
            'otp_code': otp_code,  # Return OTP in dev mode
            'phone': phone
        }
    
    try:
        # Melipayamak API configuration
        api_url = os.environ.get('sms_api_url', '')
        api_key = os.environ.get('sms_api_key', '')
        from_number = os.environ.get('sms_from_number', '')
        
        if not all([api_url, api_key, from_number]):
            logger.error("SMS API configuration is missing")
            raise ValueError("SMS API configuration is missing")
        
        # Prepare SMS text
        sms_text = f"کد OTP شما: {otp_code}"
        
        # Send SMS via Melipayamak API
        response = requests.post(
            api_url,
            json={
                'to': phone,
                'from': from_number,
                'text': sms_text
            },
            headers={
                'Content-Type': 'application/json',
                'X-API-KEY': api_key
            },
            timeout=30  # Increased timeout for better reliability
        )
        
        # Log full response for debugging
        logger.info(f"SMS API response: status={response.status_code}, body={response.text}")
        
        if response.status_code == 200:
            try:
                response_data = response.json() if response.text else {}
                # Check if API response indicates success
                # Melipayamak typically returns {"StrRetStatus": "Ok", ...} or similar
                if isinstance(response_data, dict):
                    # Check common success indicators
                    str_ret_status = response_data.get('StrRetStatus', '').lower()
                    status = response_data.get('status', '').lower()
                    result = response_data.get('result', '').lower()

                    # Check for success conditions
                    success_conditions = [
                        str_ret_status == 'ok',
                        status == 'success',
                        result == 'success',
                        # Handle Persian success messages if any
                        status in ['ارسال شد', 'sent', 'ok']
                    ]

                    if any(success_conditions):
                        logger.info(f"SMS OTP sent successfully to {phone}")
                        return {
                            'success': True,
                            'message': 'OTP sent successfully',
                            'phone': phone
                        }
                    else:
                        # Check for known error conditions
                        error_conditions = [
                            status in ['ارسال نشده', 'not sent', 'failed', 'error'],
                            str_ret_status in ['failed', 'error'],
                            result in ['failed', 'error']
                        ]

                        if any(error_conditions):
                            error_msg = response_data.get('message') or response_data.get('StrRetStatus') or response_data.get('status') or str(response_data)
                            logger.error(f"SMS API returned error in response body: {error_msg}")
                            raise Exception(f"SMS API error: {error_msg}")
                        else:
                            # Unknown status, log it but assume success for backward compatibility
                            logger.warning(f"SMS API returned unknown status: {response_data}")
                            logger.info(f"SMS OTP sent successfully to {phone} (unknown status)")
                            return {
                                'success': True,
                                'message': 'OTP sent successfully',
                                'phone': phone
                            }
                else:
                    # If response is not JSON or doesn't have expected format, assume success if status is 200
                    logger.info(f"SMS OTP sent successfully to {phone} (status 200)")
                    return {
                        'success': True,
                        'message': 'OTP sent successfully',
                        'phone': phone
                    }
            except ValueError:
                # Response is not JSON, but status is 200, assume success
                logger.info(f"SMS OTP sent successfully to {phone} (non-JSON response with status 200)")
                return {
                    'success': True,
                    'message': 'OTP sent successfully',
                    'phone': phone
                }
        else:
            logger.error(f"Failed to send SMS OTP: {response.status_code} - {response.text}")
            raise Exception(f"SMS API returned status {response.status_code}: {response.text}")
            
    except Exception as exc:
        logger.error(f"Error sending SMS OTP to {phone}: {str(exc)}")

        # Check if this is a retryable error
        exc_str = str(exc).lower()
        retryable_errors = ['timeout', 'connection', 'network', 'read timed out']

        # Don't retry for configuration errors or permanent failures
        if 'api configuration' in exc_str or 'api key' in exc_str or 'invalid' in exc_str:
            logger.error(f"Not retrying SMS OTP for {phone} due to configuration error")
            raise exc

        # Check if we've exhausted retries
        retry_count = getattr(self, 'request', {}).get('retries', 0)
        max_retries = getattr(self, 'max_retries', 3)

        if retry_count >= max_retries:
            # In development mode, log the OTP for testing purposes
            if is_development:
                logger.warning(f"[DEV MODE] SMS failed after {max_retries} retries. OTP for {phone}: {otp_code}")
                logger.warning("Consider using email OTP or checking SMS API configuration")
            else:
                logger.error(f"SMS OTP failed permanently for {phone} after {max_retries} retries")
            raise exc

        # Calculate exponential backoff for retries
        countdown = min(60 * (2 ** retry_count), 300)  # Exponential backoff, max 5 minutes

        # Retry the task with exponential backoff
        logger.info(f"Retrying SMS OTP for {phone} in {countdown} seconds (attempt {retry_count + 1})")
        raise self.retry(exc=exc, countdown=countdown)


@shared_task(bind=True, max_retries=3)
def send_email_otp(self, email: str, otp_code: str):
    """
    Send OTP code via Email using SMTP.
    
    Args:
        email: Email address to send OTP to
        otp_code: OTP code to send
        
    Returns:
        dict: Result of email sending operation
    """
    # Check if in development mode
    is_development = os.environ.get('DEVELOPMENT', 'False').lower() == 'true'

    if is_development:
        logger.info(f"[DEV MODE] Email OTP would be sent to {email}: {otp_code}")
        return {
            'success': True,
            'message': 'OTP sent (dev mode)',
            'otp_code': otp_code,  # Return OTP in dev mode
            'email': email
        }

    # Check if in production test mode (from environment variable)
    # Set PRODUCTION_TEST_MODE=True for testing production flow without real emails
    production_test_mode = os.environ.get('PRODUCTION_TEST_MODE', 'False').lower() == 'true'

    if production_test_mode:
        logger.info(f"[PRODUCTION TEST MODE] Email OTP would be sent to {email}: {otp_code}")
        return {
            'success': True,
            'message': 'OTP sent (production test mode)',
            'otp_code': otp_code,  # Return OTP for testing
            'email': email
        }
    
    try:
        # SMTP configuration
        smtp_server = os.environ.get('smtp_server', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('smtp_port', '587'))
        smtp_username = os.environ.get('gmail_username', '')
        smtp_password = os.environ.get('gmail_app_password', '')
        
        if not all([smtp_server, smtp_username, smtp_password]):
            logger.error("Email SMTP configuration is missing")
            raise ValueError("Email SMTP configuration is missing")
        
        # Create email message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = 'Your OTP Code'
        msg['From'] = smtp_username
        msg['To'] = email
        
        # Email body
        html_body = f"""
        <html>
          <body>
            <h2>Your OTP Code</h2>
            <p>Your OTP code is: <strong>{otp_code}</strong></p>
            <p>This code will expire in 3 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </body>
        </html>
        """
        
        text_body = f"""
        Your OTP Code
        
        Your OTP code is: {otp_code}
        This code will expire in 3 minutes.
        
        If you didn't request this code, please ignore this email.
        """
        
        # Attach parts
        part1 = MIMEText(text_body, 'plain')
        part2 = MIMEText(html_body, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        
        logger.info(f"Email OTP sent successfully to {email}")
        return {
            'success': True,
            'message': 'OTP sent successfully',
            'email': email
        }
        
    except Exception as exc:
        logger.error(f"Error sending email OTP to {email}: {str(exc)}")
        # Retry the task
        raise self.retry(exc=exc, countdown=60)
