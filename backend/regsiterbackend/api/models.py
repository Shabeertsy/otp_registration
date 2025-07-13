from django.utils import timezone
from django.db import models

from django.contrib.auth.models import AbstractUser
from django.db import models



class UserProfile(AbstractUser):
    phone = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []


    def __str__(self):
        return self.phone


class UserOTP(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    otp = models.CharField(max_length=4,null=True, blank=True)
    timestamp = models.DateTimeField(null=True, blank=True)
    def is_valid(self):
        return timezone.now() < self.timestamp + timezone.timedelta(minutes=5)

    def __str__(self):
        return f"OTP for {self.user.first_name} - {self.otp}"
    
    class Meta:
        verbose_name = 'User OTP'
        verbose_name_plural = 'User OTPs'