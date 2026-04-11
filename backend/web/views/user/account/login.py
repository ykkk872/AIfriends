from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from web.models.user import UserProfile


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get("username").strip() # strip() 方法用于移除字符串两端的空白字符（包括空格、换行符、制表符等）
            password = request.data.get("password").strip()
            if not username or not password:
                return Response({
                    'result': '用户名和密码不能为空'
                })
            user = authenticate(username=username, password=password) # authenticate() 方法用于验证用户名和密码
            if user:  # 用户名密码正确
                user_profile = UserProfile.objects.get(user=user) # 获取用户个人信息, 从数据库查询UserProfile表，获取user_id对应的用户个人信息
                refresh = RefreshToken.for_user(user)  # 生成jwt # RefreshToken.for_user(user) 方法用于生成一个 RefreshToken 对象，这个对象包含了用户的信息和一些其他信息
                response = Response({
                    'result': 'success',
                    'access': str(refresh.access_token), # 将access_token转换为字符串返回
                    'user_id': user.id,
                    'username': user.username,
                    'photo': user_profile.photo.url,  # 必须加url！！！才能返回路径，因为photo是ImageField类型，不是字符串类型
                    'profile': user_profile.profile,
                })
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    httponly=True,
                    samesite='Lax',
                    secure=True,
                    max_age=86400 * 7, # refresh token 7天有效期
                )
                return response
            return Response({ # 用户名或密码错误
                'result': '用户名或密码错误'
            })
        except:
            return Response({
                'result': '系统异常，请稍后重试'
            })
