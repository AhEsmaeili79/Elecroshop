import requests
import logging
from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from .models import Order, ShipmentPrice, Payment
from .serializers import OrderSerializer, ShipmentPriceSerializer
from cart.models import get_or_create_cart
from .permissions import IsCustomerOrSeller
from rest_framework.viewsets import ModelViewSet
from django.http import JsonResponse

from utils.utils import get_persian_datetime
persian_date, persian_time = get_persian_datetime()

# ZarinPal API URLs
ZARINPAL_REQUEST_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json'
ZARINPAL_VERIFY_URL = 'https://api.zarinpal.com/pg/v4/payment/verify.json'
ZARINPAL_STARTPAY_URL = 'https://www.zarinpal.com/pg/StartPay/'

# Logger setup
logger = logging.getLogger(__name__)

class OrderViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing order instances.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsCustomerOrSeller]

    def get_queryset(self):
        user = self.request.user
        order_code = self.request.query_params.get('order_code', None)
        
        if order_code:
            return Order.objects.filter(order_code=order_code)
        
        if user.role == 'seller':
            return Order.objects.filter(items__product__seller=user).distinct()
        else:
            return Order.objects.filter(user=user)


    def perform_create(self, serializer):
        """
        Create a new order instance, link it to the user's cart, and handle payment.
        """
        cart = get_or_create_cart(self.request.user)
        cart_items = cart.cart_items.all()

        # Prepare items data from the cart
        items_data = [
            {
                "product": item.product,
                "quantity": item.quantity,
                "color": item.color,
            }
            for item in cart_items
        ]

        # Retrieve the shipment price directly using the passed ID
        shipment_price = ShipmentPrice.objects.get(id=self.request.data['shipment_price'])

        # Pass items_data into the serializer context
        serializer.context["items_data"] = items_data

        # Save the order and link the cart items
        order = serializer.save(user=self.request.user, shipment_price=shipment_price)

        # Link cart items to the order
        cart_items.delete()  # Clear the cart items

        # Now, handle the payment and generate authority from ZarinPal
        if order.payment_type in ['credit_card', 'درگاه پرداخت']:
            return self.redirect_to_zarinpal(order)

    def redirect_to_zarinpal(self, order):
        """
        Call ZarinPal API to initiate the payment process and generate an authority.
        """
        merchant_id = settings.ZARINPAL_MERCHANT_ID
        amount = order.total_amount * 10  # Convert to Rials
        callback_url = 'http://localhost:5173/payment/callback/'  # Ensure this is correct
        metadata = {'mobile': order.user.phonenumber, 'email': order.user.email}

        try:
            logger.info(f"Sending payment request to ZarinPal for Order #{order.id} with amount: {amount}")
            response = requests.post(ZARINPAL_REQUEST_URL, json={
                'merchant_id': merchant_id,
                'amount': amount,
                'callback_url': callback_url,
                'description': f'Order #{order.id} Payment',
                'metadata': metadata
            })

            response_data = response.json()
            logger.info(f"ZarinPal response for Order #{order.id}: {response_data}")

            if response_data.get('data', {}).get('code') == 100:
                # Extract the authority from the response
                authority = response_data['data']['authority']

                # Create or update the Payment object for this order
                payment, created = Payment.objects.get_or_create(order=order)
                payment.authority = authority
                payment.status = 'pending'
                payment.save()

                # Return the payment URL along with the authority
                payment_url = f'{ZARINPAL_STARTPAY_URL}{authority}'
                return Response({'payment_url': payment_url, 'authority': authority})  # Include authority in the response
            else:
                logger.error(f"ZarinPal payment request failed with code: {response_data.get('data', {}).get('code')}")
                return Response({'detail': 'ZarinPal payment request failed.'}, status=400)
        except Exception as e:
            logger.error(f"Error during ZarinPal payment request: {str(e)}")
            return Response({'detail': 'Error during payment request.'}, status=500)
        
    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve order details along with payment status.
        """
        order = self.get_object()
        
        # Include the payment status in the response
        order_data = OrderSerializer(order).data
        order_data['payment_status'] = order.payment_status
        
        return Response(order_data)
        
def payment_callback(request):
    authority = request.GET.get('Authority')
    status = request.GET.get('Status')
    logger.info("Callback view reached")
    logger.info(f"Payment callback received with Authority: {authority}, Status: {status}")
    
    # Check if the status is 'OK' (payment was successful)
    if status == 'OK':
        # Find the payment record based on the authority returned by ZarinPal
        payment = Payment.objects.filter(authority=authority).first()

        if payment:
            order = payment.order
            logger.info(f"Verifying payment for Order #{order.id} with Authority: {authority}")

            # Verify the payment with ZarinPal
            response = requests.post(ZARINPAL_VERIFY_URL, json={
                'merchant_id': settings.ZARINPAL_MERCHANT_ID,
                'amount': order.total_amount * 10,  # Convert to Rials
                'authority': authority
            })
            
            response_data = response.json()

            logger.info(f"ZarinPal verification response: {response_data}")

            # Check if the response code from ZarinPal is successful
            payment_code = response_data.get('data', {}).get('code')
            if payment_code == 100 or (payment_code == 101 and payment.status != 'paid'):
                print("100",payment_code)
                ref_id = response_data['data']['ref_id']
                
                # Update payment status and save transaction reference ID
                payment.status = 'paid'
                payment.transaction_ref_id = ref_id
                payment.save()
                
                # Update order status to successful
                order.payment_status = 'paid'
                order.status = 'successful'
                order.save()

                logger.info(f"Payment for Order #{order.id} confirmed, Ref ID: {ref_id}")
                return JsonResponse({'message': 'Payment successful', 'ref_id': ref_id, 'payment_status': payment.status, 'order_code': order.order_code})
            
            elif payment_code == 101:
                print("101",payment_code)
                logger.info(f"Payment already verified for Order #{order.id}.")
                return JsonResponse({'message': 'Payment already verified', 'ref_id': payment.transaction_ref_id, 'payment_status': payment.status, 'order_code': order.order_code})
            else:
                logger.error(f"Payment verification failed for Order #{order.id}. ZarinPal code: {payment_code}")
                return JsonResponse({'message': 'Payment verification failed', 'payment_status': payment.status, 'order_code': order.order_code})
        else:
            logger.error(f"Payment record not found for Authority: {authority}")
            return JsonResponse({'message': 'Payment record not found'}, status=404)

    # If the status is 'NOK' (payment failed or canceled)
    elif status == 'NOK':
        # Find the payment record based on the authority
        payment = Payment.objects.filter(authority=authority).first()

        if payment:
            order = payment.order
            logger.info(f"Payment failed for Order #{order.id} with Authority: {authority}")

            # Update payment status to 'failed'
            payment.status = 'failed'
            payment.save()

            # Update order status to 'canceled'
            order.status = 'canceled'
            order.payment_status = 'failed'
            order.save()

            logger.info(f"Payment for Order #{order.id} failed, order canceled.")
            return JsonResponse({'message': 'Payment failed and order canceled', 'payment_status': payment.status, 'order_code': order.order_code, 'payment_date': payment.created_at})
        else:
            logger.error(f"Payment record not found for Authority: {authority}")
            return JsonResponse({'message': 'Payment record not found'}, status=404)

    else:
        logger.error(f"Invalid payment status received. Status: {status}")
        return JsonResponse({'message': 'Invalid payment status received'}, status=400)


class ShipmentPriceViewSet(ModelViewSet):
    queryset = ShipmentPrice.objects.all()
    serializer_class = ShipmentPriceSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticatedOrReadOnly()]
        return [IsAdminUser()]
