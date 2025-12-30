from rest_framework import serializers
from catalog.models import Product
from catalog.models import ProductImage
from catalog.models import Category
from catalog.models import Brand
from PIL import Image

# ---------------------------------------------------------------
# Serializer para criar um novo produto no dashboard do vendedor ✓
# Primeiro Passo: Serializer de Imagem do Produto -> Modal 1 ✓
# Segundo Passo: Serializer do Produto -> Modal 2 ✓
class ImageProductSerializer(serializers.ModelSerializer):


    class Meta:
        model = ProductImage
        fields = [
            "id",
            "image",
            "created_at",
        ]

    def validate_image(self, image):
        if image:
            if image.size > 5 * 1024 * 1024:
                raise serializers.ValidationError('A imagem deve ter no máximo 5MB.')
            try:
                img = Image.open(image)
                img.verify()
            except Exception:
                raise serializers.ValidationError('O arquivo enviado não é uma imagem válida.')

            if img.format not in ['JPEG', 'PNG', 'JPG']:
                raise serializers.ValidationError('Apenas formatos JPEG, PNG e JPG são permitidos.')
                
        return image

# --- Cliente Serializers ---
# ---------------------------------------------------------------
# Serializer do Produto para exibir detalhes do produto na vitrine ✓
class ClientProductDetailSerializer(serializers.ModelSerializer):

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
            "seller_name",
            "category_name",
            "brand_name",
            "images", 
        ]

# --- Usuario Autenticado Serializers ---
# ---------------------------------------------------------------
# Serializer do Produto para exibir detalhes do produto no dashboard do vendedor ✓
class UserProductDetailSerializer(serializers.ModelSerializer):

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
        read_only_fields = ['created_at', 'updated_at', 'slug']

# ---------------------------------------------------------------
# --- Serializers Auxiliares ---
class CategorySelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BrandSelectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']
        
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
# Editar Produto Serializer ✓
class EditProductSerializer(serializers.ModelSerializer):
    
    seller = serializers.CharField(read_only=True)
    images = ImageProductSerializer(many=True, read_only=True)
    
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
            "images",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ['created_at', 'updated_at', 'slug', 'seller', 'images']

# --- Cliente & User Serializers ---
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
            "active",
            "brand_name",
            "images", 
        ]