# 任务看板系统 - 真实数据配置指南

本文档帮助你填充真实的业务数据。

---

## 📝 步骤 1: 定义你的数字员工

打开 `src/utils/mockData.ts`，修改 `mockAgents` 数组：

```typescript
export const mockAgents: Agent[] = [
  {
    id: 'agent-001',  // 唯一标识
    name: '张三',      // 真实姓名或昵称
    role: '后端开发',   // 职位/角色
    avatar: '👨‍💻',    // Emoji 头像
    status: 'online',  // online | busy | offline
    completedTasks: 45, // 已完成任务数
    successRate: 97.5,  // 成功率百分比
    currentTaskId: 'task-001', // 当前任务 ID
    workload: 3, // 当前工作量（任务数）
  },
  // 添加更多员工...
];
```

### 实际案例参考

```typescript
// 示例：真实团队配置
export const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: '李明',
    role: '技术架构师',
    avatar: '🏗️',
    status: 'busy',
    completedTasks: 156,
    successRate: 98.2,
    currentTaskId: 'task-2024-001',
    workload: 4,
  },
  {
    id: 'agent-002',
    name: '王芳',
    role: '前端负责人',
    avatar: '🎨',
    status: 'online',
    completedTasks: 203,
    successRate: 99.1,
    currentTaskId: 'task-2024-005',
    workload: 5,
  },
  {
    id: 'agent-003',
    name: '张伟',
    role: '后端工程师',
    avatar: '⚙️',
    status: 'online',
    completedTasks: 128,
    successRate: 96.8,
    currentTaskId: 'task-2024-008',
    workload: 3,
  },
  {
    id: 'agent-004',
    name: '刘洋',
    role: '测试工程师',
    avatar: '🧪',
    status: 'busy',
    completedTasks: 189,
    successRate: 99.5,
    currentTaskId: 'task-2024-012',
    workload: 6,
  },
  {
    id: 'agent-005',
    name: '陈静',
    role: '运维工程师',
    avatar: '🚀',
    status: 'offline',
    completedTasks: 95,
    successRate: 97.3,
    currentTaskId: null,
    workload: 0,
  },
];
```

---

## 📋 步骤 2: 定义真实任务

在 `workItems` 对象中添加你的实际任务：

```typescript
const workItems: Record<string, WorkItem> = {
  'task-2024-001': {
    id: 'task-2024-001',
    title: '电商平台微服务重构',
    description: '将单体应用拆分为用户服务、订单服务、支付服务等微服务模块',
    status: 'in-progress', // todo | in-progress | done
    priority: 'high',      // low | medium | high | urgent
    assigneeId: 'agent-001',
    assigneeName: '李明',
    dueDate: '2026-03-25T23:59:59.000Z', // ISO 日期格式
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: new Date().toISOString(),
    comments: [],
    
    // 依赖关系
    dependencies: [],
    blockedTasks: ['task-2024-002', 'task-2024-003'],
    
    // 工作详情
    workDetails: {
      objectives: [
        '完成服务拆分方案设计',
        '搭建微服务基础设施',
        '迁移用户服务',
        '迁移订单服务',
      ],
      deliverables: [
        '微服务架构设计文档',
        '服务拆分方案',
        '部署脚本',
      ],
      requirements: [
        '现有系统架构图',
        '业务需求文档',
      ],
      estimatedHours: 120,
      actualHours: 68,
      progress: 55, // 0-100
    },
    
    collaborators: ['agent-002', 'agent-003'],
  },
  
  // 添加更多任务...
};
```

---

## 🎯 实际业务场景模板

### 场景 1: 软件开发项目

```typescript
'task-2024-001': {
  id: 'task-2024-001',
  title: '用户中心重构',
  description: '重构用户中心模块，支持多租户、SSO 单点登录、权限管理',
  status: 'in-progress',
  priority: 'urgent',
  assigneeId: 'agent-002',
  assigneeName: '王芳',
  dueDate: daysFromNow(5),
  workDetails: {
    objectives: [
      '实现多租户架构',
      '集成 OAuth2.0 SSO',
      '完善 RBAC 权限系统',
      '性能优化（响应时间 < 200ms）',
    ],
    deliverables: [
      '用户中心 API 文档',
      '前端组件库',
      '集成测试报告',
    ],
    requirements: [
      '现有用户数据库',
      '业务需求确认',
    ],
    estimatedHours: 80,
    actualHours: 45,
    progress: 60,
  },
  dependencies: [],
  blockedTasks: ['task-2024-005'],
  collaborators: ['agent-001', 'agent-003'],
}
```

### 场景 2: 产品上线任务

