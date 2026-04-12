import uuid

from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import localtime, now

def photo_upload_to(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4().hex[:10]}.{ext}' # 生成一个唯一的文件名
    # user_id或user.id都可以，前者效率更高，因为少一次数据库索引查询
    return f'user/photos/{instance.user_id}_{filename}' # 返回文件的相对路径，user/photos/用户id_文件名，instance.user_id 是用户id，filename 是文件名，instance是django的自带的模型实例

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # user 是 Django 自带的用户模型
    photo = models.ImageField(default='user/photos/default.png', upload_to=photo_upload_to) # 用户头像，用户上传的头像都在media目录下，第一个参数的路径是从media目录开始的相对路径，第二个参数是上传到哪个目录，这里上传到user/photos目录，并调用photo_upload_to函数生成唯一的文件名
    profile = models.TextField(default='谢谢你的关注', max_length=500) # 用户简介, 最大长度对TextField没用，因为TextField是字符串类型，没有长度限制，最大长度需要后面手动在代码里判读
    created_time = models.DateTimeField(default=now) # 创建时间
    updated_time = models.DateTimeField(default=now) # 更新时间

    def __str__(self):
        # time.localtime 只能接收「秒级时间戳」，不能接收 datetime；展示用 django 的 localtime
        dt = localtime(self.created_time)
        return f'{self.user.username} - {dt.strftime("%Y-%m-%d %H:%M:%S")}'