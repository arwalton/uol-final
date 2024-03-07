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
    item = ItemSerializer(read_only=True)
    class Meta:
        model=OrderItem
        fields=["id", "item", "amountRemaining", "unit"]

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

    def validate_toOrganization(self, value):
        return value

    def create(self, validated_data):
        orderItems = validated_data.pop('orderItems')
        orgName = self.context['toOrganization']
        user = self.context['request'].user
        fromOrg = user.organization

        toOrg = Organization.objects.get(name=orgName)

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
    
    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance


    class Meta:
        model=Order
        fields=["id", "creationDate", "expirationDate", "status", "orderItems", "fromOrganization", "toOrganization"]

class UserSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer()
    class Meta:
        model=User
        fields=["username", "first_name", "last_name", "email", "organization"]

    def create(self, validated_data):
        print("validated_data")
        print(validated_data)

class ConnectionRequestSerializer(serializers.ModelSerializer):
    fromOrganization = OrganizationSerializer()
    toOrganization = OrganizationSerializer()
    class Meta:
        model=ConnectionRequest
        fields=["fromOrganization", "toOrganization"]