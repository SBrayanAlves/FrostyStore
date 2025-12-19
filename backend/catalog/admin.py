from django.contrib import admin
from django.utils.html import format_html
from .models import Brand, Category, Product, ProductImage

# Register your models here.

class ProductImageInline(admin.TabularInline):


    model = ProductImage
    extra = 1
    readonly_fields = ('get_image_preview',)

    def get_image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; border-radius: 5px;" />',
                obj.image.url
            )
        return "Sem imagem"
    
    get_image_preview.short_description = "Preview"

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):


    list_display = ('name', 'slug')
    search_fields = ('name',) 
    ordering = ('name',)
    
    prepopulated_fields = {'slug': ('name',)} 

    fieldsets = (
        ("Dados da Marca", {
            'fields': ('name', 'slug')
        }),
    )

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):


    list_display = ('name', 'slug')
    search_fields = ('name',)
    ordering = ('name',)
    
    prepopulated_fields = {'slug': ('name',)}

    fieldsets = (
        ("Dados da Categoria", {
            'fields': ('name', 'slug')
        }),
    )

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):


    list_display = ('name', 'price', 'brand', 'category', 'active', 'seller')
    
    search_fields = ('name', 'seller__username', 'category__name', 'brand__name')
    
    list_filter = ('active', 'brand', 'category', 'condition')
    ordering = ('-created_at',)

    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]

    fieldsets = (
        ("Dados Principais", {
            'fields': ('seller', 'name', 'slug', 'description', 'price', 'active')
        }),
        ("Detalhes Técnicos", {
            'fields': ('brand', 'category', 'voltage', 'condition')
        }),
    )