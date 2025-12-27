from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.UserProductsView.as_view(), name='user-products'), # ✓ User Authenticated
    path('products/<slug:slug>', views.ShowcaseView.as_view(), name='showcase'), # ✓ Cliente
    path('products/create/', views.CreateProductView.as_view(), name='create-product'), # ✓ User Authenticated
    path('products/images/upload/', views.AddProductImageView.as_view(), name='upload-image'), # ✓ User Authenticated
    path('products/edit/<uuid:pk>/', views.EditProductView.as_view(), name='edit-product'), # ✓ User Authenticated
    path('products/<uuid:pk>/', views.ProductDetailView.as_view(), name='product-detail'), # ✓ Cliente
    path('products/delete/<uuid:pk>/', views.DeleteProductView.as_view(), name='delete-product'), # ✓ User Authenticated
]