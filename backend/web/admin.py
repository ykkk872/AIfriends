from django.contrib import admin
from web.models.user import UserProfile
# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    raw_id_fields = ('user',) # 逗号不能删，这里需要传一个列表，删了就不是列表了