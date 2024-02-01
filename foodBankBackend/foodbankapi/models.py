from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

class Address(models.Model):
    street = models.CharField(
        _("street"),
        max_length=255
    )

    city = models.CharField(
        _("city"),
        max_length=128
    )

    state = models.CharField(
        _("state"),
        max_length=64,
        blank=True
    )

    country = CountryField()

    postalCode = models.CharField(
        _("postal code"),
        max_length=16
    )


class Item(models.Model):
    name = models.CharField(
        _("name"),
        max_length=255
    )

    class CategoryChoices(models.TextChoices):
        BEVERAGES = "BE", _("Beverages")
        BAKING = "BA", _("Baking")
        BREADS = "BR", _("Breads")
        CHEESES = "CH", _("Cheeses")
        DESSERTS = "DE", _("Desserts")
        DRYGOODS = "DR", _("Dry goods")
        EGGS = "EG", _("Eggs")
        FATS = "FA", _("Fats")
        FROZEN = "FZ", _("Frozen foods")
        FRUITS = "FR", _("Fruits")
        PROTEINS = "PR", _("Proteins")
        SEAFOOD = "SE", _("Seafood")
        SPICES = "SP", _("Spices")
        SWEETS = "SW", _("Sweets")
        UNCATEGORIZED = "UN", _("Uncategorized")
        VEGETABLES = "VE", _("Vegetables")

    category = models.CharField(
        _("category"),
        max_length=2,
        choices = CategoryChoices,
        default = CategoryChoices.UNCATEGORIZED
    )

    def __str__(self):
        return self.name

class Order(models.Model):
    creationDate = models.DateTimeField(
        db_comment="Date and time the order was created",
        auto_now_add=True
    )

    expirationDate = models.DateTimeField(
        db_comment="Date when the order is no longer valid"
    )

    class StatusChoices(models.TextChoices):
        OPEN = "OP", _("Open")
        CLOSED = "CL", _("Closed")
        FULFILLED = "FU", _("Fulfilled")
        EXPIRED = "EX", _("Expired")

    status = models.CharField(
        max_length=2,
        choices=StatusChoices,
        default=StatusChoices.OPEN
    )

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name="orderItems",
        on_delete=models.CASCADE
    )

    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE
    )
    
    amountRemaining = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )
    
    class UnitChoices(models.TextChoices):
        GALLONS = "GA", _("Gallons")
        GRAMS = "GR", _("Grams")
        KILOGRAMS = "KG", _("Kilograms")
        LITERS = "LI", _("Liters")
        PACKAGES = "PK", _("Packages")
        PIECES = "PC", _("Pieces")
        POUNDS = "LB", _("Pounds")
    
    unit = models.CharField(
        max_length=2,
        choices=UnitChoices,
        default=UnitChoices.PIECES
    )

    def __str__(self):
        return str(self.item) + "(s): " + str(self.amountRemaining) + " " + self.UNIT_CHOICES[self.unit]
    
class Organization(models.Model):
    name = models.CharField(
        max_length=255
    )

    address = models.OneToOneField(
        Address,
        on_delete=models.CASCADE,
        null=True
    )

    phoneNumber = PhoneNumberField(blank=True)

    class TypeChoices(models.TextChoices):
        DISTRIBUTOR = "DI", _("Distributor")
        SUPPLIER = "SU", _("Supplier")

    type = models.CharField(
        max_length=2,
        choices=TypeChoices,
        default=TypeChoices.DISTRIBUTOR
    )

class User(AbstractUser):
    pass