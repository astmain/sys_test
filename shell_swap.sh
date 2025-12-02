#!/bin/bash

# 使用:
# chmod +x shell_swap.sh
# sudo ./shell_swap.sh


# 规范化格式:
# sudo apt update
# sudo apt install dos2unix


# 设定 swap 大小（单位：G）
SWAPSIZE=2

# 检查是否已有 swap
if swapon --show | grep -q '/swapfile'; then
    echo "Swap 已存在，跳过创建。"
    exit 0
fi

echo "创建 ${SWAPSIZE}G 的 swap 文件..."

# 创建 swap 文件
fallocate -l ${SWAPSIZE}G /swapfile || dd if=/dev/zero of=/swapfile bs=1G count=$SWAPSIZE

# 设置权限
chmod 600 /swapfile

# 格式化 swap
mkswap /swapfile

# 启用 swap
swapon /swapfile

# 添加到 /etc/fstab，确保开机自动启用
if ! grep -q "^/swapfile" /etc/fstab; then
    echo "/swapfile none swap sw 0 0" | tee -a /etc/fstab
fi

# 设置 swappiness（推荐值 10）
sysctl vm.swappiness=10
if ! grep -q "vm.swappiness" /etc/sysctl.conf; then
    echo "vm.swappiness=10" | tee -a /etc/sysctl.conf
fi

echo "✅ Swap 设置完成！当前 swap 使用情况："
swapon --show
free -h
