from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django_countries.fields import Country
from .models import *

########### MODELS #############
class AddressModelTest(TestCase):
    def setUp(self):
        # Set up any initial data needed for the tests
        Address.objects.create(
            street='123 Main St',
            city='Sample City',
            state='Sample State',
            country=Country('US'),
            postalCode='12345'
        )

    def test_address_creation(self):
        # Test that an address was created successfully
        address = Address.objects.get(street='123 Main St')
        self.assertEqual(address.city, 'Sample City')
        self.assertEqual(address.state, 'Sample State')
        self.assertEqual(address.country.code, 'US')
        self.assertEqual(address.postalCode, '12345')

    def test_address_str_method_with_state(self):
        # Test the __str__ method when state is not blank
        address = Address.objects.get(street='123 Main St')
        expected_str = '123 Main St Sample City, Sample State, United States of America, 12345'
        self.assertEqual(str(address), expected_str)

    def test_address_str_method_without_state(self):
        # Test the __str__ method when state is blank
        address = Address.objects.create(
            street='456 Oak St',
            city='Another City',
            country=Country('CA'),
            postalCode='56789'
        )
        expected_str = '456 Oak St Another City, Canada, 56789'
        self.assertEqual(str(address), expected_str)

    def test_address_blank_state(self):
        # Test that the state field can be blank
        address = Address.objects.create(
            street='456 Oak St',
            city='Another City',
            country=Country('CA'),
            postalCode='56789'
        )
        self.assertEqual(address.state, '')

class ItemModelTest(TestCase):
    def setUp(self):
        # Set up any initial data needed for the tests
        Item.objects.create(name='Apple', category=Item.CategoryChoices.FRUITS)

    def test_item_creation(self):
        # Test that an item was created successfully
        item = Item.objects.get(name='Apple')
        self.assertEqual(item.category, Item.CategoryChoices.FRUITS)

    def test_item_str_method(self):
        # Test the __str__ method of the Item model
        item = Item.objects.get(name='Apple')
        expected_str = 'Apple'
        self.assertEqual(str(item), expected_str)

    def test_default_category(self):
        # Test that the default category is UNCATEGORIZED
        item = Item.objects.create(name='Carrot')
        self.assertEqual(item.category, Item.CategoryChoices.UNCATEGORIZED)

    def test_valid_category_choices(self):
        # Test that the category field only accepts valid choices
        with self.assertRaises(ValidationError):
            item = Item(name='Orange', category='InvalidCategory')
            item.full_clean()  # Manually trigger validation

class OrderModelTest(TestCase):
    def setUp(self):
        # Set up any initial data needed for the tests
        Order.objects.create(expirationDate='2024-02-10T12:00:00Z')

    def test_order_creation(self):
        # Test that an order was created successfully
        order = Order.objects.get(expirationDate='2024-02-10T12:00:00Z')
        self.assertEqual(order.status, Order.StatusChoices.OPEN)

    def test_default_values(self):
        # Test that the default status is OPEN
        order = Order.objects.create(expirationDate='2024-02-20T12:00:00Z')
        self.assertEqual(order.status, Order.StatusChoices.OPEN)

        # Test that creationDate is auto-populated
        self.assertIsNotNone(order.creationDate)

    def test_valid_status_choices(self):
        # Test that the status field only accepts valid choices
        with self.assertRaises(ValidationError):
            order = Order(expirationDate='2024-02-15T12:00:00Z', status='InvalidStatus')
            order.full_clean()  # Manually trigger validation

class OrderItemModelTest(TestCase):
    def setUp(self):
        # Set up any initial data needed for the tests
        order = Order.objects.create(expirationDate='2024-02-10T12:00:00Z')
        item = Item.objects.create(name='Apple', category=Item.CategoryChoices.FRUITS)
        OrderItem.objects.create(order=order, item=item, amountRemaining=10.5, unit=OrderItem.UnitChoices.PIECES)

    def test_order_item_creation(self):
        # Test that an order item was created successfully
        order_item = OrderItem.objects.get(amountRemaining=10.5)
        self.assertEqual(order_item.unit, OrderItem.UnitChoices.PIECES)

    def test_order_item_str_method(self):
        # Test the __str__ method of the OrderItem model
        order_item = OrderItem.objects.get(amountRemaining=10.5)
        expected_str = 'Apple(s): 10.50 ' + order_item.get_unit_display()
        self.assertEqual(str(order_item), expected_str)

    def test_default_values(self):
        # Test that the default unit is PIECES
        order = Order.objects.create(expirationDate='2024-02-20T12:00:00Z')
        item = Item.objects.create(name='Banana', category=Item.CategoryChoices.FRUITS)
        order_item = OrderItem.objects.create(order=order, item=item, amountRemaining=5.0)
        self.assertEqual(order_item.unit, OrderItem.UnitChoices.PIECES)

    def test_valid_unit_choices(self):
        # Test that the unit field only accepts valid choices
        order = Order.objects.create(expirationDate='2024-02-15T12:00:00Z')
        item = Item.objects.create(name='Orange', category=Item.CategoryChoices.FRUITS)
        with self.assertRaises(ValidationError):
            order_item = OrderItem(order=order, item=item, amountRemaining=2.5, unit='InvalidUnit')
            order_item.full_clean()  # Manually trigger validation

