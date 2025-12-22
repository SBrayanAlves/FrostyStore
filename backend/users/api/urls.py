from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.Login.as_view(), name='login'),
    path('logout/', views.Logout.as_view(), name='logout'),
    path('dashboard/', views.UserDashboard.as_view(), name='user-dashboard'),
    path('<slug:slug>', views.ClientDashboard.as_view(), name='client-dashboard'),
]