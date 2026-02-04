# 103.119.2.223:9999/doc.html    127.0.0.1:9999/doc.html
# 查看容器  docker ps -a                       docker ps -a --format "table \t{{.Names}}\t{{.Status}}\t{{.Ports}}"

# docker-compose down	                停止并删除容器,网络,默认不删卷和镜像
# 启动服务 sudo docker-compose  up -d            后台运行（detached 模式）✅ 最常用
# 重启服务   docker-compose up -d --build      sudo docker-compose  restart
# 查看日志 docker logs -f --tail 100  server_oss
# 进入容器 docker exec -it            server_oss    /bin/sh
# 删除容器 docker rm -f $(docker ps -q)

# https://www.qianwen.com/share?shareId=6e8a4173-9ca6-4246-9bd3-d4abe0ccc658
# 🧹 一步到位命令（推荐在项目目录下执行）：
# # 1. 停止并删除容器、网络、命名卷，并删除构建的镜像
# docker compose down -v --rmi all --remove-orphans

# # 2. 删除可能残留的匿名卷（谨慎：会删所有未用卷）
# docker volume prune -f

# # 3. 删除未被使用的镜像、容器、网络、构建缓存（不影响其他项目正在运行的服务）
# docker system prune -f

# 🔍 验证是否干净：
# 应该看不到任何与你项目相关的容器
# docker ps -a

# # 应该没有项目相关的卷（如 db_data、redis_cache 等）
# docker volume ls

# # 应该没有自动生成的网络（通常是 <项目目录名>_default）
# docker network ls

# # 镜像中不应有你自己 build 的服务镜像（除非你用了公共镜像如 nginx、redis，它们不会被删）
# docker images

#  注意事项：
# 主机绑定挂载（bind mounts）不会被删除

# 比如你在 volumes: 里写了 ./data:/app/data，那 ./data 是你本地文件夹，Docker 不会动它。你需要手动删除：
# rm -rf ./data   # 如果你确定要删

# ✅ 总结
# docker compose down -v --remove-orphans             # 停止并删除容器,删除容器,删除网络,删除卷,删除孤儿容器,不删除镜像
# docker compose down -v --rmi all --remove-orphans   # 停止并删除容器,删除容器,删除网络,删除卷,删除孤儿容器,会删除镜像
# docker volume prune -f
# docker system prune -f

# ✅提升wsl2       Win + R   输入下面内容      notepad %USERPROFILE%\.wslconfig  会新建一个文件夹 把下面内容粘贴进去 记得 去掉#
# [wsl2]
# memory=16GB
# processors=6
# swap=4GB

services:
  server_oss:
    container_name: server_oss
    image: node:lts-alpine3.22
    working_dir: /app #指定工作目录app
    stdin_open: true
    restart: always
    tty: true #保持容器运行
    ports:
      - '9999:9999'
    volumes:
      - ./:/app #项目文件夹名称映射容器app
      - /app/node_modules #docker创建独立匿名存储空间匿名卷,保护容器内的依赖不被覆盖
    # - ./app_oss:/app #项目文件夹名称映射容器app
    #      - ./filestore_oss:/app/oss_static # 外部文件夹映射到容器app内部文件夹
    command: sh -c "npm i pnpm -g && pnpm i  && pnpm dev"
