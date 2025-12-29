from .base import *
import dj_database_url
import os

# Em produção, DEBUG deve ser sempre False, a menos que forçado via ENV para teste rápido
DEBUG = False

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")

if ALLOWED_HOSTS:
    CSRF_TRUSTED_ORIGINS = [f"https://{host}" for host in ALLOWED_HOSTS]

# Database
DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True # Isso exige que o banco suporte SSL (Postgres de produção suporta)
    )
}

# Configurações de Segurança
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Arquivos Estáticos (WhiteNoise)
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

if os.getenv("USE_S3") == "TRUE":
    INSTALLED_APPS += ["storages"]

    # Credenciais da AWS (Pegaremos no console da AWS)
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = 'us-east-1' # Ou a região que você escolher (ex: sa-east-1 para SP)
    
    # Configurações para deixar os arquivos públicos (Vitrine)
    AWS_S3_SIGNATURE_VERSION = 's3v4'
    AWS_QUERYSTRING_AUTH = False # Não gerar links temporários/assinados
    AWS_S3_FILE_OVERWRITE = False # Se subir arquivo com mesmo nome, renomeia o novo

    # Diz ao Django para usar o S3 para Media (Uploads)
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
            "OPTIONS": {
                "location": "media", # Salvar dentro da pasta 'media' no bucket
                "default_acl": "public-read", # Arquivos são públicos para leitura
            },
        },
        "staticfiles": {
            # Static files (CSS do Admin) podem continuar no Whitenoise
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }