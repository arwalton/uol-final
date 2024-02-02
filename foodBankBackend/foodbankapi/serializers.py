from rest_framework import serializers
from .models import *


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=Address
        fields=["street", "city", "state", "country", "postalCode"]

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

class OrganizationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model=Organization
        fields=["name", "address", "phoneNumber", "type"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["username", "first_name", "last_name", "email", ]

class ConnectionRequestSerializer(serializers.ModelSerializer):
    fromOrganization = OrganizationSerializer()
    toOrganization = OrganizationSerializer()
    class Meta:
        model=ConnectionRequest
        fields=["fromOrganization", "toOrganization"]