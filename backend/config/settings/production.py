from .base import *
import dj_database_url
import os

# Em produção, DEBUG deve ser sempre False
DEBUG = False

# Hosts que podem servir a API (ex: frostystore.onrender.com)
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

# Confiança no CSRF para HTTPS
if ALLOWED_HOSTS:
    CSRF_TRUSTED_ORIGINS = [f"https://{host}" for host in ALLOWED_HOSTS]

# --- CORS (Quem pode acessar a API) ---
# Aqui vai a URL do Frontend na Vercel
CORS_ALLOWED_ORIGINS_ENV = os.getenv("CORS_ALLOWED_ORIGINS", "")
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS_ENV.split(",") if CORS_ALLOWED_ORIGINS_ENV else []

# Database (PostgreSQL do Render)
DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True
    )
}

# Configurações de Segurança (HTTPS)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Arquivos Estáticos (Onde o Django coleta os arquivos do Admin)
STATIC_ROOT = BASE_DIR / 'staticfiles'

# --- CONFIGURAÇÃO DE ARMAZENAMENTO (STORAGES) ---
# Django 4.2+ usa dicionário STORAGES

# 1. Configuração Padrão (Sem S3 - usa disco local efêmero para media e WhiteNoise para static)
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# 2. Configuração AWS S3
if os.getenv("USE_S3") == "TRUE":
    INSTALLED_APPS += ["storages"]

    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
    
    AWS_S3_SIGNATURE_VERSION = 's3v4'
    AWS_QUERYSTRING_AUTH = False
    AWS_S3_FILE_OVERWRITE = False

    STORAGES["default"] = {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        "OPTIONS": {
            "location": "media",
            "default_acl": "public-read", 
        },
    }