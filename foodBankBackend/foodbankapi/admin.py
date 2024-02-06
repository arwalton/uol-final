from django.contrib import admin
from .models import *

admin.site.register(Address)
admin.site.register(Item)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Organization)
admin.site.register(User)
admin.site.register(ConnectionRequest)