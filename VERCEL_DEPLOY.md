# 🚀 Vercel 部署指南

**5 分钟上线，获得公网访问链接！**

---

## 📋 部署前准备

### 1. 检查配置文件

✅ `vercel.json` 已创建（包含构建配置和 SPA 路由支持）

✅ `.github/workflows/deploy-vercel.yml` 已创建（GitHub Actions 自动部署）

### 2. 准备 GitHub 账号

如果没有 GitHub 账号，先注册：https://github.com/signup

---

## 🎯 部署步骤

### 方案 A：一键部署（推荐，最简单）

#### 步骤 1: 推送到 GitHub

```bash
cd /home/node/.openclaw/workspace/task-board

# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Task Board System"

# 创建 GitHub 仓库（在 GitHub 网站上）
# 1. 访问 https://github.com/new
# 2. 仓库名：task-board
# 3. 选择 Public 或 Private
# 4. 点击 Create repository

# 关联远程仓库并推送
git remote add origin https://github.com/YOUR_USERNAME/task-board.git
git branch -M main
git push -u origin main
```

#### 步骤 2: 在 Vercel 导入项目

1. **访问 Vercel**: https://vercel.com/new
2. **登录**: 使用 GitHub 账号登录
3. **导入 Git 仓库**:
   - 点击 "Import Git Repository"
   - 选择你的 `task-board` 仓库
   - 点击 "Import"

#### 步骤 3: 配置构建设置

Vercel 会自动检测 Vite 框架，确认以下配置：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Install Command | `pnpm install` |

**如果检测不到 pnpm**，手动设置：
- Root Directory: `./`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

#### 步骤 4: 点击 Deploy

点击 **"Deploy"** 按钮，等待构建完成（约 1-2 分钟）

#### 步骤 5: 获取访问链接

部署成功后，你会获得：
- **生产环境链接**: `https://task-board-xxx.vercel.app`
- **预览链接**: 每次推送都会生成预览链接

---

### 方案 B：使用 Vercel CLI（适合高级用户）

#### 步骤 1: 安装 Vercel CLI

```bash
npm i -g vercel
```

#### 步骤 2: 登录 Vercel

```bash
vercel login
```

选择登录方式（推荐 GitHub）

#### 步骤 3: 部署

```bash
cd /home/node/.openclaw/workspace/task-board

# 首次部署（会提示配置项目）
vercel

# 部署到生产环境
vercel --prod
```

#### 步骤 4: 查看链接

部署完成后，CLI 会显示：
```
🔍  Inspect: https://vercel.com/your-username/task-board/xxx
✅  Production: https://task-board-xxx.vercel.app
```

---

## ⚙️ 高级配置

### 1. 自定义域名

1. 访问 Vercel Dashboard → Project → Settings → Domains
2. 添加你的域名（如 `task-board.yourdomain.com`）
3. 按提示配置 DNS：
   - **类型**: CNAME
   - **名称**: www 或 @
   - **值**: cname.vercel-dns.com

**DNS 生效时间**: 通常几分钟到几小时

### 2. 环境变量

如果项目需要环境变量：

1. Vercel Dashboard → Project → Settings → Environment Variables
2. 添加变量：
   - `API_URL` - API 地址
   - `APP_NAME` - 应用名称
   - 等等...
3. 重新部署使变量生效

### 3. 自动部署配置

Vercel 默认会自动部署：
- 推送到 `main` 分支 → 生产环境
- 推送到其他分支 → 预览环境

如需修改，编辑 `vercel.json`：

```json
{
  "github": {
    "silent": false,
    "autoJobCancelation": true
  }
}
```

---

## 🔄 GitHub Actions 自动部署

已为你创建自动部署工作流：

**文件**: `.github/workflows/deploy-vercel.yml`

### 配置 Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. 访问：https://github.com/YOUR_USERNAME/task-board/settings/secrets/actions
2. 添加以下 Secrets：

| Secret Name | 获取方式 |
|-------------|----------|
| `VERCEL_TOKEN` | 见下方获取步骤 |
| `VERCEL_ORG_ID` | Vercel Dashboard → Settings |
| `VERCEL_PROJECT_ID` | Vercel Dashboard → Project Settings |

### 获取 Vercel Token

```bash
vercel login
vercel tokens ls
```

或访问：https://vercel.com/account/tokens

### 获取 Org ID 和 Project ID

