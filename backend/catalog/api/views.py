import re
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404, redirect
import urllib
from  users.models import User
from catalog.models import Brand, Category, Product
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from .serializers import BrandSelectSerializer, CategorySelectSerializer, ClientProductDetailSerializer, EditProductSerializer, ProductSerializer, ShowCaseProductSerializer, ImageProductSerializer, UserProductDetailSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework import generics

# Create your views here.

# --- CLiente Views ---
# ---------------------------------------------------------------
# View para acessar a vitrine do Usuario (cliente) ✓
class ShowcaseView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ShowCaseProductSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        seller = get_object_or_404(User, slug=slug)
        return Product.objects.filter(seller=seller, active=True)\
            .select_related('category', 'brand', 'seller')\
            .prefetch_related('images')
    
# View para acessar o detalhe do produto pelo Cliente ✓
class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        product = get_object_or_404(Product, slug=slug, active=True)
        serializer = ClientProductDetailSerializer(product, context={'request': request})
        return Response(serializer.data, status=200)

# --- Usuario Autenticado Views ---
# ---------------------------------------------------------------
# View para acessar os produtos do Usuario autenticado ✓
class UserProductsView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShowCaseProductSerializer

    def get_queryset(self):
        user = self.request.user    
        return Product.objects.filter(seller=user)\
            .select_related('category', 'brand', 'seller')\
            .prefetch_related('images')

# View para acessar o detalhe do produto pelo Usuario autenticado ✓
class UserProductDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        user = request.user
        product = get_object_or_404(Product, slug=slug, seller=user)
        serializer = UserProductDetailSerializer(product, context={'request': request})
        return Response(serializer.data, status=200)
    
# --- Views Auxiliares (Listagem) ---

class CategoryListView(generics.ListAPIView):
    """Retorna lista de categorias (ID e Nome) para o frontend"""
    queryset = Category.objects.all()
    serializer_class = CategorySelectSerializer
    permission_classes = [AllowAny]
    pagination_class = None

class BrandListView(generics.ListAPIView):
    """Retorna lista de marcas (ID e Nome) para o frontend"""
    queryset = Brand.objects.all()
    serializer_class = BrandSelectSerializer
    permission_classes = [AllowAny]
    pagination_class = None
    
# --- CRUD de Produtos Views ---
# ---------------------------------------------------------------
# View para criar novo produto pelo Usuario autenticado ✓
class CreateProductView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(seller=request.user)
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
# ---------------------------------------------------------------
# View para adicionar imagens ao produto pelo Usuario autenticado ✓
class AddProductImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        product_id = request.data.get('product')
        product = get_object_or_404(Product, id=product_id, seller=request.user)
        
        serializer = ImageProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
     
# ---------------------------------------------------------------
# View para editar produto pelo Usuario autenticado ✓
class EditProductView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        user = request.user
        product = get_object_or_404(Product, pk=pk, seller=user)
        data = request.data.copy()
        serializer = EditProductSerializer(product, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

# ---------------------------------------------------------------
# View para deletar produto pelo Usuario autenticado ✓
class DeleteProductView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        
        user = request.user
        product = get_object_or_404(Product, pk=pk, seller=user)
        product.delete()
        return Response({"detail": "Produto deletado com sucesso."}, status=200)

# ---------------------------------------------------------------
# View EXCLUSIVA para contato via WhatsApp (Cliente interessado) ✓
class ContactSellerView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    def get(self, request, slug):
        product = get_object_or_404(Product, slug=slug, active=True)
        
        try:
            raw_phone = product.seller.phone_number
        except AttributeError:
            raw_phone = None

        if not raw_phone:
             return redirect(f'https://www.frostystore.com/{slug}')

        clean_phone = re.sub(r'\D', '', raw_phone)
        
        if len(clean_phone) <= 11:
            clean_phone = f"55{clean_phone}"

        text = (
            f"Olá!\n"
            f"Vi seu anúncio do *{product.name}* por *R${product.price}* "
            f"na *FrostyStore*.\n"
            f"Poderia me passar mais detalhes?"
        )

        encoded_text = urllib.parse.quote(text)
        
        whatsapp_url = f"https://wa.me/{clean_phone}?text={encoded_text}"
        
        return redirect(whatsapp_url)