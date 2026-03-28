from django.shortcuts import render

# 类似go中的main函数, 处理请求并返回响应
def index(request):
    return render(request, 'index.html') # 渲染index.html模板, html是写在templates目录下的index.html文件
