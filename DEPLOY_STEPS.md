# 🚀 Vercel 部署步骤

## ✅ 已完成

- [x] Git 仓库初始化
- [x] 代码提交
- [x] 分支重命名为 main
- [x] Vercel 配置文件准备

---

## 📋 接下来你需要做的（3 步）

### 步骤 1: 在 GitHub 创建仓库

1. 访问：https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `task-board`
   - **Description**: 任务看板系统 - 团队工作管理和协作平台
   - **Visibility**: 选择 Public 或 Private
3. 点击 **"Create repository"**

### 步骤 2: 推送代码到 GitHub

在终端执行以下命令（替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
cd /home/node/.openclaw/workspace/task-board

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/task-board.git

# 推送到 GitHub
git push -u origin main
```

### 步骤 3: 在 Vercel 部署

1. 访问：https://vercel.com/new
2. 使用 GitHub 账号登录
3. 点击 **"Import Git Repository"**
4. 找到并导入 `task-board` 仓库
5. 确认配置（Vercel 会自动检测）：
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
6. 点击 **"Deploy"**

---

## 🎉 部署完成后

你会获得公网访问链接：
```
https://task-board-xxx.vercel.app
```

**访问页面**:
- 📋 看板主页：`https://task-board-xxx.vercel.app/`
- 👥 员工列表：`https://task-board-xxx.vercel.app/agents`
- 🔍 员工详情：`https://task-board-xxx.vercel.app/agents/agent-001`

---

## 💡 配置真实数据

部署完成后，编辑真实数据并重新部署：

```bash
# 1. 复制并编辑真实数据
cp src/utils/realData.example.ts src/utils/realData.ts
code src/utils/realData.ts

# 2. 提交更改
git add .
git commit -m "Add real team data"
git push

# 3. Vercel 会自动重新部署（约 1-2 分钟）
```

---

## 📞 需要帮助？

查看完整文档：
- `VERCEL_DEPLOY.md` - 详细部署指南
- `PROJECT_SUMMARY.md` - 项目总结
- `README_REAL_DATA.md` - 真实数据配置

---

**准备好了吗？开始执行上面的 3 个步骤吧！** 🎯
