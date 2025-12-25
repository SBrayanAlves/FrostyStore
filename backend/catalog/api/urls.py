from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.UserProductsView.as_view(), name='user-products'),
    path('products/<slug:slug>', views.ShowcaseView.as_view(), name='showcase'),
]