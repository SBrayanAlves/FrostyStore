from django.urls import path
from . import views

urlpatterns = [
    # ====================================================
    # 1. ROTAS ESPECÍFICAS DO VENDEDOR (CRUD & DASHBOARD)
    # Listagem (Dashboard)
    path('products/', views.UserProductsView.as_view(), name='user-products'),
    
    # Criação
    path('products/create/', views.CreateProductView.as_view(), name='create-product'),
    
    # Upload de Imagem
    path('products/images/upload/', views.AddProductImageView.as_view(), name='upload-image'),
    
    # Edição (Usa UUID, bem específico)
    path('products/edit/<uuid:pk>/', views.EditProductView.as_view(), name='edit-product'),
    
    # Deleção (Usa UUID, bem específico)
    path('products/delete/<uuid:pk>/', views.DeleteProductView.as_view(), name='delete-product'),

    # Detalhe Privado (Dashboard) - Prefixo 'user/' ajuda a separar
    path('user/products/p/<slug:slug>/', views.UserProductDetailView.as_view(), name='user-product-detail'),

    # ====================================================
    # 2. ROTAS PÚBLICAS (CLIENTE / VITRINE)
    # Detalhe Público do Produto
    path('products/p/<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),

    # Contato com o Vendedor via WhatsApp
    path('products/<slug:slug>/contact/', views.ContactSellerView.as_view(), name='product-contact'),

    # Vitrine do Vendedor (Showcase)
    path('products/<slug:slug>/', views.ShowcaseView.as_view(), name='showcase'),
]