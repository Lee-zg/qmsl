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
            /* 动画关键帧 */
            @keyframes pageBeautifierFadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pageBeautifierSlideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            
            @keyframes pageBeautifierPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes pageBeautifierShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
            
            /* 控制按钮样式 */
            #pageBeautifierBtn {
                all: initial !important;
                position: fixed !important;
                top: ${config.buttonPosition.y}px !important;
                right: ${window.innerWidth - config.buttonPosition.x - 50}px !important;
                z-index: 2147483647 !important;
                width: 50px !important;
                height: 50px !important;
                border: none !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                font-size: 20px !important;
                cursor: pointer !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                font-family: Arial, sans-serif !important;
                display: ${config.buttonVisible ? 'flex' : 'none'} !important;
                align-items: center !important;
                justify-content: center !important;
                user-select: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                animation: ${config.enableAnimations ? 'pageBeautifierFadeIn 0.5s ease-out' : 'none'} !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
            }
            
            #pageBeautifierBtn:hover {
                transform: scale(1.1) rotate(5deg) !important;
                box-shadow: 0 8px 30px rgba(0,0,0,0.4) !important;
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
                animation: ${config.enableAnimations ? 'pageBeautifierPulse 1s infinite' : 'none'} !important;
            }
            
            #pageBeautifierBtn:active {
                transform: scale(0.95) !important;
                animation: ${config.enableAnimations ? 'pageBeautifierShake 0.5s ease-in-out' : 'none'} !important;
            }
            
            #pageBeautifierBtn.dragging {
                cursor: grabbing !important;
                transform: scale(1.1) !important;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
                z-index: 2147483648 !important;
            }
            
            /* 设置面板样式 */
            #pageBeautifierPanel {
                all: initial !important;
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                z-index: 2147483647 !important;
                background: rgba(255,255,255,0.95) !important;
                padding: 0 !important;
                border: none !important;
                border-radius: 20px !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
                min-width: 450px !important;
                max-width: 90vw !important;
                max-height: 90vh !important;
                overflow: hidden !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                animation: ${config.enableAnimations ? 'pageBeautifierFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'} !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
            }
            
            #pageBeautifierPanel.draggable {
                cursor: grab !important;
            }
            
            #pageBeautifierPanel.dragging {
                cursor: grabbing !important;
                transform: translate(-50%, -50%) scale(1.05) !important;
                box-shadow: 0 30px 80px rgba(0,0,0,0.4) !important;
            }
            
            #pageBeautifierPanel * {
                box-sizing: border-box !important;
            }
            
            /* 面板头部 */
            #pageBeautifierPanel .panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                padding: 20px !important;
                border-radius: 20px 20px 0 0 !important;
                text-align: center !important;
                position: relative !important;
                cursor: grab !important;
            }
            
            #pageBeautifierPanel .panel-header.dragging {
                cursor: grabbing !important;
            }
            
            /* 无障碍支持 */
            @media (prefers-reduced-motion: reduce) {
                #pageBeautifierBtn, #pageBeautifierPanel {
                    animation: none !important;
                    transition: none !important;
                }
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
        button.title = `页面美化设置 v2.0 - 当前网站: ${currentDomain}`;
        
        // 点击事件
        button.onclick = (e) => {
            if (!isDragging) {
                e.preventDefault();
                e.stopPropagation();
                showSettingsPanel();
            }
        };
        
        // 右键菜单：快速切换显示/隐藏
        button.oncontextmenu = (e) => {
            e.preventDefault();
            toggleButtonVisibility();
        };
        
        // 添加拖拽功能
        addDragFunctionality(button);
        
        document.body.appendChild(button);
        
        // 添加悬浮提示
        setTimeout(() => {
            if (config.enableAnimations) {
                button.style.animation = 'pageBeautifierPulse 2s ease-in-out 3';
            }
        }, 1000);
    }
    
    // 添加拖拽功能
    function addDragFunctionality(element) {
        let startX, startY, initialX, initialY;
        
        element.addEventListener('mousedown', initDrag);
        element.addEventListener('touchstart', initDrag, { passive: false });
        
        function initDrag(e) {
            if (e.button === 2) return; // 右键不拖拽
            
            e.preventDefault();
            isDragging = false;
            
            const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
            
            startX = clientX;
            startY = clientY;
            initialX = config.buttonPosition.x;
            initialY = config.buttonPosition.y;
            
            document.addEventListener('mousemove', performDrag);
            document.addEventListener('touchmove', performDrag, { passive: false });
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
        }
        
        function performDrag(e) {
            e.preventDefault();
            
            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
            
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            
            // 检测是否开始拖拽
            if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
                isDragging = true;
                element.classList.add('dragging');
                document.body.style.userSelect = 'none';
            }
            
            if (isDragging) {
                const newX = Math.max(0, Math.min(window.innerWidth - 50, initialX + deltaX));
                const newY = Math.max(0, Math.min(window.innerHeight - 50, initialY + deltaY));
                
                config.buttonPosition.x = newX;
                config.buttonPosition.y = newY;
                
                element.style.left = newX + 'px';
                element.style.top = newY + 'px';
                element.style.right = 'auto';
            }
        }
        
        function endDrag() {
            document.removeEventListener('mousemove', performDrag);
            document.removeEventListener('touchmove', performDrag);
            document.removeEventListener('mouseup', endDrag);
            document.removeEventListener('touchend', endDrag);
            
            if (isDragging) {
                element.classList.remove('dragging');
                document.body.style.userSelect = '';
                saveSiteConfig(config);
                
                // 拖拽结束后的动画
                if (config.enableAnimations) {
                    element.style.animation = 'pageBeautifierPulse 0.3s ease-out';
                }
            }
            
            // 延迟重置拖拽状态
            setTimeout(() => {
                isDragging = false;
            }, 100);
        }
    }
    
    // 切换按钮显示/隐藏
    function toggleButtonVisibility() {
        config.buttonVisible = !config.buttonVisible;
        saveSiteConfig(config);
        
        const button = document.getElementById('pageBeautifierBtn');
        if (button) {
            if (config.buttonVisible) {
                button.style.display = 'flex';
                button.style.animation = config.enableAnimations ? 'pageBeautifierFadeIn 0.5s ease-out' : 'none';
            } else {
                button.style.animation = config.enableAnimations ? 'pageBeautifierSlideIn reverse 0.3s ease-out' : 'none';
                setTimeout(() => {
                    button.style.display = 'none';
                }, 300);
            }
        }
        
        // 隐藏时显示提示
        if (!config.buttonVisible) {
            showNotification('👁️ 按钮Alt+B可重新显示控制按钮', 'info', 5000);
        }
    }
    
    // 显示设置面板
    function showSettingsPanel() {
        // 如果已存在设置面板，先移除
        const existingPanel = document.getElementById('pageBeautifierPanel');
        if (existingPanel) {
            if (config.enableAnimations) {
                existingPanel.style.animation = 'pageBeautifierSlideIn reverse 0.3s ease-out';
                setTimeout(() => existingPanel.remove(), 300);
            } else {
                existingPanel.remove();
            }
            return;
        }
        
        const panel = document.createElement('div');
        panel.id = 'pageBeautifierPanel';
        panel.className = 'draggable';
        
        panel.innerHTML = `
            <div class="panel-header" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 20px 20px 0 0;
                text-align: center;
                position: relative;
                cursor: grab;
            ">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">🎨 页面美化助手 v2.0</h3>
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
                    transition: all 0.3s ease;
                ">×</button>
            </div>
            
            <div style="padding: 25px; background: rgba(255,255,255,0.95); border-radius: 0 0 20px 20px; max-height: 70vh; overflow-y: auto;">
                <!-- 基础功能 -->
                <div class="feature-group" style="margin-bottom: 25px;">
                    <h4 style="color: #333; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">🌌 基础功能</h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <label class="feature-toggle">
                            <input type="checkbox" id="darkMode" ${config.darkMode ? 'checked' : ''}>
                            <span>🌙 暗黑模式</span>
                        </label>
                        <label class="feature-toggle">
                            <input type="checkbox" id="readingMode" ${config.readingMode ? 'checked' : ''}>
                            <span>📚 阅读模式</span>
                        </label>
                        <label class="feature-toggle">
                            <input type="checkbox" id="hideAds" ${config.hideAds ? 'checked' : ''}>
                            <span>🚫 隐藏广告</span>
                        </label>
                        <label class="feature-toggle">
                            <input type="checkbox" id="hideImages" ${config.hideImages ? 'checked' : ''}>
                            <span>🖼️ 隐藏图片</span>
                        </label>
                    </div>
                </div>
                
                <!-- 高级功能 -->
                <div class="feature-group" style="margin-bottom: 25px;">
                    <h4 style="color: #333; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #764ba2; padding-bottom: 5px;">✨ 高级功能</h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <label class="feature-toggle">
                            <input type="checkbox" id="blurBackground" ${config.blurBackground ? 'checked' : ''}>
                            <span>🌫️ 背景模糊</span>
                        </label>
                        <label class="feature-toggle">
                            <input type="checkbox" id="focusMode" ${config.focusMode ? 'checked' : ''}>
                            <span>🎯 专注模式</span>
                        </label>
                        <label class="feature-toggle">
                            <input type="checkbox" id="enableAnimations" ${config.enableAnimations ? 'checked' : ''}>
                            <span>🎨 动画效果</span>
                        </label>
                        <label class="feature-toggle">
                            <input type="checkbox" id="buttonVisible" ${config.buttonVisible ? 'checked' : ''}>
                            <span>👁️ 显示按钮</span>
                        </label>
                    </div>
                </div>
                
                <!-- 数值调节 -->
                <div class="feature-group" style="margin-bottom: 25px;">
                    <h4 style="color: #333; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">📏 数值调节</h4>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="font-size: 14px; font-weight: 500; color: #333; display: block; margin-bottom: 8px;">
                            🅰️ 字体大小: <span id="fontSizeValue">${config.fontSize}</span>px
                        </label>
                        <input type="range" id="fontSize" min="10" max="30" value="${config.fontSize}" class="custom-range">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="font-size: 14px; font-weight: 500; color: #333; display: block; margin-bottom: 8px;">
                            📊 页面缩放: <span id="pageZoomValue">${config.pageZoom}</span>%
                        </label>
                        <input type="range" id="pageZoom" min="50" max="200" value="${config.pageZoom}" class="custom-range">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="font-size: 14px; font-weight: 500; color: #333; display: block; margin-bottom: 8px;">
                            📜 行高: <span id="lineHeightValue">${config.lineHeight}</span>
                        </label>
                        <input type="range" id="lineHeight" min="1" max="3" step="0.1" value="${config.lineHeight}" class="custom-range">
                    </div>
                </div>
                
                <!-- 颜色方案 -->
                <div class="feature-group" style="margin-bottom: 25px;">
                    <h4 style="color: #333; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #764ba2; padding-bottom: 5px;">🎨 颜色方案</h4>
                    <select id="colorScheme" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;">
                        <option value="auto" ${config.colorScheme === 'auto' ? 'selected' : ''}>自动</option>
                        <option value="warm" ${config.colorScheme === 'warm' ? 'selected' : ''}>暖色调</option>
                        <option value="cool" ${config.colorScheme === 'cool' ? 'selected' : ''}>冷色调</option>
                        <option value="mono" ${config.colorScheme === 'mono' ? 'selected' : ''}>黑白</option>
                        <option value="vintage" ${config.colorScheme === 'vintage' ? 'selected' : ''}>复古</option>
                    </select>
                </div>
                
                <!-- 自定义CSS -->
                <div class="feature-group" style="margin-bottom: 25px;">
                    <h4 style="color: #333; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #667eea; padding-bottom: 5px;">⚙️ 自定义CSS</h4>
                    <textarea id="customCSS" placeholder="输入自定义CSS代码..." style="
                        width: 100%;
                        height: 100px;
                        padding: 12px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                        font-size: 12px;
                        resize: vertical;
                        outline: none;
                        transition: border-color 0.3s ease;
                    ">${config.customCSS || ''}</textarea>
                </div>
                
                <!-- 按钮组 -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-top: 20px;">
                    <button id="applyBtn" class="action-btn primary">✅ 应用</button>
                    <button id="resetBtn" class="action-btn danger">🔄 重置</button>
                    <button id="exportBtn" class="action-btn success">📤 导出</button>
                    <button id="importBtn" class="action-btn info">📥 导入</button>
                </div>
            </div>
        `;
        
        // 添加内联样式
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .feature-toggle {
                display: flex;
                align-items: center;
                font-size: 14px;
                font-weight: 500;
                color: #333;
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                transition: background-color 0.3s ease;
            }
            
            .feature-toggle:hover {
                background-color: rgba(102, 126, 234, 0.1);
            }
            
            .feature-toggle input[type="checkbox"] {
                margin-right: 10px;
                transform: scale(1.2);
                cursor: pointer;
            }
            
            .custom-range {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: #ddd;
                outline: none;
                cursor: pointer;
                -webkit-appearance: none;
                appearance: none;
            }
            
            .custom-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            }
            
            .custom-range::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            }
            
            .action-btn {
                padding: 12px 8px;
                border: none;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .action-btn.primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .action-btn.danger {
                background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
                color: white;
            }
            
            .action-btn.success {
                background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
                color: white;
            }
            
            .action-btn.info {
                background: linear-gradient(135deg, #2196f3 0%, #03a9f4 100%);
                color: white;
            }
            
            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            .action-btn:active {
                transform: translateY(0);
            }
        `;
        panel.appendChild(styleElement);
        
        document.body.appendChild(panel);
        
        // 添加面板拖拽功能
        addPanelDragFunctionality(panel);
        
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