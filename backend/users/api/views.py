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
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'user_id': user.id,
                'username': user.username,
                'slug': user.slug,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        
# ---------------------------------------------------------------
# View para Logout de Usuario ✓
class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'error': 'Refresh token obrigatório'}, status=400)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout realizado'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({'error': "Token inválido ou expirado"}, status=status.HTTP_400_BAD_REQUEST)
        
# ---------------------------------------------------------------
# View para acessar o dashboard do Usuario (cliente) ✓
class ClientDashboard(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        user = get_object_or_404(User, slug=slug)
        serializer = PublicUserSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

# ---------------------------------------------------------------
# View para acessar o dashboard do Usuario autenticado ✓
class UserDashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = PrivateUserSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
        
# ---------------------------------------------------------------
# View para acessar o perfil do Usuario autenticado ✓
class PerfilUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = PrivateUserSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
        
# ---------------------------------------------------------------
# View para atualizar o perfil do Usuario autenticado ✓
class UpdateUser(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = PostUpdateUserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)