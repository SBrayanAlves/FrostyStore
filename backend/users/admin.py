from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django.utils.html import format_html

# Register your models here.

class UserAdmin(admin.ModelAdmin):

    
    list_display = ('get_profile_picture', 'username', 'email', 'first_name', 'last_name')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    ordering = ('-created_at',)

    fieldsets = (
        ("Login", {
            'fields': ('email', 'password')
        }),
        ("Informações Pessoais", {
            'fields': ('first_name', 'last_name', 'phone_number', 'date_of_birth')
        }),
        ("Perfil", {
            'fields': ('profile_picture', 'get_profile_picture_preview', 'username', 'bio', 'location')
        }),
        ("Permissões", {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ("Datas", {
            'fields': ('created_at', 'updated_at')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password', 'confirm_password'),
        }),
    )

    readonly_fields = ('created_at', 'updated_at', 'get_profile_picture_preview')

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            # Retorna HTML seguro para renderizar a imagem
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;" />',
                obj.profile_picture.url
            )
        return "Sem Foto"
    
    get_profile_picture.short_description = "Foto" # Nome da coluna

    def get_profile_picture_preview(self, obj):
        # Versão maior para ver dentro do formulário de edição
        if obj.profile_picture:
            return format_html(
                '<img src="{}" style="max-height: 200px; border-radius: 10px;" />',
                obj.profile_picture.url
            )
        return "Sem imagem carregada"
    
    get_profile_picture_preview.short_description = "Visualização Atual"
    

admin.site.register(User, UserAdmin)