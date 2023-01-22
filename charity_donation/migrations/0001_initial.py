# Generated by Django 4.1.5 on 2023-01-19 08:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Institution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('type', models.SmallIntegerField(choices=[(1, 'Fundation 1'), (2, 'Fundation 2'), (3, 'Fundation 3'), (4, 'Fundation 4'), (5, 'Fundation 5'), (6, 'Fundation 6'), (7, 'Fundation 7')])),
                ('categories', models.ManyToManyField(to='charity_donation.category')),
            ],
        ),
        migrations.CreateModel(
            name='Donation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=0)),
                ('address', models.CharField(max_length=255)),
                ('phone_number', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=255)),
                ('zip_code', models.CharField(max_length=255)),
                ('pick_up_date', models.DateField()),
                ('pick_up_time', models.TimeField()),
                ('pick_up_comment', models.TextField()),
                ('categories', models.ManyToManyField(to='charity_donation.category')),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='charity_donation.institution')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