class OrganizationModelTest(TestCase):
    def setUp(self):
        # Set up any initial data needed for the tests
        address = Address.objects.create(
            street='123 Main St',
            city='Sample City',
            country='US',
            postalCode='12345'
        )
        Organization.objects.create(
            name='ABC Distributors',
            address=address,
            phoneNumber='+1234567890',
            type=Organization.TypeChoices.DISTRIBUTOR
        )

    def test_organization_creation(self):
        # Test that an organization was created successfully
        organization = Organization.objects.get(name='ABC Distributors')
        self.assertEqual(organization.type, Organization.TypeChoices.DISTRIBUTOR)

    def test_organization_relationship(self):
        # Test the connections ManyToMany relationship
        org1 = Organization.objects.create(name='XYZ Suppliers')
        org2 = Organization.objects.create(name='LMN Distributors')
        org1.connections.add(org2)
        org2.connections.add(org1)

        self.assertIn(org2, org1.connections.all())
        self.assertIn(org1, org2.connections.all())

    def test_default_values(self):
        # Test that the default organization type is DISTRIBUTOR
        organization = Organization.objects.create(name='PQR Distributors')
        self.assertEqual(organization.type, Organization.TypeChoices.DISTRIBUTOR)

    def test_valid_type_choices(self):
        # Test that the type field only accepts valid choices
        with self.assertRaises(ValidationError):
            organization = Organization(name='InvalidOrg', type='InvalidType')
            organization.full_clean()  # Manually trigger validation

    def test_phone_number_field(self):
        # Test the PhoneNumberField for valid phone number format
        organization = Organization.objects.get(name='ABC Distributors')
        self.assertEqual(str(organization.phoneNumber), '+1234567890')

User = get_user_model()

class UserModelTest(TestCase):
    def setUp(self):
        # Set up any initial data needed for the tests
        organization = Organization.objects.create(
            name='ABC Distributors',
            type=Organization.TypeChoices.DISTRIBUTOR
        )
        address = Address.objects.create(
            street='123 Main St',
            city='Sample City',
            country='US',
            postalCode='12345'
        )
        organization.address = address
        organization.save()

        User.objects.create_user(
            username='testuser',
            password='testpassword',
            organization=organization
        )

    def test_user_creation(self):
        # Test that a user was created successfully
        user = User.objects.get(username='testuser')
        self.assertEqual(user.organization.type, Organization.TypeChoices.DISTRIBUTOR)

    def test_user_organization_relationship(self):
        # Test the ForeignKey relationship with the Organization model
        user = User.objects.get(username='testuser')
        organization = user.organization
        self.assertEqual(organization.name, 'ABC Distributors')

class ConnectionRequestModelTest(TestCase):
    def setUp(self):
        # Set up any initial data needed for the tests
        org_from = Organization.objects.create(
            name='ABC Distributors',
            type=Organization.TypeChoices.DISTRIBUTOR
        )
        address_from = Address.objects.create(
            street='123 Main St',
            city='Sample City',
            country='US',
            postalCode='12345'
        )
        org_from.address = address_from
        org_from.save()

        org_to = Organization.objects.create(
            name='XYZ Suppliers',
            type=Organization.TypeChoices.SUPPLIER
        )
        address_to = Address.objects.create(
            street='456 Oak St',
            city='Another City',
            country='CA',
            postalCode='56789'
        )
        org_to.address = address_to
        org_to.save()

        ConnectionRequest.objects.create(
            fromOrganization=org_from,
            toOrganization=org_to
        )

    def test_connection_request_creation(self):
        # Test that a connection request was created successfully
        connection_request = ConnectionRequest.objects.first()
        self.assertEqual(connection_request.fromOrganization.type, Organization.TypeChoices.DISTRIBUTOR)
        self.assertEqual(connection_request.toOrganization.type, Organization.TypeChoices.SUPPLIER)

    def test_connection_request_relationships(self):
        # Test the ForeignKey relationships with the Organization model
        connection_request = ConnectionRequest.objects.first()
        org_from = connection_request.fromOrganization
        org_to = connection_request.toOrganization
        self.assertEqual(org_from.name, 'ABC Distributors')
        self.assertEqual(org_to.name, 'XYZ Suppliers')