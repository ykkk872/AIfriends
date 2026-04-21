from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

class refreshTokenView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token: # 如果refresh token为空字符串，返回错误信息
                return Response({
                    'result': 'refresh token 不存在',
                }, status=401) # 401状态码表示未授权，需要重新登录
            refresh = RefreshToken(refresh_token) # RefreshToken会自动检测refresh token是否过期，如果过期，会报异常，然后被except捕获，返回401
            if settings.SIMPLE_JWT['ROTATE_REFRESH_TOKENS']: # 如果配置了旋转refresh token，则旋转refresh token
                refresh.set_jti() # 设置jti，即token的唯一标识
                response = Response({
                    'result': 'success',
                    'access': str(refresh.access_token), # 将access_token转换为字符串返回
                })
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    httponly=True,
                    samesite='Lax',
                    secure=False, # 开发环境用 HTTP，必须设为 False；生产环境（HTTPS）改回 True
                    max_age=86400 * 7, # refresh token 7天有效期
                )
                return response
            return Response({ # 如果没配置ROTATE_REFRESH_TOKENS且没过期(RefreshToken未抛出异常)，则直接返回access token
                'result': 'success',
                'access': str(refresh.access_token),
            })
        except:
            return Response({
                'result': 'refresh token 过期'
            }, status=401) # 401状态码表示未授权，需要重新登录