// ==UserScript==
// @name         页面美化助手
// @name:en      Page Beautifier
// @namespace    https://github.com/Lee-zg/qmsl
// @version      1.1.0
// @description  为网页添加暗黑模式、字体调节、广告屏蔽等美化功能
// @description:en Add dark mode, font adjustment, ad blocking and other beautification features
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
        customCSS: ''
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
    
    // 应用所有设置
    function applyAllSettings() {
        // 清除之前的样式
        const stylesToRemove = [
            'pageBeautifier-dark-style',
            'pageBeautifier-font-style', 
            'pageBeautifier-reading-style',
            'pageBeautifier-custom-style'
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
        hideAds();
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
        const button = document.createElement('button');
        button.innerHTML = '🎨';
        button.title = '页面美化设置';
        button.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 99999;
            width: 40px; height: 40px; border: none; border-radius: 50%;
            background: #007bff; color: white; font-size: 16px; cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        button.onclick = () => showSettingsPanel();
        document.body.appendChild(button);
    }
    
    // 显示设置面板
    function showSettingsPanel() {
        // 如果已存在设置面板，先移除
        const existingPanel = document.getElementById('pageBeautifierPanel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        const panel = document.createElement('div');
        panel.id = 'pageBeautifierPanel';
        panel.innerHTML = `
            <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                        background:white;padding:20px;border:1px solid #ccc;border-radius:8px;
                        z-index:100000;box-shadow:0 4px 20px rgba(0,0,0,0.3);min-width:300px;">
                <h3>页面美化设置</h3>
                <label><input type="checkbox" id="darkMode" ${config.darkMode ? 'checked' : ''}> 暗黑模式</label><br><br>
                <label>字体大小: <input type="range" id="fontSize" min="12" max="24" value="${config.fontSize}"> <span id="fontSizeValue">${config.fontSize}</span>px</label><br><br>
                <label><input type="checkbox" id="hideAds" ${config.hideAds ? 'checked' : ''}> 隐藏广告</label><br><br>
                <button id="applyBtn">应用</button>
                <button id="closeBtn">关闭</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 字体大小实时更新
        panel.querySelector('#fontSize').oninput = (e) => {
            panel.querySelector('#fontSizeValue').textContent = e.target.value;
        };
        
        // 绑定应用按钮事件
        panel.querySelector('#applyBtn').onclick = () => {
            config.darkMode = panel.querySelector('#darkMode').checked;
            config.fontSize = parseInt(panel.querySelector('#fontSize').value);
            config.hideAds = panel.querySelector('#hideAds').checked;
            
            GM_setValue('pageBeautifier_config', config);
            
            // 移除面板
            panel.remove();
            
            // 重新应用设置（不刷新页面）
            applyAllSettings();
        };
        
        // 绑定关闭按钮事件
        panel.querySelector('#closeBtn').onclick = () => {
            panel.remove();
        };
    }
    
    // 注册菜单命令
    GM_registerMenuCommand('页面美化设置', showSettingsPanel);
    
    // 初始化
    function init() {
        applyAllSettings();
        createControlButton();
        
        // 定期检查新的广告元素
        setInterval(hideAds, 3000);
    }
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();