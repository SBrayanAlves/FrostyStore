from rest_framework import serializers
from users.models import User
import datetime
import re

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'profile_picture', 'bio', 'date_of_birth', 'location', 'phone_number')

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'profile_picture', 'bio', 'date_of_birth', 'location', 'phone_number')

    def validate_profile_picture(self, profile_picture):
        if profile_picture:
            valid_mime_types = ['image/jpeg', 'image/png']
            file_mime_type = profile_picture.file.content_type
            if file_mime_type not in valid_mime_types:
                raise serializers.ValidationError('Unsupported file type. Only JPEG and PNG are allowed.')
            if profile_picture.size > 2 * 1024 * 1024:
                raise serializers.ValidationError('Profile picture size should not exceed 2MB.')
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
        if phone_number and not phone_number.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        phone_number = re.sub(r'\D', '', phone_number)
        if len(phone_number) < 10 or len(phone_number) > 15:
            raise serializers.ValidationError("Phone number must be between 10 and 15 digits.")
        return phone_number