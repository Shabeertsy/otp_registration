# Generated by Django 5.2.4 on 2025-07-13 08:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_userprofile_is_verified_alter_userprofile_is_staff'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userotp',
            name='timestamp',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
