from django.contrib import admin
from .models import *

class OrderItemInline(admin.StackedInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    

admin.site.register(Address)
admin.site.register(Item)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(Organization)
admin.site.register(User)
admin.site.register(ConnectionRequest)