```typescript
'task-2024-002': {
  id: 'task-2024-002',
  title: '双 11 活动页面开发',
  description: '开发双 11 促销活动页面，包含秒杀、优惠券、拼团等功能',
  status: 'todo',
  priority: 'urgent',
  assigneeId: 'agent-002',
  assigneeName: '王芳',
  dueDate: daysFromNow(15),
  workDetails: {
    objectives: [
      '完成 UI 设计稿评审',
      '实现秒杀功能',
      '实现优惠券系统',
      '压力测试（支持 10 万 QPS）',
    ],
    deliverables: [
      '活动页面',
      '后台管理系统',
      '监控告警配置',
    ],
    requirements: [
      '产品需求文档',
      'UI 设计稿',
    ],
    estimatedHours: 160,
    progress: 0,
  },
  dependencies: [
    { taskId: 'task-2024-001', type: 'blocked_by', description: '等待用户中心重构完成' },
  ],
  blockedTasks: [],
  collaborators: ['agent-003', 'agent-004'],
}
```

### 场景 3: 运维任务

```typescript
'task-2024-003': {
  id: 'task-2024-003',
  title: '生产环境数据库迁移',
  description: '将 MySQL 从 5.7 升级到 8.0，迁移到云数据库 RDS',
  status: 'todo',
  priority: 'high',
  assigneeId: 'agent-005',
  assigneeName: '陈静',
  dueDate: daysFromNow(10),
  workDetails: {
    objectives: [
      '制定迁移方案',
      '搭建测试环境验证',
      '执行生产迁移',
      '性能监控优化',
    ],
    deliverables: [
      '迁移方案文档',
      '回滚方案',
      '监控大盘',
    ],
    requirements: [
      '数据库备份',
      '维护时间窗口确认',
    ],
    estimatedHours: 24,
    progress: 0,
  },
  dependencies: [
    { taskId: 'task-2024-001', type: 'blocked_by', description: '等待架构评审通过' },
  ],
  blockedTasks: [],
  collaborators: ['agent-001'],
}
```

### 场景 4: 测试任务

```typescript
'task-2024-004': {
  id: 'task-2024-004',
  title: '自动化测试覆盖率提升',
  description: '提升核心业务模块的自动化测试覆盖率到 80% 以上',
  status: 'in-progress',
  priority: 'medium',
  assigneeId: 'agent-004',
  assigneeName: '刘洋',
  dueDate: daysFromNow(20),
  workDetails: {
    objectives: [
      '分析现有测试覆盖率',
      '编写单元测试',
      '编写集成测试',
      '接入 CI/CD 流水线',
    ],
    deliverables: [
      '测试报告',
      '测试用例文档',
      'CI/CD 配置',
    ],
    requirements: [
      '核心业务代码',
      '测试环境',
    ],
    estimatedHours: 60,
    actualHours: 35,
    progress: 58,
  },
  dependencies: [],
  blockedTasks: [],
  collaborators: ['agent-002', 'agent-003'],
}
```

---

## 🔗 步骤 3: 配置依赖关系

依赖关系类型说明：

- `blocked_by`: 当前任务被其他任务阻塞（等待中）
- `blocks`: 当前任务阻塞其他任务
- `related`: 关联任务
- `requires`: 需要其他任务

```typescript
dependencies: [
  {
    taskId: 'task-2024-001',
    type: 'blocked_by',
    description: '需要用户中心重构完成后才能开始',
  },
  {
    taskId: 'task-2024-003',
    type: 'related',
    description: '与数据库迁移相关，需要协调时间窗口',
  },
],
```

---

## 💬 步骤 4: 添加真实评论

```typescript
const mockComments: Comment[] = [
  {
    id: generateId(),
    taskId: 'task-2024-001',
    authorId: 'agent-001',
    authorName: '李明',
    content: '架构设计已完成，正在评审中，预计周三可以开始开发',
    createdAt: daysAgo(2),
  },
  {
    id: generateId(),
    taskId: 'task-2024-001',
    authorId: 'agent-002',
    authorName: '王芳',
    content: '前端组件库已经搭建好了，可以开始开发业务组件',
    createdAt: daysAgo(1),
  },
  {
    id: generateId(),
    taskId: 'task-2024-002',
    authorId: 'agent-004',
    authorName: '刘洋',
    content: '测试用例已编写完成，等待代码提交后进行测试',
    createdAt: new Date().toISOString(),
  },
];
```

---

## 📊 完整示例文件

查看已创建的示例文件：
- `src/utils/mockData.ts` - 包含完整的模拟数据

---

## 🚀 快速开始

1. **复制示例数据**
```bash
cd /home/node/.openclaw/workspace/task-board
# 编辑 src/utils/mockData.ts
```

2. **修改为你的真实数据**
   - 替换员工信息
   - 添加实际任务
   - 配置依赖关系

3. **重新构建**
```bash
pnpm build
pnpm preview
```

4. **访问查看效果**
```
http://localhost:4173
```

---

## 💡 建议

1. **从少量数据开始**: 先配置 3-5 个员工，10-15 个任务
2. **逐步完善**: 根据实际使用情况添加更多细节
3. **保持更新**: 定期更新任务进度和状态
4. **使用真实 ID**: 如果对接实际系统，使用真实的项目/任务 ID

---

需要我帮你根据你的实际业务场景定制数据吗？告诉我你的：
- 团队规模和角色
- 当前项目类型
- 主要工作流程

我可以为你生成更贴合实际的数据配置！
