from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

class OrderItemInline(admin.StackedInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]


class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (
        (
            'Additionl Fields', {
                'fields': (
                    'organization',
                )
            }
        ),
    )

admin.site.register(Address)
admin.site.register(Item)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(Organization)
admin.site.register(User, UserAdmin)
admin.site.register(ConnectionRequest)