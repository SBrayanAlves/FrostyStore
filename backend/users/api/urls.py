from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.Login.as_view(), name='login'), # ✓
    path('logout/', views.Logout.as_view(), name='logout'), # ✓
    path('dashboard/', views.UserDashboard.as_view(), name='user-dashboard'), # ✓
    path('dashboard/me/', views.PerfilUser.as_view(), name='perfil-user-dashboard-me'),
    path('dashboard/me/edit/', views.UpdateUser.as_view(), name='edit-perfil-user-dashboard-username'),
    path('<slug:slug>', views.ClientDashboard.as_view(), name='client-dashboard'), # ✓
]