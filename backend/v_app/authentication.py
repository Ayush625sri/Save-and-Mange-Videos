from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token

class TokenCookieAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Get token from cookies
        token = request.COOKIES.get('auth_token')

        if not token:
            return None

        try:
            # Retrieve the user associated with the token
            token_obj = Token.objects.get(key=token)
        except Token.DoesNotExist:
            raise AuthenticationFailed('Invalid token')

        return (token_obj.user, token_obj)
