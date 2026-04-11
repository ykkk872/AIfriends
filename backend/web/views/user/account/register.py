from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from web.models.user import UserProfile

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            username = request.data.get("username").strip()
            password = request.data.get("password").strip()
            if not username or not password:
                return Response({
                    'result': '用户名和密码不能为空'
                })
            if User.objects.filter(username=username).exists(): # .objects.filter() 方法用于查询数据库中符合条件的对象，exists() 方法用于判断是否存在符合条件的对象
                return Response({
                    'result': '用户名已存在'
                })
            user = User.objects.create_user(username=username, password=password) # create_user() 方法用于创建用户
            user_profile = UserProfile.objects.create(user=user) # create() 方法用于创建用户个人信息

            refresh = RefreshToken.for_user(user) # 生成jwt
            response = Response({
                'result': 'success',
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username,
                'photo': user_profile.photo.url,
                'profile': user_profile.profile,
            })
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                samesite='Lax',
                secure=True,
                max_age=86400 * 7,
            )
            return response
        except: 
            return Response({
                'result': '系统异常，请稍后重试'
            })