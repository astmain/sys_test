#!/bin/bash
# ./install_docker.sh
set -euo pipefail

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() { echo -e "${GREEN}[INFO] $*${NC}"; }
warn() { echo -e "${YELLOW}[WARN] $*${NC}"; }
error() { echo -e "${RED}[ERROR] $*${NC}"; exit 1; }

# 检查是否 root
[ "$(id -u)" -ne 0 ] && error "请用 root 或 sudo 执行此脚本"

# 系统检测
OS_ID=$(grep -oP '(?<=^ID=).+' /etc/os-release | tr -d '"')
OS_CODENAME=$(grep -oP '(?<=^VERSION_CODENAME=).+' /etc/os-release | tr -d '"')
[ "$OS_ID" != "ubuntu" ] && error "仅支持 Ubuntu"
[ "$OS_CODENAME" != "jammy" ] && warn "当前脚本为 Ubuntu 22.04 (jammy) 优化，你的版本：$OS_CODENAME"

info "=== 开始安装 Docker CE (Ubuntu 22.04) ==="

# 1. 安装依赖
info "安装依赖：ca-certificates curl gnupg lsb-release"
apt-get update -qq
apt-get install -y -qq ca-certificates curl gnupg lsb-release

# 2. 添加 Docker GPG 密钥（阿里云）
DOCKER_GPG_PATH="/etc/apt/keyrings/docker.gpg"
info "添加 Docker 阿里云 GPG 密钥"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | gpg --dearmor -o "$DOCKER_GPG_PATH"
chmod a+r "$DOCKER_GPG_PATH"

# 3. 添加 Docker 软件源（阿里云）
info "添加 Docker 阿里云 APT 源"
echo "deb [arch=$(dpkg --print-architecture) signed-by=$DOCKER_GPG_PATH] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $OS_CODENAME stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. 安装 Docker Engine
info "更新源并安装 docker-ce、docker-ce-cli、containerd.io、docker-compose-plugin"
apt-get update -qq
apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. 启动并开机自启
info "设置 Docker 开机自启并启动服务"
systemctl enable --now docker
systemctl daemon-reload

# 6. 配置阿里云镜像加速（可选但强烈建议）
info "配置阿里云镜像加速"
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.aliyuncs.com",
    "https://docker.mirrors.ustc.edu.cn"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
EOF
systemctl restart docker

# 7. 验证安装
info "=== 验证安装 ==="
docker --version
docker compose version
info "运行 hello-world 测试"
if docker run --rm hello-world; then
  info "${GREEN}✅ Docker 安装并测试成功！${NC}"
else
  error "❌ Docker 测试失败"
fi

# 8. 提示：普通用户加入 docker 组
warn "如需普通用户免 sudo 使用 docker，请执行："
warn "  sudo usermod -aG docker \$USER"
warn "  然后重新登录或执行：newgrp docker"

info "=== 全部完成 ==="



sudo  docker pull postgres:17