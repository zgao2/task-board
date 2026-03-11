# 腾讯云部署指南

## 方案对比

| 方案 | 难度 | 费用 | 适合场景 |
|------|------|------|---------|
| Webify | ⭐ | ¥9/月起 | 快速部署 |
| COS 静态托管 | ⭐⭐ | ¥15/月起 | 生产环境 |
| CVM 服务器 | ⭐⭐⭐⭐ | ¥35/月起 | 完全控制 |

---

## 方案 1: Webify（推荐新手）

### 步骤

1. 访问：https://console.cloud.tencent.com/webify
2. 登录腾讯云账号
3. 点击"创建应用"
4. 选择"从 GitHub 导入"
5. 选择 `zgao2/task-board` 仓库
6. 配置构建：
   - 构建命令：`pnpm build`
   - 输出目录：`dist`
   - Node 版本：`20.x`
7. 点击"创建"

### 费用

- 基础版：¥9/月
- 标准版：¥29/月
- 专业版：¥99/月

### 访问链接

```
https://task-board-xxx.webify.tencentcloudapi.com
```

---

## 方案 2: COS 静态网站托管（推荐生产）

### 步骤 1: 本地构建

```bash
cd ~/task-board
pnpm install
pnpm build
```

### 步骤 2: 创建存储桶

1. 访问：https://console.cloud.tencent.com/cos
2. 点击"创建存储桶"
3. 配置：
   - 名称：`task-board-你的名字`（如 `task-board-zgao`）
   - 地域：选择离用户近的
   - 访问权限：公有读私有写
4. 点击"确认"

### 步骤 3: 上传文件

**方式 A: 网页上传**
1. 进入存储桶
2. 点击"上传"
3. 拖入 `dist` 目录所有文件
4. 点击"上传"

**方式 B: 使用 COSCMD 工具**
```bash
# 安装 COSCMD
pip install coscmd

# 配置
coscmd config -a YOUR_APPID -s YOUR_SECRET_KEY -r ap-guangzhou

# 上传
coscmd upload -r ./dist/ /
```

**方式 C: 使用 GitHub Actions 自动部署**

创建 `.github/workflows/tencent-cos.yml`:

```yaml
name: Deploy to Tencent COS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to COS
        uses: TencentCloud/cos-action@v1
        with:
          secret_id: ${{ secrets.TENCENT_SECRET_ID }}
          secret_key: ${{ secrets.TENCENT_SECRET_KEY }}
          cos_bucket: task-board-1234567890
          cos_region: ap-guangzhou
          local_path: ./dist
          remote_path: /
```

### 步骤 4: 配置静态网站

1. 进入存储桶 → 基础配置
2. 找到"静态网站"
3. 点击"编辑"
4. 启用：
   - 索引文档：`index.html`
   - 错误文档：`index.html`
5. 保存

### 步骤 5: 获得访问链接

```
http://task-board-xxx.cos-website.ap-guangzhou.myqcloud.com
```

### 费用估算

- 存储费：约 ¥5/月（1GB 以内）
- 流量费：约 ¥10/月（10GB/月）
- 请求费：约 ¥1/月
- **总计**: 约 ¥15-20/月

---

## 方案 3: CVM 云服务器

### 步骤 1: 购买服务器

1. 访问：https://console.cloud.tencent.com/cvm
2. 点击"新建"
3. 配置：
   - 地域：广州/上海
   - 机型：标准型 S5
   - CPU: 2 核
   - 内存：2GB
   - 系统：Ubuntu 20.04
   - 带宽：3Mbps
4. 点击"立即购买"

### 步骤 2: 配置安全组

1. 进入 CVM 控制台
2. 点击"安全组"
3. 添加入站规则：
   - 端口：80（HTTP）
   - 端口：443（HTTPS）
   - 来源：0.0.0.0/0

### 步骤 3: 连接服务器

```bash
# 获取服务器公网 IP
ssh root@YOUR_SERVER_IP

# 输入密码（首次登录需要改密码）
```

### 步骤 4: 安装 Docker

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 启动 Docker
systemctl enable docker
systemctl start docker

# 安装 Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 步骤 5: 部署项目

```bash
# 创建部署目录
mkdir -p /opt/task-board
cd /opt/task-board

# 创建 docker-compose.yml
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
    restart: unless-stopped
EOF

# 创建 nginx.conf
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

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
}
EOF
```

### 步骤 6: 上传构建文件

**方式 A: 使用 SCP**
```bash
# 在本地电脑执行
cd ~/task-board
pnpm build
scp -r dist/* root@YOUR_SERVER_IP:/opt/task-board/dist/
```

**方式 B: 使用 Git**
```bash
# 在服务器上执行
cd /opt/task-board
git clone https://github.com/zgao2/task-board.git
cd task-board
pnpm install
pnpm build
cp -r dist/* /opt/task-board/dist/
```

### 步骤 7: 启动服务

```bash
cd /opt/task-board
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 步骤 8: 配置域名（可选）

1. 购买域名（腾讯云 DNSPod）
2. 添加 A 记录指向服务器 IP
3. 配置 HTTPS（Let's Encrypt）

```bash
# 安装 Certbot
apt update
apt install certbot -y

# 申请证书
certbot certonly --standalone -d your-domain.com

# 配置 Nginx SSL（修改 nginx.conf）
```

### 费用估算

- 服务器：¥35/月（2 核 2G 3M）
- 域名：¥60/年
- SSL 证书：免费（Let's Encrypt）
- **总计**: 约 ¥40/月

---

## 🎯 推荐方案

### 个人项目 / 快速测试
**选择**: Webify
- 优点：简单快速
- 费用：¥9/月

### 生产环境 / 小团队
**选择**: COS 静态托管
- 优点：稳定便宜
- 费用：¥15-20/月

### 企业应用 / 完全控制
**选择**: CVM 服务器
- 优点：灵活可控
- 费用：¥40/月

---

## 📋 快速开始

### Webify（最快）
```bash
# 1. 访问 https://console.cloud.tencent.com/webify
# 2. 从 GitHub 导入
# 3. 配置构建并创建
```

### COS（推荐）
```bash
# 1. 本地构建
cd ~/task-board
pnpm build

# 2. 访问 https://console.cloud.tencent.com/cos
# 3. 创建存储桶
# 4. 上传 dist 目录文件
# 5. 配置静态网站
```

### CVM（灵活）
```bash
# 1. 购买服务器
# 2. 安装 Docker
# 3. 上传文件
# 4. 启动容器
```

---

## ❓ 常见问题

### Q: Webify 和 Vercel 有什么区别？
A: Webify 是腾讯云的版本，国内访问更快，但功能类似。

### Q: COS 需要备案吗？
A: 如果只是静态网站托管，不需要备案。如果绑定自定义域名，需要备案。

### Q: CVM 服务器如何选择配置？
A: 
- 个人项目：1 核 1G 1M（¥20/月）
- 小团队：2 核 2G 3M（¥35/月）
- 企业应用：4 核 8G 5M（¥100/月）

### Q: 如何自动部署？
A: 使用 GitHub Actions，参考上面的配置示例。

---

## 📞 获取帮助

- 腾讯云文档：https://cloud.tencent.com/document
- Webify 文档：https://cloud.tencent.com/document/product/1154
- COS 文档：https://cloud.tencent.com/document/product/436

---

**选择适合你的方案开始部署吧！** 🚀
