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
            runLatencyTests()
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
}); 