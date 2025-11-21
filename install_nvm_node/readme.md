# 乌班图系统安装nvm和node

第一步：更新系统 & 安装必要依赖
sudo apt update
sudo apt install -y curl wget build-essential

方法 A：使用 curl安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

第三步：重新加载 shell 配置
source ~/.bashrc

第四步：验证 NVM 是否安装成功
nvm --version

第五步：安装node版本
nvm install 20

第六步：nvm指定使用node版本
nvm use 20

第六步：全局安装pnpm 
npm i -g pnpm