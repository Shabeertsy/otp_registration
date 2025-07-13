from django.contrib import admin

# Register your models here.
from .models import UserProfile, UserOTP

admin.site.register(UserProfile)
admin.site.register(UserOTP)