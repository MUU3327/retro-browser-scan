# 复古浏览器扫描 (Retro Browser Scan)

一个具有复古未来主义风格的浏览器和网络信息扫描工具，可全面检测网络环境和代理/VPN使用情况。

![复古浏览器扫描](https://i.imgur.com/example.jpg)

## 功能特点

### 基础扫描功能
- **IP信息显示**：显示用户的公网IP地址、国家、地区、城市、ISP和时区
- **数据中心IP检测**：检测用户的IP地址是否属于数据中心
- **WebRTC测试**：检测是否存在WebRTC泄露，这可能指示VPN或代理的使用
- **延迟测试**：测试访问Google、YouTube和Cloudflare的延迟速度
- **IP时区与浏览器时区比较**：比较IP时区和浏览器时区，检查是否存在时区不匹配的情况
- **HTTP代理头检测**：检查请求头中是否存在常见的代理服务器添加的HTTP头
- **动态地图显示**：使用Leaflet和OpenStreetMap显示用户IP地址的地理位置

### 高级代理/VPN检测功能
- **IP托管服务商检测**：检查IP地址是否来自已知的托管服务商
- **IP代理列表检测**：检查IP是否在已知代理服务器列表中
- **IP VPN列表检测**：检查IP是否在已知VPN提供商列表中
- **VPN出口节点枚举**：检测IP是否为已知的VPN出口节点
- **TCP/IP指纹检测**：分析TCP/IP连接特征，查找User-Agent与网络层信息不匹配的情况
- **端口扫描检测**：扫描可能指示代理服务存在的开放端口
- **高级时区分析**：进行深度时区分析，检测显著的时区差异
- **网络行为异常检测**：分析用户网络行为中的异常模式
- **网络流模式分析**：分析TCP/IP连接流，寻找代理/VPN特征
- **高延迟检测**：检测异常高的网络延迟
- **延迟与Ping比较**：比较TCP/IP连接延迟与ICMP ping RTT

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
- 信息卡片式布局设计

主色调：青色(#00e5ff)、品红(#ff2a6d)和深蓝(#0a0b18)

## 检测原理说明

每项高级检测功能都配有详细的技术说明，帮助用户理解检测原理和结果解释。点击检测结果旁边的信息按钮，即可查看：

- 检测的工作原理
- 检测的技术实现
- 结果的解释说明
- 相关技术说明和注意事项

## 本地运行

1. 克隆此仓库：
   ```bash
   git clone https://github.com/yourusername/retro-browser-scan.git
   ```

2. 进入项目目录：
   ```bash
   cd retro-browser-scan
   ```

3. 使用Node.js启动内置服务器：
   ```bash
   node server.js
   ```
   
   或者使用其他HTTP服务器：
   ```bash
   # 如果安装了Python
   python -m http.server
   
   # 或者使用Node.js的http-server
   npx http-server
   ```

4. 在浏览器中访问 `http://localhost:3000` 或服务器提供的URL

## 隐私说明

本工具仅用于教育目的，不会存储任何用户数据。所有检测都在客户端本地进行，不会将您的信息发送到第三方服务器（除了获取IP信息的API调用）。高级检测功能使用模拟数据进行演示，实际生产环境中需要配合服务器端API实现完整功能。

## 许可证

MIT 
