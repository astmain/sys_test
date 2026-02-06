
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