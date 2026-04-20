from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from web.models.user import UserProfile

class GetUserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        user_profile = UserProfile.objects.get(user=user) # 获取用户个人信息, 从数据库查询UserProfile表，获取user_id对应的用户个人信息
        return Response({
            'result': 'success',
            'user_id': user.id,
            'username': user.username,
            'photo': user_profile.photo.url,
            'profile': user_profile.profile,
        })