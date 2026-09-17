from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    # ...
    role = models.CharField(
        max_length=20,  
        # ...
    )
class Papel(models.TextChoices):
    VISITANTE = "visitante", "Visitante"
    COLABORADOR = "colaborador", "Colaborador"
    GESTOR = "gestor", "Gestor"
    ADMIN = "admin", "Admin"


