from django.urls import path
from . import views

urlpatterns = [
    path('products/<slug:slug>', views.ShowcaseView.as_view(), name='showcase'), # ✓ URL de listagem Cliente
    path('products/', views.UserProductsView.as_view(), name='user-products'), # ✓ URL de listagem User Authenticated
    path('products/create/', views.CreateProductView.as_view(), name='create-product'), # ✓ URL de criacao User Authenticated
    path('products/images/upload/', views.AddProductImageView.as_view(), name='upload-image'), # ✓ URL de adicao de imagens ao item criado User Authenticated
    path('products/edit/<uuid:pk>/', views.EditProductView.as_view(), name='edit-product'), # ✓ URL de edicao User Authenticated
    path('products/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'), # ✓ URL de detalhe Cliente / User Authenticated
    path('products/delete/<uuid:pk>/', views.DeleteProductView.as_view(), name='delete-product'), # ✓ URL de delecao User Authenticated
]