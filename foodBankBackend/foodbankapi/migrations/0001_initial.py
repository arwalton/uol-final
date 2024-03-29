# Generated by Django 5.0 on 2024-02-21 18:09

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
import django_countries.fields
import phonenumber_field.modelfields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('street', models.CharField(max_length=255, verbose_name='street')),
                ('city', models.CharField(max_length=128, verbose_name='city')),
                ('state', models.CharField(blank=True, max_length=64, verbose_name='state')),
                ('country', django_countries.fields.CountryField(max_length=2)),
                ('postalCode', models.CharField(max_length=16, verbose_name='postal code')),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='name')),
                ('category', models.CharField(choices=[('BE', 'Beverages'), ('BA', 'Baking'), ('BR', 'Breads'), ('CH', 'Cheeses'), ('DE', 'Desserts'), ('DR', 'Dry goods'), ('EG', 'Eggs'), ('FA', 'Fats'), ('FZ', 'Frozen foods'), ('FR', 'Fruits'), ('PR', 'Proteins'), ('SE', 'Seafood'), ('SP', 'Spices'), ('SW', 'Sweets'), ('UN', 'Uncategorized'), ('VE', 'Vegetables')], default='UN', max_length=2, verbose_name='category')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creationDate', models.DateTimeField(auto_now_add=True)),
                ('expirationDate', models.DateTimeField()),
                ('status', models.CharField(choices=[('OP', 'Open'), ('CL', 'Closed'), ('FU', 'Fulfilled'), ('EX', 'Expired')], default='OP', max_length=2)),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amountRemaining', models.DecimalField(decimal_places=2, max_digits=8)),
                ('unit', models.CharField(choices=[('GA', 'Gallons'), ('GR', 'Grams'), ('KG', 'Kilograms'), ('LI', 'Liters'), ('PK', 'Packages'), ('PC', 'Pieces'), ('LB', 'Pounds')], default='PC', max_length=2)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='foodbankapi.item')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orderItems', to='foodbankapi.order')),
            ],
        ),
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('phoneNumber', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None)),
                ('type', models.CharField(choices=[('DI', 'Distributor'), ('SU', 'Supplier')], default='DI', max_length=2)),
                ('address', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='foodbankapi.address')),
                ('connections', models.ManyToManyField(blank=True, to='foodbankapi.organization')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organizationOrders', to='foodbankapi.organization'),
        ),
        migrations.CreateModel(
            name='ConnectionRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fromOrganization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fromOrganization', to='foodbankapi.organization')),
                ('toOrganization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='toOrganization', to='foodbankapi.organization')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
                ('organization', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='userOrganization', to='foodbankapi.organization')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
