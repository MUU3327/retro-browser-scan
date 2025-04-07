# 复古浏览器扫描 (Retro Browser Scan)

一个具有复古未来主义风格的浏览器和网络信息扫描工具。

![复古浏览器扫描](https://i.imgur.com/example.jpg)

## 功能特点

- **IP信息显示**：显示用户的公网IP地址、国家、地区、城市、ISP和时区
- **数据中心IP检测**：检测用户的IP地址是否属于数据中心
- **WebRTC测试**：检测是否存在WebRTC泄露，这可能指示VPN或代理的使用
- **延迟测试**：测试访问Google、YouTube和Cloudflare的延迟速度
- **IP时区与浏览器时区比较**：比较IP时区和浏览器时区，检查是否存在时区不匹配的情况
- **HTTP代理头检测**：检查请求头中是否存在常见的代理服务器添加的HTTP头
- **动态地图显示**：使用Leaflet和OpenStreetMap显示用户IP地址的地理位置

## 技术栈

- HTML5
- CSS3 / Tailwind CSS
- JavaScript (ES6+)
- Leaflet.js (地图显示)
- Font Awesome (图标)

## 设计风格

网站采用复古未来主义(Retro-Futurism)设计风格，特点包括：

- 霓虹色调和发光效果
- 格栅背景和透视效果
- 类似终端的界面元素
- 高对比度的色彩方案

主色调：青色(#00e5ff)、品红(#ff2a6d)和深蓝(#0a0b18)

## 本地运行

1. 克隆此仓库：
   ```bash
   git clone https://github.com/yourusername/retro-browser-scan.git
   ```

2. 进入项目目录：
   ```bash
   cd retro-browser-scan
   ```

3. 使用任意HTTP服务器启动项目，例如：
   ```bash
   # 如果安装了Python
   python -m http.server
   
   # 或者使用Node.js的http-server
   npx http-server
   ```

4. 在浏览器中访问 `http://localhost:8000`

## 隐私说明

本工具仅用于教育目的，不会存储任何用户数据。所有检测都在客户端本地进行，不会将您的信息发送到第三方服务器（除了获取IP信息的API调用）。

## 许可证

MIT 