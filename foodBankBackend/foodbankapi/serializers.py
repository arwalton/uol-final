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
    item = ItemSerializer()
    class Meta:
        model=OrderItem
        fields=["item", "amountRemaining", "unit"]

class OrganizationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model=Organization
        fields=["name", "address", "phoneNumber", "type"]

class OrderSerializer(serializers.ModelSerializer):
    orderItems = OrderItemSerializer(many=True)
    # fromOrganization = OrganizationSerializer()
    fromOrganization = serializers.SlugRelatedField(
        many=False,
        read_only=True,
        slug_field="name"
    )
    # toOrganization = OrganizationSerializer()
    toOrganization = serializers.SlugRelatedField(
        many=False,
        read_only=True,
        slug_field="name"
    )

    def create(self, validated_data):
        orderItems = validated_data.pop('orderItems')

        user = self.context['request'].user
        fromOrg = user.organization

        #########################################################
        # FIX TO ORG TOMORROW YOU MORON!!!!!!!!!!!!!!           #
        #########################################################
        toOrg = Organization.objects.get(name="Test Grocery Store")

        order = Order.objects.create(
            **validated_data,
            fromOrganization=fromOrg,
            toOrganization=toOrg            
        )
        order.save()

        for orderItem in orderItems:
            print("orderItem")
            print(orderItem)
            print(orderItem["item"])
            item = Item.objects.get(name=orderItem["item"]["name"])
            orderItemToAdd = OrderItem.objects.create(
                order=order,
                item=item,
                amountRemaining=orderItem["amountRemaining"],
                unit=orderItem["unit"]
            )
            orderItemToAdd.save()



        return order


    class Meta:
        model=Order
        fields=["creationDate", "expirationDate", "status", "orderItems", "fromOrganization", "toOrganization"]

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