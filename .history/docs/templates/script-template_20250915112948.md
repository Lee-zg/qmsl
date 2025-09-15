# 脚本模板

## 基础模板

```javascript
// ==UserScript==
// @name         脚本名称
// @name:en      Script Name
// @namespace    https://github.com/yourusername/qmsl
// @version      1.0.0
// @description  脚本功能描述
// @description:en Script description
// @author       你的名字
// @match        https://example.com/*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/yourusername/qmsl/issues
// @homepageURL  https://github.com/yourusername/qmsl
// @updateURL    https://raw.githubusercontent.com/yourusername/qmsl/main/scripts/category/script-name.user.js
// @downloadURL  https://raw.githubusercontent.com/yourusername/qmsl/main/scripts/category/script-name.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置选项
    const CONFIG = {
        debug: false,
        version: '1.0.0'
    };
    
    // 日志工具
    function log(...args) {
        if (CONFIG.debug) {
            console.log('[脚本名称]', ...args);
        }
    }
    
    // 主要功能
    function main() {
        log('脚本已启动');
        
        try {
            // 在这里实现主要功能
            
        } catch (error) {
            console.error('[脚本名称] 错误:', error);
        }
    }
    
    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    }
    
    // 启动脚本
    init();
})();
```

## 带权限的模板

```javascript
// ==UserScript==
// @name         高级脚本名称
// @namespace    https://github.com/yourusername/qmsl
// @version      1.0.0
// @description  高级功能脚本
// @author       你的名字
// @match        https://example.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置管理
    const CONFIG = {
        storageKey: 'scriptName_config',
        defaultSettings: {
            enabled: true,
            theme: 'light',
            autoRun: true
        }
    };
    
    // 存储工具
    const Storage = {
        get: (key, defaultValue) => {
            try {
                const value = GM_getValue(key, defaultValue);
                return typeof value === 'string' ? JSON.parse(value) : value;
            } catch {
                return defaultValue;
            }
        },
        
        set: (key, value) => {
            GM_setValue(key, typeof value === 'object' ? JSON.stringify(value) : value);
        }
    };
    
    // 样式管理
    function addStyle(css) {
        GM_addStyle(css);
    }
    
    // 网络请求
    function request(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                onload: resolve,
                onerror: reject
            });
        });
    }
    
    // 通知
    function notify(message, options = {}) {
        GM_notification({
            text: message,
            title: '脚本名称',
            timeout: 3000,
            ...options
        });
    }
    
    // 主要功能
    function main() {
        const settings = Storage.get(CONFIG.storageKey, CONFIG.defaultSettings);
        
        if (!settings.enabled) return;
        
        // 添加样式
        addStyle(`
            .script-element {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
            }
        `);
        
        // 实现功能...
    }
    
    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main);
        } else {
            main();
        }
    }
    
    init();
})();
```

## 设置面板模板

