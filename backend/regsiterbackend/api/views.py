from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
import re
import random
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import UserProfile, UserOTP
from decouple import config
from decouple import config, UndefinedValueError
from twilio.rest import Client




def generate_otp(user, phone):
    otp = str(random.randint(1000, 9999))
    user_otp, created = UserOTP.objects.get_or_create(user=user)
    user_otp.otp = otp
    user_otp.timestamp = timezone.now()
    user_otp.save()
    return otp


# def send_otp_via_sms(phone, otp):
#     print(f"Sending OTP {otp} to phone number {phone}")
#     return True 



def send_otp_via_sms(phone, otp):
    try:
        account_sid = config('TWILIO_ACCOUNT_SID')
        auth_token = config('TWILIO_AUTH_TOKEN')
        twilio_number = config('TWILIO_PHONE_NUMBER')
    except UndefinedValueError as e:
        print(f"Missing environment variable: {e}")
        return None

    try:
        print(f"Sending OTP {otp} to phone number {phone}")
        client = Client(account_sid, auth_token)

        message = client.messages.create(
            body=f'Your OTP is {otp}',
            from_=twilio_number,
            to=f'+91{phone}'
        )

        return True if message.sid else False

    except Exception as e:
        print(f"Error sending SMS: {e}")
        return None




## Register API View
class RegisterAPIView(APIView):
    def post(self, request):
        required_fields = [ "first_name", "last_name", "email", "password", "phone"]
        for field in required_fields:
            if field not in request.data:
                return Response({"message": f"{field} is required"},
                                 status=status.HTTP_400_BAD_REQUEST)
            
        phone = request.data.get("phone")
        pattern = r'^[6-9]\d{9}$'
        if not phone or not re.match(pattern, phone):
            return Response({'error': 'Invalid phone number. Enter a valid 10-digit Indian mobile number.'},
                             status=400)
        

        try:
            user = UserProfile.objects.create_user(
            username=phone,
            first_name=request.data.get("first_name"),
            last_name=request.data.get("last_name"),
            email=request.data.get("email"),
            password=request.data.get("password"),
            phone=phone
            )
          
        except Exception as e:
            return Response({"message": str(e)},
                             status=status.HTTP_400_BAD_REQUEST)

        otp = generate_otp(user, phone)
        if otp:
            if send_otp_via_sms(phone, otp):
                return Response({"message": "User registered successfully! OTP sent via SMS."},
                                 status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Failed to send OTP via SMS."},
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"message": "Failed to generate OTP."},
                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OTPVerficationAPIView(APIView):
    def post(self, request):
        otp = request.data.get("otp")
        phone = request.data.get("phone")
        by_phone= request.data.get("by_phone", False)

        if not otp or not phone:
            return Response({"message": "OTP and phone number are required"},
                             status=status.HTTP_400_BAD_REQUEST)
        try:
            user = UserProfile.objects.get(phone=phone)
        except UserProfile.DoesNotExist:
            return Response({"message": "User with this phone number does not exist"},
                             status=status.HTTP_404_NOT_FOUND)
        
        user_otp = get_object_or_404(UserOTP, user=user, otp=otp)
        if not user_otp.is_valid() or user_otp.otp != otp:
            return Response({"message": "OTP has expired"},
                             status=status.HTTP_400_BAD_REQUEST)
        
        if by_phone:
            if user.is_verified:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login successful",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    'username':user.first_name + " " + user.last_name,
                }, status=status.HTTP_200_OK)
            else:
                return Response({"message": "User is not verified"},
                                 status=status.HTTP_401_UNAUTHORIZED)
            

        user_otp.delete()
        user.is_verified = True
        user.save()
        return Response({"message": "OTP verification successful"},
                         status=status.HTTP_200_OK)
    

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get("phone")
        password = request.data.get("password")

        
        if not username or not password:
            return Response({"message": "Username and password are required"},
                             status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_verified:
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login successful",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    'username':user.first_name + " " + user.last_name,
                }, status=status.HTTP_200_OK)
            else:
                return Response({"message": "User is not verified"},
                                 status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"message": "Invalid credentials"},
                             status=status.HTTP_401_UNAUTHORIZED)
        

class ResendOTPAPIView(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response({"message": "Phone number is required"},
                             status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = UserProfile.objects.get(phone=phone)
        except UserProfile.DoesNotExist:
            return Response({"message": "User with this phone number does not exist"},
                             status=status.HTTP_404_NOT_FOUND)

        otp = generate_otp(user, phone)
        if otp:
            if send_otp_via_sms(phone, otp):
                return Response({"message": "OTP resent successfully!"},
                                 status=status.HTTP_200_OK)
            else:
                return Response({"message": "Failed to send OTP via SMS."},
                                 status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"message": "Failed to generate OTP."},
                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)