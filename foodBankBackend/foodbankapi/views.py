import json
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from .serializers import *
from .models import *
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        return (self.queryset.filter(fromOrganization=self.request.user.organization) |
        self.queryset.filter(toOrganization=self.request.user.organization)
        )
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if "toOrganization" in self.request.data:
            context.update({"toOrganization": self.request.data["toOrganization"]})
        if "orderItems" in self.request.data:
            context.update({"orderItems": self.request.data["orderItems"]})
        return context

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.filter(type="SU")
    serializer_class = OrganizationSerializer

@permission_classes((AllowAny, ))
class DistributorViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.filter(type="DI")
    serializer_class = OrganizationSerializer

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

#### Authentication ####
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response

@require_POST
def login_view(request):
    print(request.data)
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password'}, status=400)
    
    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)
    
    login(request, user)
    return JsonResponse({'detail': 'Successfully logged in'})

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)
    
    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})

def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})
    
    return JsonResponse({'isAuthenticated': True})

def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})
    
    return JsonResponse({'username': request.user.username})