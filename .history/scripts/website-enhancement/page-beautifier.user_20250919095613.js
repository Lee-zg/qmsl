// ==UserScript==
// @name         页面美化助手
// @name:en      Page Beautifier
// @namespace    https://github.com/Lee-zg/qmsl
// @version      2.0.0
// @description  高级页面美化工具：暗黑模式、字体调节、阅读模式、广告屏蔽、自定义CSS等功能，支持动画交互、可拖拽配置面板、网站独立设置
// @description:en Advanced page beautifier: dark mode, font adjustment, reading mode, ad blocking, custom CSS with animations, draggable panel, site-specific settings
// @author       QMSL
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @supportURL   https://github.com/Lee-zg/qmsl/issues
// @homepageURL  https://github.com/Lee-zg/qmsl
// @updateURL    https://raw.githubusercontent.com/Lee-zg/qmsl/main/scripts/website-enhancement/page-beautifier.user.js
// @downloadURL  https://raw.githubusercontent.com/Lee-zg/qmsl/main/scripts/website-enhancement/page-beautifier.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 获取当前网站域名
    const currentDomain = window.location.hostname;
    
    // 默认配置
    const DEFAULT_CONFIG = {
        darkMode: false,
        fontSize: 16,
        hideAds: true,
        readingMode: false,
        customCSS: '',
        // 新增功能配置
        blurBackground: false,
        colorScheme: 'auto',
        pageZoom: 100,
        lineHeight: 1.5,
        hideImages: false,
        focusMode: false,
        // 界面配置
        buttonVisible: true,
        buttonPosition: { x: window.innerWidth - 70, y: 20 },
        panelTheme: 'modern',
        enableAnimations: true
    };
    
    // 获取网站特定配置
    function getSiteConfig() {
        const siteKey = `pageBeautifier_${currentDomain}`;
        return GM_getValue(siteKey, DEFAULT_CONFIG);
    }
    
    // 保存网站特定配置
    function saveSiteConfig(config) {
        const siteKey = `pageBeautifier_${currentDomain}`;
        GM_setValue(siteKey, config);
    }
    
    let config = getSiteConfig();
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let animationId = null;
    
    // 应用所有设置
    function applyAllSettings() {
        // 清除之前的样式
        const stylesToRemove = [
            'pageBeautifier-dark-style',
            'pageBeautifier-font-style', 
            'pageBeautifier-reading-style',
            'pageBeautifier-custom-style',
            'pageBeautifier-blur-style',
            'pageBeautifier-zoom-style',
            'pageBeautifier-focus-style'
        ];
        
        stylesToRemove.forEach(id => {
            const style = document.getElementById(id);
            if (style) style.remove();
        });
        
        // 重新应用设置
        applyDarkMode();
        applyFontSize();
        applyReadingMode();
        applyCustomCSS();
        applyBlurBackground();
        applyColorScheme();
        applyPageZoom();
        applyLineHeight();
        applyFocusMode();
        hideAds();
        hideImages();
    }
    
    // 应用暗黑模式
    function applyDarkMode() {
        if (config.darkMode) {
            const style = document.createElement('style');
            style.id = 'pageBeautifier-dark-style';
            style.textContent = `
                html { filter: invert(1) hue-rotate(180deg) !important; }
                img, video, iframe, svg, canvas, embed, object { 
                    filter: invert(1) hue-rotate(180deg) !important; 
                }
                /* 保持控制按钮和设置面板正常显示 */
                #pageBeautifierBtn, #pageBeautifierPanel {
                    filter: invert(1) hue-rotate(180deg) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 应用字体大小
    function applyFontSize() {
        const style = document.createElement('style');
        style.id = 'pageBeautifier-font-style';
        style.textContent = `
            body, body * {
                font-size: ${config.fontSize}px !important;
                line-height: 1.5 !important;
            }
            h1 { font-size: ${config.fontSize * 2}px !important; }
            h2 { font-size: ${config.fontSize * 1.8}px !important; }
            h3 { font-size: ${config.fontSize * 1.6}px !important; }
            h4 { font-size: ${config.fontSize * 1.4}px !important; }
            h5 { font-size: ${config.fontSize * 1.2}px !important; }
            h6 { font-size: ${config.fontSize * 1.1}px !important; }
        `;
        document.head.appendChild(style);
    }
    
    // 应用阅读模式
    function applyReadingMode() {
        if (config.readingMode) {
            const style = document.createElement('style');
            style.id = 'pageBeautifier-reading-style';
            style.textContent = `
                body {
                    max-width: 800px !important;
                    margin: 0 auto !important;
                    padding: 20px !important;
                    background: #f9f9f9 !important;
                    font-family: 'Georgia', 'Times New Roman', serif !important;
                }
                article, main, .content, .post {
                    background: white !important;
                    padding: 30px !important;
                    border-radius: 8px !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                    margin-bottom: 20px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 应用自定义CSS
    function applyCustomCSS() {
        if (config.customCSS && config.customCSS.trim()) {
            const style = document.createElement('style');
            style.id = 'pageBeautifier-custom-style';
            style.textContent = config.customCSS;
            document.head.appendChild(style);
        }
    }
    
    // 新增功能：背景模糊
    function applyBlurBackground() {
        if (config.blurBackground) {
            const style = document.createElement('style');
            style.id = 'pageBeautifier-blur-style';
            style.textContent = `
                body::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backdrop-filter: blur(2px);
                    z-index: -1;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 新增功能：颜色方案
    function applyColorScheme() {
        if (config.colorScheme !== 'auto') {
            const style = document.createElement('style');
            style.id = 'pageBeautifier-color-style';
            const schemes = {
                'warm': 'sepia(0.3) hue-rotate(15deg) saturate(1.1)',
                'cool': 'hue-rotate(180deg) saturate(1.2)',
                'mono': 'grayscale(1)',
                'vintage': 'sepia(0.6) contrast(1.1) brightness(0.9)'
            };
            if (schemes[config.colorScheme]) {
                style.textContent = `
                    html {
                        filter: ${schemes[config.colorScheme]} !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }
    
    // 新增功能：页面缩放
    function applyPageZoom() {
        if (config.pageZoom !== 100) {
            const style = document.createElement('style');
            style.id = 'pageBeautifier-zoom-style';
            style.textContent = `
                body {
                    zoom: ${config.pageZoom / 100} !important;
                    transform-origin: top left !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 新增功能：行高调节
    function applyLineHeight() {
        const style = document.createElement('style');
        style.id = 'pageBeautifier-lineheight-style';
        style.textContent = `
            body, body * {
                line-height: ${config.lineHeight} !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 新增功能：隐藏图片
    function hideImages() {
        if (config.hideImages) {
            const style = document.createElement('style');
            style.id = 'pageBeautifier-hideimg-style';
            style.textContent = `
                img, video, canvas, svg, picture {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 新增功能：专注模式
    function applyFocusMode() {
        if (config.focusMode) {
            const style = document.createElement('style');
            style.id = 'pageBeautifier-focus-style';
            style.textContent = `
                body * {
                    transition: opacity 0.3s ease !important;
                }
                body *:not(:hover):not(:focus):not(:focus-within) {
                    opacity: 0.6 !important;
                }
                body *:hover, body *:focus, body *:focus-within {
                    opacity: 1 !important;
                    transform: scale(1.02) !important;
                    transition: all 0.3s ease !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 隐藏广告
    function hideAds() {
        if (config.hideAds) {
            const adSelectors = [
                '[class*="ad"]', '[class*="advertisement"]', '[id*="ad"]',
                '[class*="banner"]', '[class*="popup"]', '[class*="modal"]',
                '.google-ads', '.adsense', '.ad-container', '.advertisement',
                'iframe[src*="googleadservices"]', 'iframe[src*="googlesyndication"]'
            ];
            
            adSelectors.forEach(selector => {
                try {
                    document.querySelectorAll(selector).forEach(el => {
                        // 保持我们的控件不被隐藏
                        if (!el.id || (!el.id.includes('pageBeautifier'))) {
                            el.style.display = 'none';
                        }
                    });
                } catch (e) {
                    // 忽略无效选择器错误
                }
            });
        }
    }
    
    // 添加防干扰样式
    function addProtectionStyles() {
        const protectionStyle = document.createElement('style');
        protectionStyle.id = 'pageBeautifier-protection';
        protectionStyle.textContent = `
            /* 确保控制按钮和面板不受影响 */
            #pageBeautifierBtn {
                all: initial !important;
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                z-index: 2147483647 !important;
                width: 50px !important;
                height: 50px !important;
                border: none !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                font-size: 20px !important;
                cursor: pointer !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
                transition: all 0.3s ease !important;
                font-family: Arial, sans-serif !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                user-select: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
            }
            
            #pageBeautifierBtn:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important;
            }
            
            #pageBeautifierPanel {
                all: initial !important;
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                z-index: 2147483647 !important;
                background: white !important;
                padding: 0 !important;
                border: none !important;
                border-radius: 12px !important;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
                min-width: 400px !important;
                max-width: 90vw !important;
                max-height: 90vh !important;
                overflow: auto !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            
            #pageBeautifierPanel * {
                box-sizing: border-box !important;
            }
        `;
        document.head.appendChild(protectionStyle);
    }
    
    // 创建控制按钮
    function createControlButton() {
        // 防止重复创建
        if (document.getElementById('pageBeautifierBtn')) {
            return;
        }
        
        const button = document.createElement('button');
        button.id = 'pageBeautifierBtn';
        button.innerHTML = '🎨';
        button.title = `页面美化设置 - 当前网站: ${currentDomain}`;
        
        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            showSettingsPanel();
        };
        
        document.body.appendChild(button);
    }
    
    // 显示设置面板
    function showSettingsPanel() {
        // 如果已存在设置面板，先移除
        const existingPanel = document.getElementById('pageBeautifierPanel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }
        
        const panel = document.createElement('div');
        panel.id = 'pageBeautifierPanel';
        
        panel.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 12px 12px 0 0;
                text-align: center;
                position: relative;
            ">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">页面美化设置</h3>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 5px;">当前网站: ${currentDomain}</div>
                <button id="closeBtn" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            </div>
            
            <div style="padding: 25px; background: white;">
                <!-- 暗黑模式 -->
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 500;
                        color: #333;
                        cursor: pointer;
                    ">
                        <input type="checkbox" id="darkMode" ${config.darkMode ? 'checked' : ''} style="
                            margin-right: 10px;
                            transform: scale(1.2);
                        ">
                        <span style="flex: 1;">🌙 暗黑模式</span>
                    </label>
                </div>
                
                <!-- 字体大小 -->
                <div style="margin-bottom: 20px;">
                    <label style="font-size: 14px; font-weight: 500; color: #333; display: block; margin-bottom: 8px;">
                        🅰️ 字体大小: <span id="fontSizeValue">${config.fontSize}</span>px
                    </label>
                    <input type="range" id="fontSize" min="10" max="30" value="${config.fontSize}" style="
                        width: 100%;
                        height: 6px;
                        border-radius: 3px;
                        background: #ddd;
                        outline: none;
                        cursor: pointer;
                    ">
                </div>
                
                <!-- 阅读模式 -->
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 500;
                        color: #333;
                        cursor: pointer;
                    ">
                        <input type="checkbox" id="readingMode" ${config.readingMode ? 'checked' : ''} style="
                            margin-right: 10px;
                            transform: scale(1.2);
                        ">
                        <span style="flex: 1;">📚 阅读模式</span>
                    </label>
                </div>
                
                <!-- 隐藏广告 -->
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 500;
                        color: #333;
                        cursor: pointer;
                    ">
                        <input type="checkbox" id="hideAds" ${config.hideAds ? 'checked' : ''} style="
                            margin-right: 10px;
                            transform: scale(1.2);
                        ">
                        <span style="flex: 1;">🚫 隐藏广告</span>
                    </label>
                </div>
                
                <!-- 自定义CSS -->
                <div style="margin-bottom: 25px;">
                    <label style="font-size: 14px; font-weight: 500; color: #333; display: block; margin-bottom: 8px;">
                        ⚙️ 自定义CSS
                    </label>
                    <textarea id="customCSS" placeholder="输入自定义CSS代码..." style="
                        width: 100%;
                        height: 80px;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        font-size: 12px;
                        resize: vertical;
                        outline: none;
                    ">${config.customCSS || ''}</textarea>
                </div>
                
                <!-- 按钮组 -->
                <div style="display: flex; gap: 10px;">
                    <button id="applyBtn" style="
                        flex: 1;
                        padding: 12px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">✅ 应用设置</button>
                    
                    <button id="resetBtn" style="
                        flex: 1;
                        padding: 12px;
                        background: #f44336;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">🔄 重置</button>
                    
                    <button id="exportBtn" style="
                        padding: 12px 16px;
                        background: #4caf50;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">📤 导出</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 绑定事件
        bindPanelEvents(panel);
    }
    
    // 绑定面板事件
    function bindPanelEvents(panel) {
        // 字体大小实时更新
        panel.querySelector('#fontSize').oninput = (e) => {
            panel.querySelector('#fontSizeValue').textContent = e.target.value;
        };
        
        // 关闭按钮
        panel.querySelector('#closeBtn').onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            panel.remove();
        };
        
        // 应用设置
        panel.querySelector('#applyBtn').onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 更新配置
            config.darkMode = panel.querySelector('#darkMode').checked;
            config.fontSize = parseInt(panel.querySelector('#fontSize').value);
            config.readingMode = panel.querySelector('#readingMode').checked;
            config.hideAds = panel.querySelector('#hideAds').checked;
            config.customCSS = panel.querySelector('#customCSS').value;
            
            // 保存配置
            saveSiteConfig(config);
            
            // 显示成功提示
            showNotification('✅ 设置已应用', 'success');
            
            // 移除面板
            panel.remove();
            
            // 重新应用设置
            applyAllSettings();
        };
        
        // 重置设置
        panel.querySelector('#resetBtn').onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (confirm('确定要重置当前网站的所有设置吗？')) {
                // 重置为默认配置
                config = { ...DEFAULT_CONFIG };
                saveSiteConfig(config);
                
                // 显示成功提示
                showNotification('✅ 设置已重置', 'success');
                
                // 移除面板
                panel.remove();
                
                // 重新应用设置
                applyAllSettings();
            }
        };
        
        // 导出设置
        panel.querySelector('#exportBtn').onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const exportData = {
                domain: currentDomain,
                config: config,
                timestamp: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `pageBeautifier_${currentDomain}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('📤 设置已导出', 'success');
        };
        
        // 面板点击事件
        panel.onclick = (e) => {
            e.stopPropagation();
        };
        
        // 点击面板外部关闭
        document.addEventListener('click', function closePanel(e) {
            if (!panel.contains(e.target)) {
                panel.remove();
                document.removeEventListener('click', closePanel);
            }
        });
    }
    
    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 2147483647;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 动画显示
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 3秒后隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 注册菜单命令
    GM_registerMenuCommand('页面美化设置', showSettingsPanel);
    
    // 初始化
    function init() {
        console.log('🎨 页面美化助手已启动', `当前网站: ${currentDomain}`);
        
        // 添加防干扰样式
        addProtectionStyles();
        
        // 应用设置
        applyAllSettings();
        
        // 创建控制按钮
        createControlButton();
        
        // 定期检查新的广告元素
        setInterval(hideAds, 5000);
        
        // 监听页面变化
        const observer = new MutationObserver((mutations) => {
            let needRecheck = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    needRecheck = true;
                }
            });
            
            if (needRecheck) {
                setTimeout(() => {
                    hideAds();
                    // 确保按钮仍然存在
                    if (!document.getElementById('pageBeautifierBtn')) {
                        createControlButton();
                    }
                }, 1000);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();