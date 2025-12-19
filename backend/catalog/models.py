import uuid
from django.db import models
from django.utils.text import slugify
from django.conf import settings

# Create your models here.

class VoltageChoice(models.TextChoices):  


    V110 = "110V", "110V"
    V220 = "220V", "220V"
    BIVOLT = "Bivolt", "Bivolt"

class ConditionChoice(models.TextChoices):


    NEW = "Novo", "Novo"
    SEMI_NEW = "Semi-novo", "Semi-novo"
    USED_EXCELLENT = "Usado-Excelente", "Usado-Excelente"
    USED_GOOD = "Usado-Bom","Usado-Bom"
    REFURBISHED = "Recondicionado", "Recondicionado"
    DEFECTIVE = "Defeituoso", "Defeituoso"

class Brand(models.Model):
    

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Brand"
        verbose_name_plural = "Brands"

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            self.slug = f"{base}-{str(self.id)[:8]}"
        super().save(*args, **kwargs)

class Category(models.Model):


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            self.slug = f"{base}-{str(self.id)[:8]}"
        super().save(*args, **kwargs)

class Product(models.Model):


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")

    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name="products")
    voltage = models.CharField(max_length=10, choices=VoltageChoice.choices)
    condition = models.CharField(max_length=20, choices=ConditionChoice.choices)

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            self.slug = f"{base}-{str(self.id)[:8]}"
        super().save(*args, **kwargs)

class ProductImage(models.Model):


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Product Image"
        verbose_name_plural = "Product Images"

    def __str__(self):
        return f"Image for {self.product.name}"
