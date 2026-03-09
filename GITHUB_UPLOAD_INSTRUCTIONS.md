# Git 上传步骤指南

由于 GitHub API 暂时无法访问，请按照以下步骤手动将项目上传到您的 GitHub WebSour 仓库：

## 步骤 1：在 GitHub 上创建仓库

1. 访问 https://github.com/new
2. 仓库名称：`WebSour`
3. 描述：可嵌入任意网页项目的交互式陪伴插件
4. 公开/私有：根据您的喜好选择
5. **不要**勾选"Add a README file"
6. **不要**勾选"Add .gitignore"
7. **不要**选择许可证
8. 点击"Create repository"

## 步骤 2：关联远程仓库并推送

在终端中执行以下命令（您已经完成了前几步）：

```bash
cd /Users/sumo1311/Documents/trae_projects/web-sour

# 添加远程仓库（将 YOUR_USERNAME 替换为您的 GitHub 用户名）
git remote add origin git@github.com:YOUR_USERNAME/WebSour.git

# 或者使用 HTTPS（如果您使用 HTTPS 方式）
# git remote add origin https://github.com/YOUR_USERNAME/WebSour.git

# 推送到 GitHub
git push -u origin main
```

## 步骤 3：验证上传

1. 刷新 GitHub 上的 WebSour 仓库页面
2. 确认所有文件都已上传：
   - src/companion.js
   - src/companion.css
   - dist/companion.js
   - dist/companion.min.js
   - scripts/build.js
   - index.html
   - package.json
   - PERFORMANCE_REPORT.md
   - README.md

## 常见问题

### 问题 1：权限错误
如果遇到权限错误，请确保：
- 已配置 SSH key
- 或者使用 HTTPS 方式并输入正确的凭证

### 问题 2：仓库已存在
如果 WebSour 仓库已存在，直接执行：
```bash
git remote add origin git@github.com:YOUR_USERNAME/WebSour.git
git push -u origin main
```

### 问题 3：推送被拒绝
如果推送被拒绝（因为远程仓库有 README），执行：
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 完成后的操作

上传成功后，您可以：
1. 在 GitHub 上查看项目
2. 启用 GitHub Pages 来托管演示页面
3. 添加项目到 GitHub Pages：
   - Settings -> Pages
   - Source: main branch
   - Folder: / (root)
   - Save

## 项目说明

这是一个完整的交互式 Web 陪伴插件项目，包含：
- ✅ 4 种角色风格（小猫、π、Σ、∞）
- ✅ 眼睛跟随鼠标功能
- ✅ 点击破裂效果和 +1 动画
- ✅ 10 秒自动重生
- ✅ 最多支持 10 个角色
- ✅ 性能监控面板
- ✅ 完整的文档和性能测试报告
