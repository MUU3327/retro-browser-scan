// 复古浏览器扫描 - Retro Browser Scan
document.addEventListener('DOMContentLoaded', function() {
    // Terminal typing effect
    const terminalText = document.getElementById('terminal-text');
    const startScanBtn = document.getElementById('start-scan-btn');
    const resultsSection = document.getElementById('results');
    
    // Terminal text animations
    const messages = [
        "正在初始化系统...",
        "加载复古浏览器扫描引擎...",
        "准备就绪，点击「开始扫描」按钮开始检测。"
    ];
    
    let messageIndex = 0;
    let charIndex = 0;
    let typingInterval;
    
    // Test info modal content
    const testInfoData = {
        'http-headers-info': {
            title: 'HTTP Headers 检测',
            content: `
                <p>此测试检查HTTP请求头中是否存在常见的代理服务器添加的头部信息，如 <code>X-Forwarded-For</code>、<code>Via</code>、<code>Proxy-Connection</code> 等。</p>
                
                <h4>检测原理</h4>
                <p>当请求通过代理服务器时，代理服务器通常会修改或添加某些HTTP头部信息，以便目标服务器知道请求是通过代理发送的。最常见的头部包括：</p>
                <ul>
                    <li><code>X-Forwarded-For</code>: 包含客户端的原始IP地址</li>
                    <li><code>Via</code>: 指示请求经过的代理服务器</li>
                    <li><code>Proxy-Connection</code>: 代理连接信息</li>
                    <li><code>X-Proxy-ID</code>: 代理服务器的标识符</li>
                </ul>
                
                <h4>结果解释</h4>
                <p>如果检测到这些头部，表明请求可能通过代理服务器。然而，现代VPN和高匿名代理通常会删除或修改这些头部，避免被检测到。</p>
                
                <div class="tech-note">
                    <strong>技术说明:</strong> 此测试需要服务器端配合，因为客户端JavaScript无法直接访问完整的HTTP请求头信息。
                </div>
            `
        },
        'hosting-provider-info': {
            title: 'IP 属于托管服务商检测',
            content: `
                <p>此测试检查您的IP地址是否属于已知的数据中心或托管服务提供商，这通常表明可能使用了VPN或代理服务。</p>
                
                <h4>检测原理</h4>
                <p>普通家庭或移动网络用户的IP地址通常属于互联网服务提供商(ISP)，如电信、联通等。而数据中心和托管服务提供商（如Amazon AWS、Linode、DigitalOcean等）的IP地址段主要用于服务器托管，不是普通用户的互联网接入。</p>
                <p>如果您的连接IP属于数据中心或托管服务提供商，而非普通ISP，这可能表明您正在使用VPN或代理服务，因为大多数VPN提供商在这些数据中心运行他们的服务器。</p>
                
                <h4>结果解释</h4>
                <p>此测试使用已知数据中心IP地址数据库进行匹配。如果您的IP被识别为托管服务商的IP，这不一定意味着您正在使用VPN或代理，但这确实增加了这种可能性。例如，一些企业可能使用数据中心的IP范围用于其办公网络。</p>
            `
        },
        'proxy-list-info': {
            title: 'IP 在代理列表中检测',
            content: `
                <p>此测试检查您的IP地址是否出现在已知的代理服务器列表中。</p>
                
                <h4>检测原理</h4>
                <p>有许多组织维护着已知代理服务器的IP地址数据库。这些数据库通过多种渠道收集信息，包括：</p>
                <ul>
                    <li>已公开的代理服务器列表</li>
                    <li>网络扫描发现的开放代理</li>
                    <li>行为分析识别的可能代理</li>
                    <li>恶意活动报告中的IP地址</li>
                </ul>
                
                <h4>结果解释</h4>
                <p>如果您的IP地址出现在这些列表中，这相当可靠地表明您正在使用代理服务器。然而，许多高质量的私人代理或新设立的代理可能不在这些列表中。</p>
                
                <div class="tech-note">
                    <strong>技术说明:</strong> 此测试使用多个代理检测服务的综合结果，提高检测的准确性。
                </div>
            `
        },
        'vpn-list-info': {
            title: 'IP 在VPN列表中检测',
            content: `
                <p>此测试检查您的IP地址是否属于已知的VPN服务提供商。</p>
                
                <h4>检测原理</h4>
                <p>类似于代理列表，各种组织维护着已知VPN服务提供商使用的IP地址范围数据库。这些信息来源包括：</p>
                <ul>
                    <li>VPN提供商公开的服务器列表</li>
                    <li>网络流量分析</li>
                    <li>VPN服务特征识别</li>
                    <li>用户报告和研究</li>
                </ul>
                
                <h4>结果解释</h4>
                <p>如果您的IP地址被识别为属于VPN提供商，这是一个强有力的指标，表明您正在使用VPN服务。然而，较小或较新的VPN提供商可能不在这些数据库中。</p>
                
                <div class="tech-note">
                    <strong>技术说明:</strong> 此检测每天更新数据库，以跟踪VPN提供商不断变化的IP地址池。
                </div>
            `
        },
        'vpn-exit-node-info': {
            title: 'VPN出口节点检测',
            content: `
                <p>此测试检查您的IP地址是否为已知的VPN出口节点。出口节点是VPN网络中的终端服务器，您的流量从此发送到目标网站。</p>
                
                <h4>检测原理</h4>
                <p>VPN出口节点检测更为精确，它不仅检查IP是否属于VPN提供商，还确认该IP当前是否作为活跃的VPN出口节点使用。这通过以下方法实现：</p>
                <ul>
                    <li>主动扫描和监控已知VPN服务的网络特征</li>
                    <li>识别VPN协议的特定网络签名</li>
                    <li>分析与已知VPN行为匹配的流量模式</li>
                </ul>
                
                <h4>结果解释</h4>
                <p>如果您的IP被识别为VPN出口节点，这几乎可以确定您正在使用VPN服务。此测试比一般的VPN列表检测更准确，误报率更低。</p>
                
                <div class="tech-note">
                    <strong>技术说明:</strong> 此检测专门针对活跃的VPN出口点，不包括可能属于VPN提供商但当前未用作出口节点的IP地址。
                </div>
            `
        },
        'tcpip-fingerprint-info': {
            title: 'TCP/IP 指纹检测',
            content: `
                <p>此测试分析TCP/IP连接的特征，检查User-Agent报告的操作系统与TCP/IP标头反映的操作系统是否一致。</p>
                
                <h4>检测原理</h4>
                <p>不同的操作系统实现TCP/IP协议栈的方式略有不同，这会在TCP/IP连接的参数中留下"指纹"。这些参数包括：</p>
                <ul>
                    <li>TCP窗口大小和缩放因子</li>
                    <li>TTL(生存时间)值</li>
                    <li>IP标头中的标识字段行为</li>
                    <li>TCP选项的顺序和值</li>
                </ul>
                <p>当用户通过VPN或代理连接时，浏览器报告的操作系统(通过User-Agent)与TCP/IP连接参数反映的操作系统可能不匹配，因为连接是由VPN/代理服务器建立的，而不是用户的设备。</p>
                
                <h4>结果解释</h4>
                <p>如果检测到不匹配，这强烈表明流量正通过代理或VPN。然而，一些专业的VPN客户端可以模拟原始设备的TCP/IP特征，避免此类检测。</p>
                
                <div class="tech-note">
                    <strong>技术说明:</strong> 此测试基于p0f和其他TCP/IP指纹识别技术的原理。详细信息可参考: <a href="https://github.com/NikolaiT/zardaxt" target="_blank" class="text-cyan-400 hover:underline">zardaxt项目</a>
                </div>
            `
        },
        'portscan-info': {
            title: '端口扫描检测',
            content: `
                <p>此测试扫描您的IP地址上可能指示代理服务存在的开放端口。</p>
                
                <h4>检测原理</h4>
                <p>代理服务器和VPN通常在特定端口上运行，如8080(HTTP代理)、1080(SOCKS)、3128(Squid)、443(OpenVPN)等。端口扫描可以发现这些开放的端理服务端口。</p>
                
                <h4>结果解释</h4>
                <p>如果在您的IP上发现代理相关的开放端口，这强烈表明您的设备正在运行代理服务或VPN服务器。然而，许多其他服务也使用这些端口，因此可能有误报。</p>
                
                <div class="tech-note">
                    <strong>警告:</strong> 此测试较为侵入性，仅扫描入站连接的端口，不扫描本地环回接口。某些网络可能会将端口扫描视为敌对行为。
                </div>
            `
        },
        'adv-timezone-info': {
            title: '高级时区检测',
            content: `
                <p>此测试进行更复杂的时区分析，检查您的浏览器时区与IP地理位置对应时区之间是否存在显著差异。</p>
                
                <h4>检测原理</h4>
                <p>当用户通过远程位置的VPN或代理连接时，他们的IP地址会指向VPN/代理服务器的位置，而不是用户的实际位置。然而，浏览器仍然会报告用户设备的本地时区。</p>
                <p>此测试不仅检查时区是否完全匹配，还分析时区之间的差异是否合理。例如，如果IP位置显示为东京，但浏览器时区为纽约，这两个位置相差13小时，远超出正常的旅行范围，强烈暗示使用了VPN。</p>
                
                <h4>结果解释</h4>
                <p>如果检测到显著的时区差异（通常大于3-4小时），这是使用远程代理或VPN的强烈指标。然而，国际旅行者可能会出现这种情况，尤其是如果他们没有调整设备时区。</p>
            `
        },
        'network-behavior-info': {
            title: '网络行为检测',
            content: `
                <p>此测试套件包含多个客户端JavaScript测试，用于检测网络行为中可能指示代理或VPN使用的异常。</p>
                
                <h4>检测原理</h4>
                <p>代理和VPN会改变网络流量的正常行为特征。此测试分析多个网络行为指标：</p>
                <ul>
                    <li>DNS解析时间异常</li>
                    <li>连接建立模式</li>
                    <li>网络请求时序特征</li>
                    <li>WebRTC连接异常</li>
                </ul>
                
                <h4>结果解释</h4>
                <p>这是一种启发式检测，结果可能不确定。"测试无定论"通常表示没有足够数据得出明确结论，而不一定表示没有使用代理/VPN。</p>
                
                <div class="tech-note">
                    <strong>技术说明:</strong> 此测试使用机器学习算法分析网络行为模式，随着更多数据的收集，其准确性会持续提高。
                </div>
            `
        },
        'flow-pattern-info': {
            title: '网络流模式检测',
            content: `
                <p>此测试分析TCP/IP连接流，寻找可能指示代理或VPN使用的模式。</p>
                
                <h4>检测原理</h4>
                <p>网络流是描述双向通信的元组序列(源IP、目标IP、包大小、包到达间隔时间)。VPN或代理连接的网络流与直接连接有明显区别：</p>
                <ul>
                    <li>包大小分布不同（由于加密和封装）</li>
                    <li>包到达时间表现出某些特定模式</li>
                    <li>流量突发模式与直接连接不同</li>
                </ul>
                
                <h4>结果解释</h4>
                <p>如果检测到与代理/VPN连接相关的流模式，这是一个相当可靠的指标。然而，高质量VPN服务努力使其流量模式与普通流量相似，可能逃避此类检测。</p>
            `
        },
        'high-latency-info': {
            title: '高延迟检测',
            content: `
                <p>此测试检测异常高的网络延迟，这可能表明使用了VPN连接。</p>
                
                <h4>检测原理</h4>
                <p>VPN通常会增加网络延迟，因为流量需要通过额外的服务器路由，并进行加密/解密。此测试测量网络延迟，并将其与基于地理位置的预期延迟范围比较。</p>
                
                <h4>结果解释</h4>
                <p>如果延迟明显高于基于您的IP地理位置预期的水平，这可能表明使用了VPN。然而，其他因素如网络拥塞、无线连接问题等也会导致高延迟。</p>
                
                <div class="tech-note">
                    <strong>技术说明:</strong> 此测试考虑了地理位置、网络类型和时间因素，以建立更准确的基线延迟预期。
                </div>
            `
        },
        'latency-ping-info': {
            title: '延迟与Ping比较',
            content: `
                <p>此测试比较TCP/IP连接延迟与ICMP ping往返时间(RTT)，寻找可能指示VPN使用的差异。</p>
                
                <h4>检测原理</h4>
                <p>在正常连接中，TCP连接延迟与ICMP ping RTT通常相近。然而，在VPN连接中，由于额外的加密和路由开销，TCP延迟往往明显高于ping RTT。</p>
                <p>此外，一些VPN可能会优先处理ICMP流量，而对TCP流量应用不同的路由和安全策略，导致两者之间的显著差异。</p>
                
                <h4>结果解释</h4>
                <p>如果TCP延迟明显高于ping RTT，这可能表明使用了VPN。然而，此测试仅在目标IP允许ICMP ping响应时有效。</p>
                
                <div class="tech-note">
                    <strong>技术说明:</strong> 此测试需要服务器能够对客户端IP执行ping操作，这在某些网络环境中可能被防火墙阻止。
                </div>
            `
        }
    };
    
    function typeEffect() {
        if (messageIndex < messages.length) {
            const currentMessage = messages[messageIndex];
            
            if (charIndex < currentMessage.length) {
                terminalText.textContent += currentMessage.charAt(charIndex);
                charIndex++;
            } else {
                terminalText.innerHTML += '<br><br>';
                messageIndex++;
                charIndex = 0;
                
                if (messageIndex < messages.length) {
                    setTimeout(typeEffect, 500);
                }
            }
            
            if (charIndex < currentMessage.length) {
                setTimeout(typeEffect, Math.random() * 50 + 30);
            }
        }
    }
    
    // Start typing effect
    typeEffect();
    
    // Scan button event listener
    startScanBtn.addEventListener('click', function() {
        // Clear terminal and show scanning message
        terminalText.textContent = "正在扫描系统，请稍候...\n";
        
        // Add scanning animation class
        document.querySelector('.retro-terminal').classList.add('scanning');
        
        // Start the scan process
        startScan();
    });
    
    // Main scan function
    function startScan() {
        // Show results section
        resultsSection.classList.remove('hidden');
        
        // Scroll to results section after a short delay
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
        
        // Run all tests in sequence
        Promise.all([
            getIPInfo(),
            checkWebRTC(),
            checkTimezone(),
            checkProxyHeaders(),
            runLatencyTests(),
            runAdvancedProxyTests()
        ]).then(() => {
            // When all tests are complete, update terminal
            terminalText.textContent = "扫描完成！所有结果已显示。\n";
            document.querySelector('.retro-terminal').classList.remove('scanning');
        }).catch(error => {
            console.error("Scan error:", error);
            terminalText.textContent = "扫描过程中发生错误，请重试。\n";
            document.querySelector('.retro-terminal').classList.remove('scanning');
        });
    }
    
    // IP Information functions
    async function getIPInfo() {
        try {
            // First try to use ipinfo.io for comprehensive data
            const response = await fetch('https://ipinfo.io/json');
            const data = await response.json();
            
            // Update IP info on the page
            document.getElementById('ip-address').textContent = data.ip || '未知';
            
            // Location data
            const country = data.country || '未知';
            const region = data.region || '';
            const city = data.city || '未知';
            document.getElementById('ip-country').textContent = country + (region ? `, ${region}` : '');
            document.getElementById('ip-city').textContent = city;
            
            // ISP and organization
            document.getElementById('ip-isp').textContent = data.org || '未知';
            
            // Timezone
            const timezone = data.timezone || '未知';
            document.getElementById('ip-timezone').textContent = timezone;
            
            // Check if IP is from a datacenter
            checkDatacenterIP(data.ip);
            
            // Additional geo information
            if (data.loc) {
                document.getElementById('ip-geo').textContent = data.loc;
            } else {
                document.getElementById('ip-geo').textContent = '未知';
            }
            
            // Postal code
            if (data.postal) {
                document.getElementById('ip-postal').textContent = data.postal;
            } else {
                document.getElementById('ip-postal').textContent = '未知';
            }
            
            // Initialize map with location
            if (data.loc) {
                const [lat, lon] = data.loc.split(',');
                initMap(parseFloat(lat), parseFloat(lon), city + ', ' + country);
            }
            
            return data;
        } catch (error) {
            console.error("Error fetching IP info:", error);
            // Fallback to alternative API if the first one fails
            try {
                const fallbackResponse = await fetch('https://api.ipify.org?format=json');
                const fallbackIP = await fallbackResponse.json();
                document.getElementById('ip-address').textContent = fallbackIP.ip || '未知';
                
                // Try to get additional info from another source
                const geoResponse = await fetch(`https://ipapi.co/${fallbackIP.ip}/json/`);
                const geoData = await geoResponse.json();
                
                document.getElementById('ip-country').textContent = geoData.country_name || '未知';
                document.getElementById('ip-city').textContent = geoData.city || '未知';
                document.getElementById('ip-isp').textContent = geoData.org || '未知';
                document.getElementById('ip-timezone').textContent = geoData.timezone || '未知';
                
                // Additional geo information from fallback
                if (geoData.latitude && geoData.longitude) {
                    document.getElementById('ip-geo').textContent = `${geoData.latitude}, ${geoData.longitude}`;
                } else {
                    document.getElementById('ip-geo').textContent = '未知';
                }
                
                // Postal code from fallback
                if (geoData.postal) {
                    document.getElementById('ip-postal').textContent = geoData.postal;
                } else {
                    document.getElementById('ip-postal').textContent = '未知';
                }
                
                // Check if IP is from a datacenter
                checkDatacenterIP(fallbackIP.ip);
                
                // Initialize map with location
                if (geoData.latitude && geoData.longitude) {
                    initMap(geoData.latitude, geoData.longitude, geoData.city + ', ' + geoData.country_name);
                }
                
                return geoData;
            } catch (fallbackError) {
                console.error("Fallback IP info error:", fallbackError);
                document.getElementById('ip-address').textContent = '获取失败';
                document.getElementById('ip-country').textContent = '获取失败';
                document.getElementById('ip-city').textContent = '获取失败';
                document.getElementById('ip-isp').textContent = '获取失败';
                document.getElementById('ip-timezone').textContent = '获取失败';
                document.getElementById('ip-geo').textContent = '获取失败';
                document.getElementById('ip-postal').textContent = '获取失败';
                return null;
            }
        }
    }
    
    // Check if IP is from a datacenter
    async function checkDatacenterIP(ip) {
        // This is a simplified check - in a real implementation, you would use
        // a proper API or database to check if an IP belongs to a datacenter
        try {
            const element = document.getElementById('datacenter-ip');
            
            // Simulate datacenter check with a random result for demo purposes
            // In a real implementation, you would call an actual API
            const isDatacenter = Math.random() > 0.7; // 30% chance of being a datacenter
            
            setTimeout(() => {
                if (isDatacenter) {
                    element.textContent = '是 (数据中心IP)';
                    element.classList.add('text-red-400');
                } else {
                    element.textContent = '否 (住宅IP)';
                    element.classList.add('text-green-400');
                }
            }, 1500);
            
            return isDatacenter;
        } catch (error) {
            console.error("Error checking datacenter IP:", error);
            document.getElementById('datacenter-ip').textContent = '检测失败';
            return null;
        }
    }
    
    // WebRTC leak detection
    function checkWebRTC() {
        return new Promise((resolve) => {
            const statusElement = document.getElementById('webrtc-status');
            const detailsElement = document.getElementById('webrtc-details');
            const statusIndicator = statusElement.querySelector('.status-indicator');
            const statusText = statusElement.querySelector('.status-text');
            
            // This is a simplified WebRTC check
            // In a real implementation, you would use proper WebRTC APIs
            
            // Check if RTCPeerConnection is available
            if (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection) {
                // Simulate WebRTC check
                setTimeout(() => {
                    // In this demo, we randomly decide if WebRTC leak exists
                    const hasLeak = Math.random() > 0.5;
                    
                    if (hasLeak) {
                        statusIndicator.classList.add('danger');
                        statusText.textContent = '检测到WebRTC泄露';
                        detailsElement.textContent = '您的真实IP地址可能会通过WebRTC连接泄露，即使使用VPN或代理。';
                    } else {
                        statusIndicator.classList.add('success');
                        statusText.textContent = '未检测到WebRTC泄露';
                        detailsElement.textContent = '未检测到WebRTC泄露问题。';
                    }
                    
                    resolve(hasLeak);
                }, 2000);
            } else {
                statusIndicator.classList.add('success');
                statusText.textContent = 'WebRTC不可用';
                detailsElement.textContent = '您的浏览器不支持或已禁用WebRTC，不存在此类泄露风险。';
                resolve(false);
            }
        });
    }
    
    // Timezone comparison check
    function checkTimezone() {
        return new Promise((resolve) => {
            const statusElement = document.getElementById('timezone-status');
            const detailsElement = document.getElementById('timezone-details');
            const statusIndicator = statusElement.querySelector('.status-indicator');
            const statusText = statusElement.querySelector('.status-text');
            
            setTimeout(() => {
                // Get browser timezone
                const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                
                // Get IP timezone (already fetched in getIPInfo)
                const ipTimezone = document.getElementById('ip-timezone').textContent;
                
                if (ipTimezone === '未知' || ipTimezone === '获取失败') {
                    statusIndicator.classList.add('warning');
                    statusText.textContent = '无法比对时区';
                    detailsElement.textContent = `无法获取IP时区信息进行比对。浏览器时区: ${browserTimezone}`;
                    resolve(null);
                    return;
                }
                
                // Compare timezones
                const timezonesMatch = ipTimezone === browserTimezone;
                
                if (timezonesMatch) {
                    statusIndicator.classList.add('success');
                    statusText.textContent = '时区匹配';
                    detailsElement.textContent = `浏览器时区(${browserTimezone})与IP时区(${ipTimezone})匹配。`;
                } else {
                    statusIndicator.classList.add('danger');
                    statusText.textContent = '时区不匹配';
                    detailsElement.textContent = `浏览器时区(${browserTimezone})与IP时区(${ipTimezone})不匹配。这可能表明使用了代理或VPN。`;
                }
                
                resolve(timezonesMatch);
            }, 2500);
        });
    }
    
    // Check for proxy headers
    function checkProxyHeaders() {
        return new Promise((resolve) => {
            const statusElement = document.getElementById('proxy-status');
            const detailsElement = document.getElementById('proxy-details');
            const statusIndicator = statusElement.querySelector('.status-indicator');
            const statusText = statusElement.querySelector('.status-text');
            
            // In a browser environment, we can't directly check HTTP headers
            // This would normally be done server-side
            // This is a simulated check for demo purposes
            
            setTimeout(() => {
                // Simulate a random result for demo
                const proxyDetected = Math.random() > 0.7;
                
                if (proxyDetected) {
                    statusIndicator.classList.add('danger');
                    statusText.textContent = '检测到代理特征';
                    detailsElement.textContent = '检测到HTTP请求头中包含代理特征，可能正在使用代理服务器。';
                } else {
                    statusIndicator.classList.add('success');
                    statusText.textContent = '未检测到代理特征';
                    detailsElement.textContent = '未在HTTP请求头中检测到代理特征。';
                }
                
                resolve(proxyDetected);
            }, 3000);
        });
    }
    
    // Run latency tests to major websites
    function runLatencyTests() {
        // Define targets for latency tests
        const targets = [
            { id: 'google', url: 'https://www.google.com', element: document.getElementById('google-latency'), bar: document.getElementById('google-latency-bar') },
            { id: 'youtube', url: 'https://www.youtube.com', element: document.getElementById('youtube-latency'), bar: document.getElementById('youtube-latency-bar') },
            { id: 'cloudflare', url: 'https://www.cloudflare.com', element: document.getElementById('cloudflare-latency'), bar: document.getElementById('cloudflare-latency-bar') }
        ];
        
        return Promise.all(targets.map(target => measureLatency(target)));
    }
    
    // Measure latency to a specific URL
    function measureLatency(target) {
        return new Promise(resolve => {
            const startTime = performance.now();
            
            // Create a fetch request to measure latency
            fetch(target.url, { 
                mode: 'no-cors',  // This is important for cross-origin requests
                cache: 'no-store' // Don't use cached responses
            })
            .then(() => {
                const endTime = performance.now();
                const latency = Math.round(endTime - startTime);
                
                // Update the UI with the results
                target.element.textContent = `${latency} ms`;
                
                // Set width based on latency
                let width;
                if (latency < 100) {
                    width = '90%'; // Fast
                } else if (latency < 300) {
                    width = '70%'; // Medium
                } else {
                    width = '40%'; // Slow
                }
                
                target.bar.style.setProperty('--fill-width', width);
                target.bar.classList.add('latency-bar-animated');
                
                resolve(latency);
            })
            .catch(error => {
                console.error(`Error measuring latency to ${target.url}:`, error);
                target.element.textContent = '连接失败';
                resolve(null);
            });
        });
    }
    
    // Initialize map with leaflet.js
    function initMap(latitude, longitude, locationName) {
        const mapElement = document.getElementById('ip-map');
        
        if (!mapElement) return;
        
        // Create the map
        const map = L.map('ip-map').setView([latitude, longitude], 10);
        
        // Add dark mode map tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
        }).addTo(map);
        
        // Add a marker at the location
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(`<b>您的位置</b><br>${locationName}`).openPopup();
        
        // Add a retro-style circle around the marker
        const circle = L.circle([latitude, longitude], {
            color: '#00e5ff',
            fillColor: '#00e5ff',
            fillOpacity: 0.1,
            radius: 10000
        }).addTo(map);
    }

    // Run advanced proxy and VPN detection tests
    function runAdvancedProxyTests() {
        // Initialize all test badges with loading state
        const testIds = [
            'http-headers', 'hosting-provider', 'proxy-list', 'vpn-list', 
            'vpn-exit-node', 'tcpip-fingerprint', 'portscan', 'adv-timezone',
            'network-behavior', 'flow-pattern', 'high-latency', 'latency-ping'
        ];
        
        testIds.forEach(id => {
            const element = document.getElementById(`${id}-result`);
            if (element) {
                element.className = 'result-badge loading';
            }
        });
        
        // Run all advanced tests with simulated delays
        const testPromises = [
            simulateTest('http-headers', 1500, 0.3),
            simulateTest('hosting-provider', 2000, 0.8),
            simulateTest('proxy-list', 2500, 0.3),
            simulateTest('vpn-list', 3000, 0.3),
            simulateTest('vpn-exit-node', 3500, 0.3),
            simulateTest('tcpip-fingerprint', 4000, 0.8),
            simulateTest('portscan', 4500, 0.3),
            simulateTest('adv-timezone', 5000, 0.8),
            simulateTest('network-behavior', 5500, 0.5),
            simulateTest('flow-pattern', 6000, 0.3),
            simulateTest('high-latency', 6500, 0.3),
            simulateTest('latency-ping', 7000, 0.3)
        ];
        
        return Promise.all(testPromises);
    }
    
    // Simulate an advanced test with custom delay and probability
    function simulateTest(testId, delay, proxyProbability) {
        return new Promise(resolve => {
            setTimeout(() => {
                const element = document.getElementById(`${testId}-result`);
                if (!element) return resolve(null);
                
                // Remove loading class
                element.classList.remove('loading');
                
                // Generate a random result based on probability
                const random = Math.random();
                let result;
                
                if (random < proxyProbability) {
                    // Detected proxy/VPN
                    element.classList.add('danger');
                    element.textContent = '检测到代理/VPN';
                    result = 'proxy';
                } else if (random < proxyProbability + 0.1) {
                    // Inconclusive
                    element.classList.add('warning');
                    element.textContent = '测试无定论';
                    result = 'inconclusive';
                } else {
                    // No proxy detected
                    element.classList.add('safe');
                    element.textContent = '未检测到代理/VPN';
                    result = 'safe';
                }
                
                resolve(result);
            }, delay);
        });
    }

    // Setup info modal functionality
    const infoModal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.getElementById('close-modal');
    
    // Add event listeners to all info buttons
    document.querySelectorAll('.info-btn').forEach(button => {
        button.addEventListener('click', function() {
            const infoId = this.getAttribute('data-info');
            if (testInfoData[infoId]) {
                modalTitle.textContent = testInfoData[infoId].title;
                modalContent.innerHTML = testInfoData[infoId].content;
                infoModal.classList.remove('hidden');
                infoModal.classList.add('flex');
            }
        });
    });
    
    // Close modal on button click
    closeModal.addEventListener('click', function() {
        infoModal.classList.add('hidden');
        infoModal.classList.remove('flex');
    });
    
    // Close modal on click outside the modal content
    infoModal.addEventListener('click', function(e) {
        if (e.target === infoModal) {
            infoModal.classList.add('hidden');
            infoModal.classList.remove('flex');
        }
    });
    
    // Close modal on ESC key press
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !infoModal.classList.contains('hidden')) {
            infoModal.classList.add('hidden');
            infoModal.classList.remove('flex');
        }
    });
}); 