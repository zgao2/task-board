# 📊 使用真实数据配置指南

## 🚀 快速开始

### 方案 A：使用示例数据（推荐先测试）

我已经为你创建了一个完整的典型互联网团队示例数据：

**文件位置**: `src/utils/realData.example.ts`

**包含内容**:
- ✅ 6 人团队（架构师、前端、后端、测试、运维、产品）
- ✅ 9 个真实任务场景
- ✅ 完整的工作依赖关系
- ✅ 详细的工作目标和交付物

### 方案 B：使用你自己的数据

1. 复制示例文件：
```bash
cd /home/node/.openclaw/workspace/task-board
cp src/utils/realData.example.ts src/utils/realData.ts
```

2. 编辑 `src/utils/realData.ts`，修改为你的真实数据

3. 在 `src/utils/mockData.ts` 中启用真实数据：
```typescript
// 取消注释以下导入
import { realAgents, realTasks, realWorkItems, realComments, getWorkItem, getAllWorkItems } from './realData';

// 然后将导出改为：
export const mockAgents: Agent[] = realAgents;
export const mockTasks: Task[] = realTasks;
```

---

## 📝 数据配置说明

### 1. 配置团队成员

编辑 `realData.ts` 中的 `realAgents` 数组：

```typescript
export const realAgents: Agent[] = [
  {
    id: 'agent-001',           // 唯一标识（可以用员工工号）
    name: '李明',              // 真实姓名
    role: '技术架构师',         // 职位/角色
    avatar: '🏗️',              // Emoji 头像（也可以用图片 URL）
    status: 'busy',            // online | busy | offline
    completedTasks: 156,       // 历史完成任务数
    successRate: 98.2,         // 成功率（百分比）
    currentTaskId: 'task-001', // 当前主要任务 ID
    workload: 4,               // 当前工作量（任务数）
  },
  // 添加更多成员...
];
```

### 2. 配置任务

编辑 `realWorkItems` 对象：

```typescript
'task-001': {
  id: 'task-001',
  title: '你的任务标题',
  description: '任务详细描述',
  status: 'in-progress',  // todo | in-progress | done
  priority: 'high',       // low | medium | high | urgent
  assigneeId: 'agent-001',
  assigneeName: '李明',
  dueDate: '2026-03-25T23:59:59.000Z', // 截止时间（ISO 格式）
  
  // 依赖关系
  dependencies: [
    {
      taskId: 'task-002',
      type: 'blocked_by',  // blocked_by | blocks | related | requires
      description: '等待任务 2 完成后才能开始',
    },
  ],
  blockedTasks: ['task-003', 'task-004'], // 被此任务阻塞的任务
  
  // 工作详情
  workDetails: {
    objectives: [      // 工作目标
      '目标 1',
      '目标 2',
    ],
    deliverables: [    // 交付物
      '交付物 1',
      '交付物 2',
    ],
    requirements: [    // 前置要求
      '要求 1',
      '要求 2',
    ],
    estimatedHours: 80,   // 预估工时
    actualHours: 45,      // 实际工时
    progress: 55,         // 进度（0-100）
  },
  
  collaborators: ['agent-002', 'agent-003'], // 协作者 ID 列表
},
```

### 3. 配置依赖关系

依赖关系类型说明：

| 类型 | 说明 | 颜色 |
|------|------|------|
| `blocked_by` | 当前任务等待其他任务完成 | 🟠 琥珀色 |
| `blocks` | 当前任务阻塞其他任务 | 🔵 蓝色 |
| `collaborating` | 与其他成员协作 | 🟢 绿色 |
| `related` | 关联任务 | ⚪ 灰色 |

示例：
```typescript
dependencies: [
  {
    taskId: 'task-002',
    type: 'blocked_by',
    description: '需要等 UI 设计完成后才能开始开发',
  },
  {
    taskId: 'task-003',
    type: 'related',
    description: '与此任务相关，需要协调时间',
  },
]
```

---

## 💡 实际业务场景模板

### 场景 1: 产品开发

```typescript
'task-product-001': {
  id: 'task-product-001',
  title: '智能客服系统开发',
  description: '开发基于 AI 的智能客服系统，支持自动问答、工单流转、情绪分析',
  status: 'in-progress',
  priority: 'urgent',
  assigneeId: 'agent-dev-001',
  assigneeName: '张三',
  dueDate: daysFromNow(30),
  workDetails: {
    objectives: [
      '实现 NLP 问答引擎',
      '开发工单管理系统',
      '集成情绪分析模块',
      '接入多渠道（微信、网站、APP）',
    ],
    deliverables: [
      '智能客服系统',
      '管理后台',
      'API 文档',
      '部署手册',
    ],
    estimatedHours: 240,
    progress: 35,
  },
}
```

