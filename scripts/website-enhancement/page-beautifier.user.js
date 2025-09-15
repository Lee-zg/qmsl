// ==UserScript==
// @name         页面美化助手
// @name:en      Page Beautifier
// @namespace    https://github.com/Lee-zg/qmsl
// @version      1.0.0
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
    
    // 默认配置
    const DEFAULT_CONFIG = {
        darkMode: false,
        fontSize: 16,
        hideAds: true,
        readingMode: false
    };
    
    let config = GM_getValue('pageBeautifier_config', DEFAULT_CONFIG);
    
    // 应用所有设置
    function applyAllSettings() {
        // 清除之前的样式
        const existingDarkStyle = document.getElementById('pageBeautifier-dark-style');
        const existingFontStyle = document.getElementById('pageBeautifier-font-style');
        
        if (existingDarkStyle) existingDarkStyle.remove();
        if (existingFontStyle) existingFontStyle.remove();
        
        // 重新应用设置
        applyDarkMode();
        applyFontSize();
        hideAds();
    }
    
    // 应用暗黑模式
    function applyDarkMode() {
        if (config.darkMode) {
            const style = document.createElement('style');
            style.id = 'pageBeautifier-dark-style';
            style.textContent = `
                html { filter: invert(1) hue-rotate(180deg) !important; }
                img, video, iframe, svg { filter: invert(1) hue-rotate(180deg) !important; }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 应用字体大小
    function applyFontSize() {
        const style = document.createElement('style');
        style.id = 'pageBeautifier-font-style';
        style.textContent = `* { font-size: ${config.fontSize}px !important; }`;
        document.head.appendChild(style);
    }
    
    // 隐藏广告
    function hideAds() {
        if (config.hideAds) {
            const adSelectors = '[class*="ad"], [class*="advertisement"], [id*="ad"]';
            document.querySelectorAll(adSelectors).forEach(el => {
                el.style.display = 'none';
            });
        }
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