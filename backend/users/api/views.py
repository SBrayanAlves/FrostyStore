from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from  users.models import User
from .serializers import UserLoginSerializer
from .serializers import PublicUserSerializer
from .serializers import PrivateUserSerializer
from .serializers import PostUpdateUserSerializer


# Create your views here.

# ---------------------------------------------------------------
# View para Login de Usuario ✓
class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = UserLoginSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                user = serializer.validated_data['user']
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
        
# ---------------------------------------------------------------
# View para Logout de Usuario ✓
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
        
# ---------------------------------------------------------------
# View para acessar o dashboard do Usuario (cliente) ✓
class ClientDashboard(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            user = get_object_or_404(User, slug=slug)
            serializer = PublicUserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ---------------------------------------------------------------
# View para acessar o dashboard do Usuario autenticado ✓
class UserDashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            serializer = PrivateUserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
# ---------------------------------------------------------------
# View para acessar o perfil do Usuario autenticado ✓
class PerfilUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            serializer = PrivateUserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# ---------------------------------------------------------------
# View para atualizar o perfil do Usuario autenticado ✓
class UpdateUser(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            user = request.user
            serializer = PostUpdateUserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)