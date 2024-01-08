from rest_framework import serializers
from .models import *

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=Item
        fields=["name", "category"]

class OrderItemSerializer(serializers.ModelSerializer):
    item = serializers.SlugRelatedField(
        read_only=True,
        slug_field="name"
    )
    class Meta:
        model=OrderItem
        fields=["item", "amountRemaining", "unit"]
        
class OrderSerializer(serializers.ModelSerializer):
    orderItems = OrderItemSerializer(many=True)

    class Meta:
        model=Order
        fields=["creationDate", "expirationDate", "status", "orderItems"]