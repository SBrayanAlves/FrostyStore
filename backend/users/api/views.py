from django.shortcuts import render
from users.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.

class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            if email and password:
                user = authenticate(request, email=email, password=password)
                if user is not None:
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'message': 'Login successful',
                        'user_id': user.id,
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    })
                else:
                    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successful'} , status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)