from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

class logoutView(APIView):
    permission_classes = [IsAuthenticated] # 需要登录才能访问
    def post(self, request, *args, **kwargs):
        try:
            response = Response({
                'result': 'success'
            })
            response.delete_cookie('refresh_token')
            return response
        except:
            return Response({
                'result': '系统异常，请稍后重试'
            })