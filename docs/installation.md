# 安装指南

## 油猴脚本管理器安装

### Tampermonkey（推荐）

1. **Chrome浏览器**
   - 访问 [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - 点击"添加至Chrome"

2. **Firefox浏览器**
   - 访问 [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - 点击"添加到Firefox"

3. **Edge浏览器**
   - 访问 [Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
   - 点击"获取"

### Greasemonkey（Firefox）

1. 访问 [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
2. 点击"添加到Firefox"

## 脚本安装方法

### 方法一：直接安装（推荐）

1. 点击脚本列表中的"安装"链接
2. 油猴脚本管理器会自动打开安装页面
3. 点击"安装"按钮完成安装

### 方法二：手动安装

1. 复制脚本的完整代码
2. 打开Tampermonkey管理页面
3. 点击"添加新脚本"
4. 粘贴代码并保存

### 方法三：本地文件安装

1. 下载脚本文件到本地
2. 在Tampermonkey中选择"从文件安装"
3. 选择下载的脚本文件

## 脚本管理

### 启用/禁用脚本

1. 点击浏览器工具栏中的Tampermonkey图标
2. 在弹出菜单中找到对应脚本
3. 点击脚本名称前的开关进行启用/禁用

### 查看脚本设置

1. 打开Tampermonkey管理页面
2. 找到对应脚本，点击"编辑"
3. 在"设置"标签页中可以修改脚本配置

### 更新脚本

脚本会自动检查更新，也可以手动更新：

1. 打开Tampermonkey管理页面
2. 点击"检查更新"按钮
3. 有更新的脚本会显示"更新"按钮

## 常见问题

### Q: 脚本无法正常工作？

**A:** 检查以下几点：
- 确认脚本已启用
- 检查网站URL是否匹配脚本的`@match`规则
- 清除浏览器缓存后重试
- 查看浏览器控制台是否有错误信息

### Q: 如何卸载脚本？

**A:** 
1. 打开Tampermonkey管理页面
2. 找到要卸载的脚本
3. 点击垃圾桶图标删除

### Q: 脚本冲突怎么办？

**A:**
- 临时禁用其他脚本，逐个测试找出冲突源
- 检查脚本的运行时机设置
- 查看脚本是否修改了相同的页面元素

### Q: 如何备份脚本？

**A:**
1. 打开Tampermonkey管理页面
2. 点击"实用工具"标签
3. 选择"导出"功能备份所有脚本

## 安全提醒

⚠️ **重要提醒**：
- 只安装来自可信来源的脚本
- 安装前检查脚本权限和功能
- 定期检查已安装脚本的更新
- 不要在脚本中输入敏感信息

## 技术支持

如果遇到安装问题，请：
1. 查看本文档的常见问题部分
2. 在项目的[Issues页面](https://github.com/yourusername/qmsl/issues)提交问题
3. 提供详细的错误信息和浏览器版本