```javascript
// ==UserScript==
// @name         带设置面板的脚本
// @namespace    https://github.com/yourusername/qmsl
// @version      1.0.0
// @description  包含设置面板的脚本模板
// @author       你的名字
// @match        https://example.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    // 默认配置
    const DEFAULT_CONFIG = {
        enabled: true,
        theme: 'dark',
        position: 'top-right',
        autoHide: false
    };
    
    // 配置管理
    let config = GM_getValue('config', DEFAULT_CONFIG);
    
    // 保存配置
    function saveConfig() {
        GM_setValue('config', config);
    }
    
    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'script-settings-panel';
        panel.innerHTML = `
            <div class="settings-header">
                <h3>脚本设置</h3>
                <button id="close-settings">×</button>
            </div>
            <div class="settings-content">
                <label>
                    <input type="checkbox" id="enabled" ${config.enabled ? 'checked' : ''}>
                    启用脚本
                </label>
                
                <label>
                    主题:
                    <select id="theme">
                        <option value="light" ${config.theme === 'light' ? 'selected' : ''}>浅色</option>
                        <option value="dark" ${config.theme === 'dark' ? 'selected' : ''}>深色</option>
                    </select>
                </label>
                
                <label>
                    位置:
                    <select id="position">
                        <option value="top-left" ${config.position === 'top-left' ? 'selected' : ''}>左上</option>
                        <option value="top-right" ${config.position === 'top-right' ? 'selected' : ''}>右上</option>
                        <option value="bottom-left" ${config.position === 'bottom-left' ? 'selected' : ''}>左下</option>
                        <option value="bottom-right" ${config.position === 'bottom-right' ? 'selected' : ''}>右下</option>
                    </select>
                </label>
                
                <button id="save-settings">保存设置</button>
                <button id="reset-settings">重置</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // 绑定事件
        document.getElementById('close-settings').onclick = () => panel.remove();
        document.getElementById('save-settings').onclick = saveSettings;
        document.getElementById('reset-settings').onclick = resetSettings;
    }
    
    // 保存设置
    function saveSettings() {
        config.enabled = document.getElementById('enabled').checked;
        config.theme = document.getElementById('theme').value;
        config.position = document.getElementById('position').value;
        
        saveConfig();
        document.getElementById('script-settings-panel').remove();
        
        // 重新初始化
        main();
    }
    
    // 重置设置
    function resetSettings() {
        config = { ...DEFAULT_CONFIG };
        saveConfig();
        document.getElementById('script-settings-panel').remove();
        createSettingsPanel();
    }
    
    // 添加样式
    GM_addStyle(`
        #script-settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            min-width: 300px;
        }
        
        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        
        .settings-content label {
            display: block;
            margin-bottom: 10px;
        }
        
        .settings-content input,
        .settings-content select {
            margin-left: 10px;
        }
        
        .settings-content button {
            margin-right: 10px;
            margin-top: 15px;
            padding: 5px 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
        }
        
        #close-settings {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
        }
    `);
    
    // 注册菜单命令
    GM_registerMenuCommand('设置', createSettingsPanel);
    
    // 主要功能
    function main() {
        if (!config.enabled) return;
        
        console.log('脚本已启动，当前配置:', config);
        
        // 根据配置实现功能...
    }
    
    // 初始化
    main();
})();
```

## README模板

```markdown
# 脚本分类名称

简要描述这个分类下的脚本功能和用途。

## 脚本列表

### 脚本名称

**功能描述**：详细描述脚本的主要功能和特点

**适用网站**：
- https://example1.com - 网站1描述
- https://example2.com - 网站2描述

**主要功能**：
- 功能1：具体描述
- 功能2：具体描述
- 功能3：具体描述

**安装方法**：
1. 点击 [安装链接](https://raw.githubusercontent.com/yourusername/qmsl/main/scripts/category/script-name.user.js)
2. 确认安装
3. 访问目标网站即可使用

**使用说明**：
1. 脚本会自动在页面加载时运行
2. 可以通过右键菜单或快捷键来调用功能
3. 设置选项可在脚本管理器中找到

**配置选项**：
- 选项1：说明
- 选项2：说明

**注意事项**：
- 重要提醒1
- 重要提醒2

**更新日志**：
- v1.0.0 (2025-01-01): 初始版本
  - 实现基础功能
  - 添加设置面板

**截图预览**：
![预览图](images/screenshot.png)

**问题反馈**：
如果遇到问题，请在 [Issues](https://github.com/yourusername/qmsl/issues) 中反馈。

---

## 开发说明

**技术特点**：
- 使用了XX技术
- 兼容XX浏览器
- 性能优化点

**API依赖**：
- 依赖的外部API（如有）

**权限说明**：
- `GM_setValue/GM_getValue`: 用于保存用户设置
- `GM_addStyle`: 用于注入样式
- `GM_xmlhttpRequest`: 用于网络请求（如需要）
```