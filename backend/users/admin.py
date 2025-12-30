from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User
from .forms import CustomUserCreationForm, CustomUserChangeForm # Importação vital

class UserAdmin(BaseUserAdmin):
    # O PULO DO GATO ESTÁ AQUI:
    add_form = CustomUserCreationForm  # Usa este form para CRIAR (aplica o hash)
    form = CustomUserChangeForm        # Usa este form para EDITAR
    model = User

    list_display = ('get_profile_picture', 'email', 'username', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone_number')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    ordering = ('-created_at',)

    # Layout para quando você clica em um usuário JÁ EXISTENTE
    fieldsets = (
        ("Login", {
            # O campo 'password' aqui mostra o link seguro de resetar senha
            'fields': ('email', 'password') 
        }),
        ("Informações Pessoais", {
            'fields': ('first_name', 'last_name', 'phone_number', 'date_of_birth')
        }),
        ("Perfil", {
            'fields': ('profile_picture', 'get_profile_picture_preview', 'username', 'slug', 'bio', 'location')
        }),
        ("Permissões", {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ("Datas", {
            'fields': ('created_at', 'updated_at')
        }),
    )

    # Layout para quando você clica em ADICIONAR USUÁRIO
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            # Aqui aparecem os campos obrigatórios para criar a conta
            # O CustomUserCreationForm vai interceptar o save aqui e criptografar a senha
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )

    readonly_fields = ('created_at', 'updated_at', 'get_profile_picture_preview')

    def get_profile_picture(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;" />',
                obj.profile_picture.url
            )
        return "Sem Foto"
    
    get_profile_picture.short_description = "Foto"

    def get_profile_picture_preview(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" style="max-height: 200px; border-radius: 10px;" />',
                obj.profile_picture.url
            )
        return "Sem imagem carregada"
    
    get_profile_picture_preview.short_description = "Visualização Atual"

# Registra
admin.site.register(User, UserAdmin)