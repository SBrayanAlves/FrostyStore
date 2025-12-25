from rest_framework import serializers
from catalog.models import Product
from catalog.models import ProductImage

# ---------------------------------------------------------------
# Serializer para criar um novo produto no dashboard do vendedor ✓
# Primeiro Passo: Serializer de Imagem do Produto -> Modal 1 ✓
# Segundo Passo: Serializer do Produto -> Modal 2 ✓
class ImageProductSerializer(serializers.ModelSerializer):


    class Meta:
        model = ProductImage
        fields = [
            "id",
            "product",
            "image",
            "created_at",
        ]

# ---------------------------------------------------------------
# Serializer do Produto para criar e editar produto no dashboard do vendedor ✓
class ProductSerializer(serializers.ModelSerializer):
    
    seller = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "seller",
            "category",
            "name",
            "price",
            "description",
            "slug",
            "brand",
            "voltage",
            "condition",
            "active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ['created_at', 'updated_at', 'slug']

# ---------------------------------------------------------------
# Serializer do Produto para listar produtos na vitrine ✓
class ShowCaseProductSerializer(serializers.ModelSerializer):
 

    brand_name = serializers.CharField(source='brand.name', read_only=True)
    images = ImageProductSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "price",
            "condition",
            "brand_name",
            "images", 
        ]

# ---------------------------------------------------------------
# Serializer do Produto para exibir detalhes do produto na vitrine ✓
class ProductDetailSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    images = ImageProductSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "price",
            "description",
            "voltage",
            "condition",
            "active",
            "seller_name",
            "category_name",
            "brand_name",
            "images", 
        ]