1. **Org ID**: 
   - Vercel Dashboard → Settings → Account
   - 或在 vercel.json 配置

2. **Project ID**:
   - Vercel Dashboard → Project → Settings
   - URL 中包含项目 ID

### 测试自动部署

```bash
# 推送到 main 分支
git push origin main

# 查看 GitHub Actions 状态
# https://github.com/YOUR_USERNAME/task-board/actions
```

---

## 📊 部署后的链接

部署成功后，你将获得：

### 生产环境
```
https://task-board-xxx.vercel.app
```

### 预览环境（每次 PR 都会生成）
```
https://task-board-git-branch-name.vercel.app
```

### 自定义域名（如果配置）
```
https://task-board.yourdomain.com
```

---

## ✅ 验证部署

部署完成后，访问以下页面验证：

1. **看板主页**: `https://your-app.vercel.app/`
2. **员工列表**: `https://your-app.vercel.app/agents`
3. **员工详情**: `https://your-app.vercel.app/agents/agent-001`
4. **任务详情**: `https://your-app.vercel.app/tasks/task-2024-001`

---

## 🐛 常见问题

### Q1: 构建失败 "pnpm not found"

**解决方案**:
在 Vercel Dashboard → Project Settings → Build & Development Settings
- Install Command: `npm i -g pnpm && pnpm install`

或创建 `.npmrc` 文件：
```
engine-strict=true
engine-node=>=18
```

### Q2: 页面刷新 404

**原因**: SPA 路由问题

**解决方案**: 
`vercel.json` 已配置 rewrites，确保包含：
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Q3: 静态资源 404

**原因**: 路径配置问题

**解决方案**:
在 `vite.config.ts` 中添加：
```typescript
export default defineConfig({
  base: '/',
  // ...其他配置
})
```

### Q4: 如何查看部署日志？

**方法 1**: Vercel Dashboard → Deployments → 点击部署 → View Build Logs

**方法 2**: CLI 查看
```bash
vercel logs <deployment-url>
```

### Q5: 如何回滚到之前的版本？

1. Vercel Dashboard → Deployments
2. 找到要回滚的版本
3. 点击 "..." → "Promote to Production"

---

## 📈 性能优化

### 1. 启用边缘缓存

在 `vercel.json` 中添加：
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

✅ 已配置

### 2. 启用 Gzip 压缩

Vercel 默认启用 Gzip 和 Brotli 压缩，无需额外配置。

### 3. 图片优化

使用 Next.js Image 组件或手动优化图片：
- 压缩图片
- 使用 WebP 格式
- 添加适当尺寸

---

## 💰 费用说明

### Vercel 免费计划

- ✅ 无限生产部署
- ✅ 无限预览部署
- ✅ 100GB 带宽/月
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自定义域名

**适合**: 个人项目、小型应用、日活 < 1000

### Pro 计划 ($20/月)

- ✅ 1TB 带宽
- ✅ 更多 Serverless 执行时间
- ✅ 分析功能
- ✅ 优先支持

---

## 🎯 下一步

### 部署完成后：

1. **测试所有功能**
   - 看板拖拽
   - 员工详情
   - 任务依赖关系

2. **配置真实数据**
   ```bash
   cp src/utils/realData.example.ts src/utils/realData.ts
   # 编辑真实数据
   git add .
   git commit -m "Add real data"
   git push
   # Vercel 会自动重新部署
   ```

3. **分享链接**
   - 发送给团队成员
   - 在浏览器中加入书签

4. **监控性能**
   - Vercel Dashboard → Analytics
   - 查看访问量和性能指标

---

## 📞 获取帮助

- 📖 Vercel 文档：https://vercel.com/docs
- 💬 Vercel 社区：https://github.com/vercel/vercel/discussions
- 🐛 提交 Issue：https://github.com/your-username/task-board/issues

---

## 🎉 部署完成清单

- [ ] 推送到 GitHub
- [ ] 在 Vercel 导入项目
- [ ] 配置构建设置
- [ ] 点击 Deploy
- [ ] 获得公网链接
- [ ] 测试所有页面
- [ ] （可选）配置自定义域名
- [ ] （可选）配置 GitHub Actions
- [ ] 分享给团队成员

---

**恭喜！你的任务看板系统已经部署到公网！** 🚀

访问你的公网链接，随时随地管理工作！
