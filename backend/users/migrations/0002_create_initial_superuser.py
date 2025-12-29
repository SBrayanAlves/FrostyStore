from django.db import migrations
import os

def create_superuser(apps, schema_editor):
    User = apps.get_model("users", "User")

    username = os.getenv("SUPERUSER_USERNAME")
    email = os.getenv("SUPERUSER_EMAIL")
    password = os.getenv("SUPERUSER_PASSWORD")
    first_name = os.getenv("SUPERUSER_FIRST_NAME")
    last_name = os.getenv("SUPERUSER_LAST_NAME")

    if not User.objects.filter(username=username).exists():
        print(f"Criando superusuário: {username}")
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
    else:
        print(f"Superusuário {username} já existe. Pulando criação.")

class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"), 
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]