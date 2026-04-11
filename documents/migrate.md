(.venv) ➜  backend git:(master) ✗ python manage.py makemigrations
Migrations for 'web':
  web/migrations/0001_initial.py
    - Create model UserProfile
(.venv) ➜  backend git:(master) ✗ python manage.py migrate       
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, web
Running migrations:
  Applying web.0001_initial... OK
(.venv) ➜  backend git:(master) ✗ 

要先将编写的model(UserProfile)加到backend/web/admin.py，再执行上面的命令，否则可能识别不到数据库