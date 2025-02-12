import requests
import os
import logging
from django.conf import settings
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.response import Response
from product.models import ProductColorQuantity
from .models import Order, ShipmentPrice, Payment
from .serializers import OrderSerializer, ShipmentPriceSerializer
from .permissions import IsCustomerOrSeller
from rest_framework.viewsets import ModelViewSet
from django.http import JsonResponse
from dotenv import load_dotenv
from cart.models import get_or_create_cart
from utils.utils import get_persian_datetime
persian_date, persian_time = get_persian_datetime()

load_dotenv()

ZARINPAL_REQUEST_URL = os.getenv('ZARINPAL_REQUEST_URL')
ZARINPAL_VERIFY_URL = os.getenv('ZARINPAL_VERIFY_URL')
ZARINPAL_STARTPAY_URL = os.getenv('ZARINPAL_STARTPAY_URL')

logger = logging.getLogger(__name__)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsCustomerOrSeller]

    def get_queryset(self):
        user = self.request.user
        order_code = self.request.query_params.get('order_code', None)
        
        if order_code:
            return Order.objects.filter(order_code=order_code)
        
        if user.role == 'admin':
            return Order.objects.all()
        
        if user.role == 'seller':
            return Order.objects.filter(items__product__seller=user).distinct()
        
        else:
            return Order.objects.filter(user=user)


    def perform_create(self, serializer):
        cart = get_or_create_cart(self.request.user)
        cart_items = cart.cart_items.all()

        items_data = []

        for item in cart_items:
            product = item.product
            color = item.color
            quantity = item.quantity

            try:
                product_color_quantity = product.productcolorquantity_set.get(color=color)
                available_quantity = product_color_quantity.quantity
            except ProductColorQuantity.DoesNotExist:
                return Response({"detail": f"Color {color.color_hex} not available for product {product.name}."}, status=status.HTTP_400_BAD_REQUEST)

            if quantity > available_quantity:
                return Response(
                    {"detail": f"Not enough stock for color {color.color_hex} of {product.name}. Available: {available_quantity}, Requested: {quantity}."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            items_data.append({
                "product": item.product,
                "quantity": item.quantity,
                "color": item.color,
            })
            
        try:
            shipment_price = ShipmentPrice.objects.get(id=self.request.data['shipment_price'])
        except ShipmentPrice.DoesNotExist:
            return Response({"detail": "Invalid shipment price."}, status=status.HTTP_400_BAD_REQUEST)

        serializer.context["items_data"] = items_data

        order = serializer.save(user=self.request.user, shipment_price=shipment_price)

        for item in cart_items:
            product = item.product
            color = item.color
            quantity = item.quantity

            try:
                product_color_quantity = product.productcolorquantity_set.get(color=color)
                product_color_quantity.quantity -= quantity
                product_color_quantity.save() 
            except ProductColorQuantity.DoesNotExist:
                pass  
        
        cart_items.delete()

        if order.payment_type in ['credit_card', 'درگاه پرداخت']:
            return self.redirect_to_zarinpal(order)


    def redirect_to_zarinpal(self, order):
        merchant_id = os.getenv('ZARINPAL_MERCHANT_ID')
        amount = order.total_amount * 10  
        callback_url = os.getenv('CALLBACK_URL')
        
        try:
            logger.info(f"Sending payment request to ZarinPal for Order #{order.id} with amount: {amount}")
            response = requests.post(ZARINPAL_REQUEST_URL, json={
                'merchant_id': merchant_id,
                'amount': amount,
                'callback_url': callback_url,
                'description': f'Order #{order.id} Payment',
                
            })

            response_data = response.json()
            logger.info(f"ZarinPal response for Order #{order.id}: {response_data}")

            if response_data.get('data', {}).get('code') == 100:
                authority = response_data['data']['authority']

                payment, created = Payment.objects.get_or_create(order=order)
                payment.authority = authority
                payment.status = 'pending'
                payment.save()

                payment_url = f'{ZARINPAL_STARTPAY_URL}{authority}'
                return Response({'payment_url': payment_url, 'authority': authority})
            else:
                logger.error(f"ZarinPal payment request failed with code: {response_data.get('data', {}).get('code')}")
                return Response({'detail': 'ZarinPal payment request failed.'}, status=400)
        except Exception as e:
            logger.error(f"Error during ZarinPal payment request: {str(e)}")
            return Response({'detail': 'Error during payment request.'}, status=500)
        
    def retrieve(self, request, *args, **kwargs):

        order = self.get_object()
        
        order_data = OrderSerializer(order).data
        order_data['payment_status'] = order.payment_status
        
        return Response(order_data)
        
def payment_callback(request):
    authority = request.GET.get('Authority')
    status = request.GET.get('Status')
    logger.info("Callback view reached")
    logger.info(f"Payment callback received with Authority: {authority}, Status: {status}")
    
    if status == 'OK':
        payment = Payment.objects.filter(authority=authority).first()

        if payment:
            order = payment.order
            logger.info(f"Verifying payment for Order #{order.id} with Authority: {authority}")

            response = requests.post(ZARINPAL_VERIFY_URL, json={
                'merchant_id': os.getenv('ZARINPAL_MERCHANT_ID'),
                'amount': order.total_amount * 10, 
                'authority': authority
            })
            
            response_data = response.json()

            logger.info(f"ZarinPal verification response: {response_data}")

            payment_code = response_data.get('data', {}).get('code')
            if payment_code == 100 or (payment_code == 101 and payment.status != 'paid'):
                print("100",payment_code)
                ref_id = response_data['data']['ref_id']
                
                payment.status = 'paid'
                payment.transaction_ref_id = ref_id
                payment.save()
                
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

    elif status == 'NOK':
        payment = Payment.objects.filter(authority=authority).first()

        if payment:
            order = payment.order
            logger.info(f"Payment failed for Order #{order.id} with Authority: {authority}")

            payment.status = 'failed'
            payment.save()

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
