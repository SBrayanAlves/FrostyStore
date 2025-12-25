from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from  users.models import User
from catalog.models import Product
from .serializers import ShowCaseProductSerializer

# Create your views here.

# ---------------------------------------------------------------
# View para acessar a vitrine do Usuario (cliente) ✓
class ShowcaseView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        seller = get_object_or_404(User, slug=slug)
        query = Product.objects.filter(seller=seller, active=True).select_related('category', 'brand', 'seller').prefetch_related('images')
        serializer = ShowCaseProductSerializer(query, many=True)
        return Response(serializer.data, status=200)
    
# ---------------------------------------------------------------
# View para acessar os produtos do Usuario autenticado ✓
class UserProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user    
        query = Product.objects.filter(seller=user).order_by('active').select_related('category', 'brand', 'seller').prefetch_related('images')
        serializer = ShowCaseProductSerializer(query, many=True)
        return Response(serializer.data, status=200)