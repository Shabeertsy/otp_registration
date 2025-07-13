from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterAPIView.as_view(), name='register'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('verify-otp/', views.OTPVerficationAPIView.as_view(), name='verify_otp'),
    path('resend-otp/', views.ResendOTPAPIView.as_view(), name='resend_otp'),
]
