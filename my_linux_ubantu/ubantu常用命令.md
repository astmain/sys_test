查看当前操作系统
 cat /etc/os-release
结果
PRETTY_NAME="Ubuntu 22.04 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=jammy


查看当前操作系统
lsb_release -a
结果
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 22.04 LTS
Release:        22.04
Codename:       jammy


查看当前操作系统
cat /etc/issue
结果
Ubuntu 22.04 LTS \n \l


排查云服务器问题
https://www.qianwen.com/chat/2e7de32f8f8b44f9bc0b55dfc64303e6



## 单词解释etc目录
Unix 的创造者之一 Ken Thompson 和 Dennis Ritchie 在 1970 年代设计文件系统时，就用 /etc 来存放杂项系统文件，包括启动脚本、用户账户、网络配置等。
在现代 Linux 和 Unix 系统中，/etc 是系统全局配置文件的核心目录。它的主要作用包括：
|文件/目录					|用途							
|/etc/passwd				|用户账户基本信息	
|/etc/shadow				|加密后的用户密码	
|/etc/group					|用户组信息		
|/etc/fstab					|文件系统挂载表		
|/etc/hosts					|本地主机名解析		
|/etc/os-release			|操作系统标识信息	
|/etc/systemd/				|systemd 服务配置	
|/etc/apt/ (Debian/Ubuntu)	|APT 包管理器配置	