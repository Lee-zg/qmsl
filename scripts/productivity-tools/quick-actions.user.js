// ==UserScript==
// @name         快捷操作增强
// @name:en      Quick Actions Enhancer
// @namespace    https://github.com/yourusername/qmsl
// @version      1.0.0
// @description  为网页添加快捷键、批量操作等效率功能
// @description:en Add hotkeys, batch operations and other efficiency features to web pages
// @author       QMSL
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @supportURL   https://github.com/yourusername/qmsl/issues
// @homepageURL  https://github.com/yourusername/qmsl
// @updateURL    https://raw.githubusercontent.com/yourusername/qmsl/main/scripts/productivity-tools/quick-actions.user.js
// @downloadURL  https://raw.githubusercontent.com/yourusername/qmsl/main/scripts/productivity-tools/quick-actions.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 快捷键配置
    const HOTKEYS = {
        'ctrl+shift+q': () => showQuickPanel(),
        'ctrl+shift+a': () => selectAllVisible(),
        'ctrl+shift+c': () => copyAllText(),
        'ctrl+shift+t': () => scrollToTop()
    };
    
    // 显示快捷面板
    function showQuickPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                        background:white;padding:20px;border:1px solid #ccc;border-radius:8px;
                        z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
                <h3>快捷操作面板</h3>
                <p>Ctrl+Shift+A: 选择所有可见元素</p>
                <p>Ctrl+Shift+C: 复制页面文本</p>
                <p>Ctrl+Shift+T: 回到顶部</p>
                <button onclick="this.parentElement.remove()">关闭</button>
            </div>
        `;
        document.body.appendChild(panel);
    }
    
    // 绑定快捷键
    document.addEventListener('keydown', (e) => {
        const key = [];
        if (e.ctrlKey) key.push('ctrl');
        if (e.shiftKey) key.push('shift');
        if (e.altKey) key.push('alt');
        key.push(e.key.toLowerCase());
        
        const hotkey = key.join('+');
        if (HOTKEYS[hotkey]) {
            e.preventDefault();
            HOTKEYS[hotkey]();
        }
    });
    
    // 工具函数
    function selectAllVisible() {
        const elements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6');
        elements.forEach(el => el.style.backgroundColor = '#ffff00');
        setTimeout(() => elements.forEach(el => el.style.backgroundColor = ''), 2000);
    }
    
    function copyAllText() {
        const text = document.body.innerText;
        navigator.clipboard.writeText(text).then(() => {
            alert('页面文本已复制到剪贴板');
        });
    }
    
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    console.log('快捷操作增强已启动');
})();