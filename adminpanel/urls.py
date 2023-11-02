from . import views
from django.contrib import admin
from django.urls import path, include
from api.urls import urlpatterns 

urlpatterns = [
    path('api/', include('api.urls')),
    path('', views.index),
    path('admin/', admin.site.urls),
]
