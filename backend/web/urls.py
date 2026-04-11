from django.urls import path
from web.views.user.account.login import LoginView
from web.views.user.account.logout import logoutView
from web.views.user.account.register import RegisterView
from web.views.user.account.refresh_token import refreshTokenView

urlpatterns = [
    path('api/user/account/login/', LoginView.as_view()),
    path('api/user/account/logout/', logoutView.as_view()),
    path('api/user/account/register/', RegisterView.as_view()),
    path('api/user/account/refresh_token/', refreshTokenView.as_view()),
]