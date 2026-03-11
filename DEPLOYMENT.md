# 任务看板系统 - 公网部署指南

本文档提供多种公网部署方案，从免费托管到专业 VPS，适合不同需求场景。

---

## 📋 方案对比总览

| 方案 | 费用 | 难度 | 自定义域名 | CDN | HTTPS | 适合场景 |
|------|------|------|-----------|-----|-------|---------|
| **Vercel** | 免费 | ⭐ | ✅ | ✅ | ✅ | 个人项目、快速部署 |
| **Netlify** | 免费 | ⭐ | ✅ | ✅ | ✅ | 静态网站、表单功能 |
| **Cloudflare Pages** | 免费 | ⭐⭐ | ✅ | ✅ | ✅ | 全球加速、边缘计算 |
| **GitHub Pages** | 免费 | ⭐ | ✅ | ✅ | ✅ | 开源项目展示 |
| **Railway** | $5/月 | ⭐⭐ | ✅ | ✅ | ✅ | 全栈应用、数据库 |
| **VPS (自建)** | ¥30+/月 | ⭐⭐⭐⭐ | ✅ | 可选 | ✅ | 生产环境、完全控制 |

---

## 🚀 方案一：Vercel（强烈推荐）

**最适合：快速部署、零配置、个人项目**

### 优势
- ✅ 完全免费（个人版）
- ✅ 自动 HTTPS 证书
- ✅ 全球 CDN 加速
- ✅ 自动 CI/CD（Git 推送即部署）
- ✅ 自定义域名支持
- ✅ 构建速度快

### 限制
- 带宽限制：100GB/月
- 构建时长限制：60 秒
- Serverless Function 限制：100GB·小时/月

### 部署步骤

#### 方式 A：一键部署（推荐）

1. 将代码推送到 GitHub/GitLab
```bash
cd /home/node/.openclaw/workspace/task-board
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/task-board.git
git push -u origin main
```

2. 访问 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入 GitHub 仓库
5. 配置构建设置：
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
6. 点击 "Deploy"

#### 方式 B：CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd /home/node/.openclaw/workspace/task-board
vercel --prod
```

### 配置示例

创建 `vercel.json`：

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 自定义域名

1. Vercel Dashboard → Project Settings → Domains
2. 添加你的域名
3. 按提示配置 DNS：
   - **类型**: CNAME
   - **名称**: www
   - **值**: cname.vercel-dns.com

---

## 🌐 方案二：Cloudflare Pages

**最适合：全球加速、边缘计算、大流量**

### 优势
- ✅ 完全免费
- ✅ 无限带宽
- ✅ 全球 275+ 数据中心
- ✅ 内置 DDoS 防护
- ✅ 支持边缘函数
- ✅ 自动 HTTPS

### 限制
- 构建数量：500 次/月
- 并发构建：2 个

### 部署步骤

1. 访问 [Cloudflare Pages](https://pages.cloudflare.com)
2. 点击 "Create a project"
3. 连接 GitHub 账号
4. 选择仓库
5. 配置构建：
   - **Production branch**: `main`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
6. 点击 "Save and Deploy"

### CLI 部署

```bash
# 安装 Wrangler CLI
npm i -g wrangler

# 登录
wrangler login

# 部署
cd /home/node/.openclaw/workspace/task-board
pnpm build
wrangler pages deploy dist --project-name=task-board
```

### 自定义域名

1. Cloudflare Dashboard → Pages → 项目 → Custom Domains
2. 添加域名
3. 自动配置 DNS（Cloudflare 托管的域名）

---

## 🎨 方案三：Netlify

**最适合：静态网站、表单功能、A/B 测试**

### 优势
- ✅ 免费套餐充足
- ✅ 自动 HTTPS
- ✅ 表单处理（免费 100 条/月）
- ✅ 分割测试
- ✅ 插件生态系统

### 限制
- 带宽：100GB/月
- 构建时长：300 分钟/月

### 部署步骤

1. 访问 [Netlify](https://netlify.com)
2. 点击 "Add new site" → "Import an existing project"
3. 连接 GitHub
4. 配置构建：
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
5. 点击 "Deploy site"

### 配置文件

创建 `netlify.toml`：

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 🖥️ 方案四：VPS 自建（生产级）

**最适合：生产环境、完全控制、多应用部署**

### 推荐服务商

| 服务商 | 价格 | 配置 | 位置 |
|--------|------|------|------|
| **阿里云** | ¥35/月 | 2 核 2G 3M | 中国大陆 |
| **腾讯云** | ¥30/月 | 2 核 2G 3M | 中国大陆 |
| **DigitalOcean** | $6/月 | 1 核 1G 1T | 海外 |
| **Vultr** | $6/月 | 1 核 1G 1T | 海外 |
| **Linode** | $5/月 | 1 核 1G 1T | 海外 |

### 部署架构

```
用户 → Nginx (反向代理) → Docker 容器 (任务看板)
     → Let's Encrypt (HTTPS)
