# 任务看板系统 (Task Board)

一个基于 React 18 + TypeScript 的任务看板系统，支持看板管理、数字员工监控和任务详情查看。

## 🚀 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Ant Design 5** - UI 组件库
- **Zustand** - 状态管理
- **TailwindCSS** - 样式工具
- **dnd-kit** - 拖拽功能
- **React Router 6** - 路由管理

## 📋 功能特性

### 1. 看板主页 (`/`)
- ✅ 看板列视图（待办 / 进行中 / 已完成）
- ✅ 任务卡片（标题、优先级、负责人、截止时间）
- ✅ 拖拽功能（支持拖拽改变任务状态）
- ✅ 新建任务模态框

### 2. 数字员工监控 (`/agents`)
- ✅ 员工列表卡片
- ✅ 状态指示器（在线/离线/忙碌）
- ✅ 已完成任务数统计
- ✅ 成功率显示
- ✅ 实时状态更新（模拟 Socket.IO）

### 3. 任务详情页 (`/tasks/:id`)
- ✅ 任务描述
- ✅ 评论列表
- ✅ 状态修改
- ✅ 分配负责人

## 🛠️ 开发环境

### 前置要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
cd task-board
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🐳 Docker 部署

### 方式一：使用 Docker Compose（推荐）

1. 复制环境变量文件

```bash
cp .env.example .env
```

2. 修改 `.env` 文件中的端口配置

3. 启动服务

```bash
docker-compose up -d
```

访问 `http://localhost:3000`

### 方式二：使用 Docker 命令

1. 构建镜像

```bash
docker build -t task-board .
```

2. 运行容器

```bash
docker run -d -p 3000:80 --name task-board task-board
```

### 停止服务

```bash
# Docker Compose
docker-compose down

# Docker
docker stop task-board
docker rm task-board
```

## 📁 项目结构

```
task-board/
├── public/                    # 静态资源
├── src/
│   ├── components/           # 可复用组件
│   │   ├── TaskCard.tsx      # 任务卡片
│   │   ├── BoardColumn.tsx   # 看板列
│   │   ├── AgentCard.tsx     # 员工卡片
│   │   └── Layout.tsx        # 布局组件
│   ├── pages/                # 页面组件
│   │   ├── Home.tsx          # 看板主页
│   │   ├── Agents.tsx        # 员工监控
│   │   └── TaskDetail.tsx    # 任务详情
│   ├── store/                # 状态管理
│   │   └── useStore.ts       # Zustand store
│   ├── types/                # TypeScript 类型
│   │   └── index.ts
│   ├── utils/                # 工具函数
│   │   └── mockData.ts       # Mock 数据
│   ├── App.tsx               # 应用入口
│   ├── main.tsx              # React 入口
│   └── index.css             # 全局样式
├── Dockerfile                # Docker 构建文件
├── docker-compose.yml        # Docker Compose 配置
├── nginx.conf                # Nginx 配置
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔧 配置

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| HOST_PORT | 主机映射端口 | 3000 |
| PORT | 容器内端口 | 80 |

### 自定义主题

编辑 `src/App.tsx` 中的 `ConfigProvider` 配置：

```tsx
<ConfigProvider locale={zhCN} theme={{
  token: {
    colorPrimary: '#1890ff',  // 主题色
    borderRadius: 6,          // 圆角
  },
}}>
```

## 📊 Mock 数据

系统内置了以下 Mock 数据：

- **10 个示例任务** - 覆盖不同优先级和状态
- **5 个数字员工** - 架构师、工程师、测试工程师、运维工程师、设计师
- **实时状态更新** - 每 10 秒模拟一次状态变化

## 🎨 设计特点

- **响应式设计** - 支持桌面端和移动端
- **拖拽交互** - 流畅的拖拽体验
- **实时反馈** - 状态变化实时通知
- **中文支持** - 完整的中文界面

## 📝 使用说明

### 创建任务

1. 点击"新建任务"按钮
2. 填写任务信息（标题、描述、优先级、负责人、截止时间）
3. 点击"确定"创建

### 移动任务

- 拖拽任务卡片到不同的列来改变状态
- 或在任务详情页使用状态选择器

### 分配负责人

1. 打开任务详情
2. 在"负责人"下拉框中选择员工
3. 支持取消分配

### 添加评论

1. 打开任务详情
2. 在评论区输入内容
3. 点击"发送"

## 🔒 安全特性

- Nginx 安全头配置
- XSS 防护
- Content-Type 嗅探防护
- 点击劫持防护

## 📈 性能优化

- Gzip 压缩
- 静态资源缓存
- 代码分割
- 懒加载

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT

---

**开发时间**: 2024
**版本**: 1.0.0
