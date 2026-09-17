from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth
from django.contrib.auth.models import User

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        id_token = auth_header.split('Bearer ')[1]
        
        try:
            # Valida o token com o Firebase Admin
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            email = decoded_token.get('email')
            
            # Busca ou cria o usuário no banco do Django
            user, created = User.objects.get_or_create(username=uid, defaults={'email': email})
            
            # Torna o seu e-mail especificamente um superuser/staff no Django
            if email == 'seu_email_admin@gmail.com' and not user.is_staff:
                user.is_staff = True
                user.is_superuser = True
                user.save()

            return (user, None)
            
        except Exception as e:
            raise AuthenticationFailed(f'Token inválido: {str(e)}')