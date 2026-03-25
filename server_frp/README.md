### 视频教程
https://www.bilibili.com/video/BV19wRqYBEYH
https://www.bilibili.com/video/BV1Jf421q7we


### windows系统-客户端
选择版本          frp_0.68.0_windows_amd64
文件保留          frpc.exe  frpc.toml

### linux系统-服务端
下载地址           https://github.com/fatedier/frp/releases
选择版本          frp_0.68.0_windows_amd64
先解压            tar  -zxvf  frp_0.68.0_linux_amd64.tar.gz   
文件保留          frps.exe  frps.toml   
然后重命名文件夹   my_frp_linux_s
修改文件frps.toml的内容如下
"""
bindPort = 7000
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "fengdongnan"
webServer.password = "Fh040526"


auth.method="token"
auth.token = "thisisatoken"
# linux的frp启动方式(单次)       ./frps -c frps.toml         
# 访问frp的中控制台         103.119.2.223:7500 
"""


### linux配置启动方式(永久)
将frps.service文件复制到           /etc/systemd/system/frps.service
查看一下内容                   cat /etc/systemd/system/frps.service
停止服务            sudo systemctl stop frps
加载文件            sudo systemctl daemon-reload


启动服务            sudo systemctl start frps
检查状态            sudo systemctl status frps
重新启动            sudo systemctl restart frps



### 启动本地服务测试是否成功
103.119.2.223:7101/docs
127.0.0.1:8001/docs


.\frpc.exe -c  frpc.toml
