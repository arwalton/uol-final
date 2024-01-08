from django.db import models

class Item(models.Model):
    name = models.CharField(
        max_length=255
    )
    category = models.CharField(
        max_length=255
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
    STATUS_CHOICES = {
        "OP": "Open",
        "CL": "Closed",
        "FU": "Fulfilled",
        "EX": "Expired"
    }
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default="OP"
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
    UNIT_CHOICES = {
        "KG": "Kilograms",
        "LB": "Pounds",
        "GR": "Grams",
        "PK": "Packages",
        "PC": "Pieces",
        "LI": "Liters",
        "GA": "Gallons"
    }
    unit = models.CharField(
        max_length=2,
        choices=UNIT_CHOICES,
        default="PC"
    )

    def __str__(self):
        return str(self.item) + "(s): " + str(self.amountRemaining) + " " + self.UNIT_CHOICES[self.unit]