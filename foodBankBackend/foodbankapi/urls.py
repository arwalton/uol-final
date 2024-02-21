from django.urls import path, include, re_path
from . import views
from rest_framework import routers 

router = routers.DefaultRouter()
router.register(r'orders', views.OrderViewSet, basename="orders")

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.login_view, name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.session_view, name='api-session'),
    path('whoami/', views.whoami_view, name='api-whoami'),
    re_path(r'^auth/v1/', include('djoser.urls')),
    re_path(r'^auth/v1/', include('djoser.urls.authtoken')),

]