### 场景 2: 数据分析

```typescript
'task-data-001': {
  id: 'task-data-001',
  title: '用户行为分析平台',
  description: '搭建用户行为分析平台，实现数据采集、存储、分析、可视化全流程',
  status: 'todo',
  priority: 'high',
  assigneeId: 'agent-data-001',
  assigneeName: '李四',
  dueDate: daysFromNow(45),
  workDetails: {
    objectives: [
      '设计数据仓库模型',
      '实现数据采集 SDK',
      '开发分析引擎',
      '构建可视化大屏',
    ],
    deliverables: [
      '数据仓库',
      '分析平台',
      '可视化大屏',
    ],
    estimatedHours: 320,
    progress: 0,
  },
}
```

### 场景 3: 运维项目

```typescript
'task-ops-001': {
  id: 'task-ops-001',
  title: '多云架构部署',
  description: '在阿里云和 AWS 部署多云架构，实现灾备和负载均衡',
  status: 'in-progress',
  priority: 'high',
  assigneeId: 'agent-ops-001',
  assigneeName: '王五',
  dueDate: daysFromNow(20),
  workDetails: {
    objectives: [
      '设计多云架构',
      '配置 DNS 解析',
      '实现数据同步',
      '搭建监控系统',
    ],
    deliverables: [
      '多云架构图',
      '部署脚本',
      '监控大盘',
      '运维手册',
    ],
    estimatedHours: 120,
    progress: 50,
  },
}
```

---

## 🔧 集成步骤

### 步骤 1: 准备数据

```bash
# 复制示例文件
cp src/utils/realData.example.ts src/utils/realData.ts

# 编辑真实数据
code src/utils/realData.ts
```

### 步骤 2: 修改 mockData.ts

编辑 `src/utils/mockData.ts`：

```typescript
// 在文件顶部添加导入
import { realAgents, realTasks, realWorkItems, realComments, getWorkItem, getAllWorkItems } from './realData';

// 替换导出（在文件底部）
export const mockAgents: Agent[] = realAgents;
export const mockTasks: Task[] = realTasks;

// 替换 workItems 对象
const workItems: Record<string, WorkItem> = realWorkItems;

// 替换评论
const mockComments: Comment[] = realComments;

// 替换辅助函数
export const getWorkItem = getWorkItem;
export const getAllWorkItems = getAllWorkItems;
```

### 步骤 3: 重新构建

```bash
pnpm build
pnpm preview
```

### 步骤 4: 验证

访问以下页面查看真实数据：
- http://localhost:4173/ - 看板主页
- http://localhost:4173/agents - 员工列表
- http://localhost:4173/agents/agent-001 - 员工详情

---

## 📊 数据可视化效果

配置真实数据后，你可以看到：

1. **看板主页**
   - 真实的任务卡片
   - 实际的优先级和截止时间
   - 真实的负责人信息

2. **数字员工监控**
   - 真实团队成员
   - 实际工作量统计
   - 当前工作详情

3. **员工详情页**
   - 完整的工作目标
   - 交付物清单
   - 真实的依赖关系网络
   - 实际进度百分比

---

## 🎯 最佳实践

1. **从简单开始**: 先配置 3-5 个核心成员，10 个左右的关键任务
2. **逐步完善**: 根据实际使用情况添加更多细节
3. **定期更新**: 每周更新任务进度和状态
4. **使用真实 ID**: 如果对接 Jira/禅道等系统，使用真实的项目/任务 ID
5. **保持简洁**: 描述清晰简洁，避免过长文本

---

## ❓ 常见问题

**Q: 如何对接真实的项目管理系统？**
A: 可以编写数据同步脚本，定期从 Jira/禅道/GitLab 等系统拉取数据，更新到 `realData.ts`

**Q: 数据太多如何管理？**
A: 可以按项目拆分到多个文件，然后合并导出

**Q: 如何实现实时更新？**
A: 可以对接 WebSocket 或轮询 API，实时更新任务状态

---

需要帮助配置你的真实数据吗？告诉我你的：
- 团队规模和角色
- 当前项目列表
- 工作流程

我可以帮你生成定制化的数据配置！