```

### 完整部署脚本

```bash
#!/bin/bash
# deploy.sh - VPS 部署脚本

# 1. 安装 Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 2. 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 3. 创建应用目录
mkdir -p /opt/task-board
cd /opt/task-board

# 4. 创建 docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  task-board:
    image: nginx:alpine
    container_name: task-board
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
    networks:
      - task-board-network

networks:
  task-board-network:
    driver: bridge
EOF

# 5. 创建 nginx.conf
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    
    # 强制 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    # SSL 证书
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1000;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# 6. 构建并上传项目
cd /home/node/.openclaw/workspace/task-board
pnpm build

# 使用 scp 上传（本地执行）
# scp -r dist/* root@your-server:/opt/task-board/dist/

# 7. 申请 SSL 证书（Let's Encrypt）
apt update
apt install certbot -y
certbot certonly --standalone -d your-domain.com

# 复制证书到 Nginx 目录
mkdir -p /opt/task-board/ssl
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/task-board/ssl/
cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/task-board/ssl/

# 8. 启动服务
cd /opt/task-board
docker-compose up -d

# 9. 设置自动续期
crontab -e
# 添加：0 0 1 * * certbot renew --quiet && docker restart task-board
```

### GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to VPS
        uses: easingthemes/ssh-deploy@v3
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.VPS_HOST }}
          REMOTE_USER: root
          SOURCE: dist/
          TARGET: /opt/task-board/dist
      
      - name: Restart Docker
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: root
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/task-board
            docker-compose restart
```

---

## 🎯 方案五：Railway（全栈方案）

**最适合：需要后端 API、数据库的全栈应用**

### 优势
- ✅ 一键部署
- ✅ 内置数据库（PostgreSQL、MySQL）
- ✅ 自动 HTTPS
- ✅ 环境变量管理
- ✅ $5/月 起

### 部署步骤

1. 访问 [Railway](https://railway.app)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择仓库
5. 添加环境变量
6. Railway 自动检测并部署

---

## 📊 推荐方案

### 个人项目 / 快速验证
**首选：Vercel**
- 零配置
- 免费额度充足
- 自动 CI/CD

### 生产环境 / 企业应用
**首选：VPS 自建**
- 完全控制
- 可部署多个应用
- 成本可控

### 大流量 / 全球化
**首选：Cloudflare Pages**
- 无限带宽
- 全球 CDN
- DDoS 防护

---

## 🔧 本地测试生产构建

在部署前，建议本地测试生产构建：

```bash
cd /home/node/.openclaw/workspace/task-board

# 构建
pnpm build

# 预览生产构建
pnpm preview --host 0.0.0.0 --port 4173

# 访问 http://localhost:4173
```

---

## 📝 部署检查清单

- [ ] 代码已推送到 Git 仓库
- [ ] 生产构建测试通过
- [ ] 环境变量已配置
- [ ] 域名已购买（如需要）
- [ ] DNS 已正确配置
- [ ] SSL 证书已申请
- [ ] 备份策略已制定
- [ ] 监控告警已配置

---

## 💡 成本估算

### 免费方案
- **Vercel/Netlify/Cloudflare**: ¥0/月
- 适合：日活 < 1000 的项目

### 入门方案
- **VPS (阿里云/腾讯云)**: ¥30-50/月
- **域名**: ¥50-80/年
- 适合：日活 1000-5000 的项目

### 专业方案
- **VPS (4 核 8G)**: ¥100-200/月
- **CDN**: ¥50-100/月
- **域名**: ¥50-80/年
- 适合：日活 5000+ 的项目

---

## 🆘 常见问题

### Q: 自定义域名如何配置？
A: 在部署平台添加域名后，到域名服务商处添加 CNAME 记录指向部署平台提供的地址。

### Q: HTTPS 证书如何申请？
A: Vercel/Netlify/Cloudflare 自动提供。VPS 使用 Let's Encrypt 免费证书。

### Q: 如何配置环境变量？
A: 
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- VPS: 在 docker-compose.yml 中配置

### Q: 如何实现自动部署？
A: 使用 GitHub Actions，推送代码到 main 分支自动触发部署。

---

## 📞 技术支持

遇到问题可以：
1. 查看官方文档
2. 查看项目 README
3. 提交 Issue
4. 联系部署平台客服

---

**最后更新**: 2026-03-11
**版本**: 1.0.0
