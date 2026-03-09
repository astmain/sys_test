
## 环境
查看环境     conda info -e
创建环境     conda create    -n p310_huggingface3  python=3.10 -y      
激活环境     conda activate     p310_huggingface1   

镜像的源     pip config set global.index-url https://pypi.org/simple
下载依赖包   pip install -r requirements.txt 



# 自己补充的包 
# pip install -r         requirements.txt
# pip list | findstr /i  "numpy  torch"
# 我安装的是 pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
numpy==1.26.4
opencv-python==4.9.0.80




下载ai模型
方式1_huggingface官方(优点包很多,缺点下载慢容易卡住)
huggingface__download.py


方式2_魔塔社区(优点下载很快,缺点包比较少)
官网搜索模型
pip install --upgrage modelscope
modelscope download --model FunAudioLLM/Fun-CosyVoice3-0.5B-2512 --local_dir pretrained_models/Fun-CosyVoice3-0.5B
modelscope download --model iic/CosyVoice2-0.5B --local_dir pretrained_models/CosyVoice2-0.5B
modelscope download --model iic/CosyVoice-300M --local_dir pretrained_models/CosyVoice-300M
modelscope download --model iic/CosyVoice-300M-SFT --local_dir pretrained_models/CosyVoice-300M-SFT
modelscope download --model iic/CosyVoice-300M-Instruct --local_dir pretrained_models/CosyVoice-300M-Instruct
modelscope download --model iic/CosyVoice-ttsfrd --local_dir pretrained_models/CosyVoice-ttsfrd


 choco
 
安装 NVIDIA App
 nvidia-smi
 nvidia-smi -l 2  # 每 2 秒刷新一次
 
 
 教程 https://www.bilibili.com/video/BV1Qr421F7PT
# 如何判断windows电脑有没有安装cuda
# 我的电脑显卡配置
NVIDIA-SMI 546.26                 Driver Version: 546.26       CUDA Version: 12.3
nvcc --version

cuda-toolkit 驱动下载 https://developer.nvidia.com/cuda-toolkit-archive
NVCUDA64. DLL31.0.15.4626 NVIDIA CUDA 12.3.106 driver

画质增强工具
Topaz        VideoEnhancer

# 我的电脑
雷神猎刃r16 cpu-i913900hx(Raptor Lake-HX，24核32线程) gpu-NVIDIA GeForce RTX 4060 Laptop（8GB GDDR6）
雷神猎刃r16 可以加多大的ram固态内存
雷神猎刃r16 可以加多大的ssd固态硬盘             M.2 2280      铠侠（Kioxia）	SE10 / BG5	1/2TB	你原装盘可能是铠侠，同品牌兼容稳
买固态硬盘搜索关键词 铠侠RC20 1TB NVMe M.2
# 固态内存-查看方式
wmic memorychip get Manufacturer,PartNumber,Capacity,Speed
Capacity     Manufacturer        PartNumber         Speed
17179869184  Crucial Technology  CT16G48C46S5.M8G1  4800
17179869184  Crucial Technology  CT16G48C40S5.C8A1  4800
固态内存   ram
容积       Capacity
制造商     Manufacturer
零件编号    PartNumber
速度       Speed

# 固态硬盘-查看方式
wmic diskdrive get model,serialnumber,size,interfacetype
InterfaceType  Model                    SerialNumber                              Size
SCSI           NVMe KPEGYRTBE2M001TCGC  D120_0000_0017_F643_346F_7100_0000_021D.  1024203640320


wmic path Win32_DiskDrive get Caption, Model, InterfaceType, MediaType
Caption                  InterfaceType  MediaType              Model
NVMe KPEGYRTBE2M001TCGC  SCSI           Fixed hard disk media  NVMe KPEGYRTBE2M001TCGC

我想在加一个相同 凯侠 1t的 应该 淘宝搜索 什么关键词
实际对应的硬件接口     InterfaceType
型号                  Model
序列号                SerialNumber
容量                  Size