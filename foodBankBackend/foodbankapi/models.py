from django.db import models
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

##################################################
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

    country = models.CharField(
        max_length=200,
        null=True,
        choices=list(CountryField().choices) + [('', 'Select Country')]
    )

    postalCode = models.CharField(
        _("postal code"),
        max_length=16
    )

    def __str__(self):
        if(self.state != ""):
            return self.street + " " + self.city + ", " + self.state + ", " + self.country + ", " + self.postalCode
        
        return self.street + " " + self.city + ", " + self.country + ", " + self.postalCode

##################################################
class Item(models.Model):
    name = models.CharField(
        _("name"),
        max_length=255
    )

    class CategoryChoices(models.TextChoices):
        BEVERAGES = "BE", _("Beverages")
        BAKING = "BA", _("Baking")
        BREADS = "BR", _("Breads")
        DAIRY = "DA", _("Dairy")
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

##################################################
class Order(models.Model):
    creationDate = models.DateTimeField(
        auto_now_add=True
    )

    expirationDate = models.DateTimeField(
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

    fromOrganization = models.ForeignKey(
        "Organization",
        related_name="orderFromOrganization",
        on_delete=models.CASCADE
    )

    toOrganization = models.ForeignKey(
        "Organization",
        related_name="orderToOrganization",
        on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.fromOrganization) + ' > ' + str(self.toOrganization)

##################################################
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
        return str(self.item) + "(s): " + str(self.amountRemaining) + " " + self.get_unit_display()
    
##################################################
class Organization(models.Model):
    connections = models.ManyToManyField("Organization", blank=True)

    name = models.CharField(
        max_length=255,
        unique=True
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

    def __str__(self):
        return self.name

##################################################
class User(AbstractUser):
    organization = models.ForeignKey(
        Organization,
        related_name="userOrganization",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

##################################################
class ConnectionRequest(models.Model):
    fromOrganization = models.ForeignKey(
        Organization,
        related_name="fromOrganization",
        on_delete=models.CASCADE
    )

    toOrganization = models.ForeignKey(
        Organization,
        related_name="toOrganization",
        on_delete=models.CASCADE
    )