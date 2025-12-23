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
            timeout=10
        )
        
        if response.status_code == 200:
            logger.info(f"SMS OTP sent successfully to {phone}")
            return {
                'success': True,
                'message': 'OTP sent successfully',
                'phone': phone
            }
        else:
            logger.error(f"Failed to send SMS OTP: {response.status_code} - {response.text}")
            raise Exception(f"SMS API returned status {response.status_code}")
            
    except Exception as exc:
        logger.error(f"Error sending SMS OTP to {phone}: {str(exc)}")
        # Retry the task
        raise self.retry(exc=exc, countdown=60)


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
