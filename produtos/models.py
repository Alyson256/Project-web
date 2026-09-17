from django.conf import settings
from django.db import models

class Colaborador(models.Model):
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='perfil_colaborador')
    bio = models.TextField(blank=True)
    contato_whatsapp = models.CharField(max_length=20, blank=True)
    foto = models.ImageField(upload_to='colaboradores/', blank=True, null=True)

    def __str__(self):
        return self.usuario.get_full_name() or self.usuario.username


class Produto(models.Model):
    colaborador = models.ForeignKey(Colaborador, on_delete=models.CASCADE, related_name='produtos')
    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=8, decimal_places=2)
    foto = models.ImageField(upload_to='produtos/', blank=True, null=True)
    disponivel = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} ({self.colaborador})"
    