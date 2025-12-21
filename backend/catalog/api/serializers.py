from rest_framework import serializers
from catalog.models import Product

class ProductSerializer(serializers.ModelSerializer):


    class Meta:
        model = Product
        fields = [
            "id",
            "seller",
            "category",
            "name",
            "price",
            "description",
            "brand",
            "voltage",
            "condition",
            "active",
            "created_at",
        ]
    
    readonly_fields = ["id", "seller", "created_at"]
    