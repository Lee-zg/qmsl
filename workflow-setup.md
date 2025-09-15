# GitHub Actions 工作流设置指南

由于权限限制，工作流文件暂时保存在 `temp_workflows` 目录中。以下是手动添加到GitHub的步骤：

## 📁 工作流文件

项目包含两个GitHub Actions工作流：

### 1. 脚本验证工作流 (validate-scripts.yml)
- **功能**：自动验证脚本语法和必需元数据
- **触发**：每次push和pull request
- **位置**：`.github/workflows/validate-scripts.yml`

### 2. README更新工作流 (update-readme.yml)  
- **功能**：自动更新README中的脚本列表
- **触发**：脚本文件变更时
- **位置**：`.github/workflows/update-readme.yml`

## 🚀 手动添加步骤

### 方法1：通过GitHub网页界面

1. 访问你的GitHub仓库：https://github.com/Lee-zg/qmsl
2. 创建 `.github/workflows/` 目录结构
3. 将 `temp_workflows/` 中的文件内容复制到对应位置

### 方法2：本地添加后推送

1. 创建工作流目录：
```bash
mkdir -p .github/workflows
```

2. 复制工作流文件：
```bash
copy temp_workflows\*.yml .github\workflows\
```

3. 提交并推送：
```bash
git add .github/workflows/
git commit -m "feat: 添加GitHub Actions工作流"
git push origin main
```

### 方法3：使用个人访问令牌

1. 在GitHub设置中创建Personal Access Token
2. 选择 `workflow` 权限范围
3. 使用token替代密码进行推送

## ⚙️ 工作流功能说明

### validate-scripts.yml
- 检查JavaScript语法错误
- 验证必需的脚本元数据
- 检查文件编码格式
- 确保每个脚本目录有README文件

### update-readme.yml
- 扫描所有 `.user.js` 文件
- 提取脚本元信息
- 自动生成脚本列表表格
- 更新README.md文件

## 🔧 后续优化

添加工作流后，你可以：

1. **自动化脚本管理**：每次添加新脚本都会自动更新文档
2. **质量保证**：确保所有脚本符合规范
3. **版本管理**：自动跟踪脚本更新时间
4. **持续集成**：保证项目代码质量

## 📝 注意事项

- 工作流需要 `workflow` 权限才能正常运行
- 首次运行可能需要几分钟时间
- 如果遇到权限问题，检查仓库的Actions设置

---

完成工作流设置后，你的QMSL项目就具备了完整的自动化功能！