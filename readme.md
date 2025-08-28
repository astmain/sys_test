测试:1

# 首次 gitbash 设置邮箱和用户名 

- git config --global user.email "1311192345@qq.com"

- git config --global user.name "astmain"

# git 取消追踪文件
- git rm --cached \*.db
- git rm --cached D:\AAA\dayu_system_03\dayu04_end\src\db_orm_prisma\db_dev_sqlited.db


# github初始化仓库和强制上传

## 绑定目录

- git init && git remote add origin git@github.com:astmain/sys_test.git

## 强制上传

- echo "确定:强制上传吗?" && TIMEOUT /T 60 && echo "确定?:请回车" && git add . && git commit -m "强制上传" && git push -f origin master

## 本地分支跟踪远程分支 
- git branch --set-upstream-to=origin/master master
