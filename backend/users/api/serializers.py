from PIL import Image
from rest_framework import serializers
from users.models import User
import datetime
from django.contrib.auth import authenticate
import re

# ---------------------------------------------------------------
# Serializer de Login de Usuario ✓
class UserLoginSerializer(serializers.Serializer):


    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid credentials')
        attrs['user'] = user
        return attrs

# --------------------------------------------------------------- 
# Serializer para acessar o perfil do Usuario (cliente) ✓
class PublicUserSerializer(serializers.ModelSerializer):


    class Meta:
        model = User
        fields = ('id','username', 'first_name', 'last_name', 'profile_picture', 'bio')

# ---------------------------------------------------------------
# Serializer para acessar o dashboard e Perfil do Usuario autenticado 
# DashBord ✓
# Perfil 
class PrivateUserSerializer(serializers.ModelSerializer):


    class Meta:
        model = User
        fields = ('id','username', 'first_name', 'last_name', 'profile_picture', 'bio', 'date_of_birth', 'location', 'phone_number', 'email')


# ---------------------------------------------------------------
# Serializer para atualizar o perfil do Usuario autenticado 
class PostUpdateUserSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = User
        fields = ('id','first_name', 'last_name', 'profile_picture', 'bio', 'date_of_birth', 'location', 'phone_number')

    def validate_profile_picture(self, profile_picture):
        if profile_picture:
            if profile_picture.size > 2 * 1024 * 1024:
                raise serializers.ValidationError('A imagem deve ter no máximo 2MB.')
            try:
                img = Image.open(profile_picture)
                img.verify()
            except Exception:
                raise serializers.ValidationError('O arquivo enviado não é uma imagem válida.')

            if img.format not in ['JPEG', 'PNG']:
                raise serializers.ValidationError('Apenas formatos JPEG e PNG são permitidos.')
                
        return profile_picture
            
    def validate_bio(self, bio):
        if bio:
            prohibited_words = ['spam', 'advertisement', 'offensive']
            for word in prohibited_words:
                if word in bio.lower():
                    raise serializers.ValidationError(f"The bio contains prohibited word: {word}")
        return bio

    def validate_date_of_birth(self, date_of_birth):
        hoje = datetime.date.today()
        if date_of_birth > hoje:
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        
        age = hoje.year - date_of_birth.year - ((hoje.month, hoje.day) < (date_of_birth.month, date_of_birth.day))

        if age < 18:
            raise serializers.ValidationError("User must be at least 18 years old.")
        return date_of_birth   
    
    def validate_location(self, location):
        if location:
            if any(char.isdigit() for char in location):
                raise serializers.ValidationError("Location cannot contain numbers.")
            if len(location) > 100:
                raise serializers.ValidationError("Location is too long. Maximum length is 100 characters.")
        return location
    
    def validate_phone_number(self, phone_number):
        if not phone_number:
            return None
        
        phone_number_clear = re.sub(r'\D', '', phone_number)
        if len(phone_number_clear) < 10 or len(phone_number_clear) > 15:
            raise serializers.ValidationError("Phone number must be between 10 and 15 digits.")
        return phone_number_clear