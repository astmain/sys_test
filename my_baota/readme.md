
# 云服务安装环境
1开放端口_云服务器配置
1开放端口_宝塔配置
2安装宝塔
4安装node环境
3安装docker


# 域名_云服务器_宝塔配置网站_nginx反向代理
1域名验证
1云服务器_解析域名
2宝塔配置网站                     [Let's Encrypt]申请证书
3宝塔配置主网站配置文件            参考[3宝塔配置主网站配置文件.png]   
4容器docket设置nginx代理8001      参考[set_niginx]
5首先设置子网站8001反向代理        8001.dayu3d.com
6然后设置主网站80反向代理	       http://47.104.240.98:8001






location /all {
    index index.html index.htm ;
    
    # 允许访问子目录
    autoindex on;
    # 跨域问题
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' '0';
        return 204;
    }
}




