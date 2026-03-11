# 📝 更新真实数据指南

## 🎯 快速开始

### 步骤 1: 编辑真实数据文件

打开文件：`src/data/realTeam.ts`

### 步骤 2: 修改团队成员

找到 `realAgents` 数组，修改你的真实团队：

```typescript
export const realAgents: Agent[] = [
  {
    id: 'agent-001',
    name: '李明',              // 修改为真实姓名
    role: '技术架构师',         // 修改为真实职位
    avatar: '🏗️',              // 选择 Emoji 头像
    skills: ['架构设计', '微服务'], // 技能标签
    maxWorkload: 5,            // 最大任务数
    // ... 其他字段
  },
  // 添加更多团队成员...
];
```

### 步骤 3: 修改任务数据

找到 `realWorkItems` 对象，修改真实任务：

```typescript
'task-2024-001': {
  id: 'task-2024-001',
  title: '电商平台微服务重构',  // 修改任务标题
  description: '...',          // 任务描述
  priority: 'urgent',          // urgent | high | medium | low
  assigneeId: 'agent-001',     // 负责人 ID
  assigneeName: '李明',        // 负责人姓名
  
  // 子任务拆解
  subTasks: [
    {
      title: '微服务架构设计',  // 子任务标题
      type: 'design',          // design | development | test | deploy | review | research
      status: 'done',          // done | in-progress | todo
      assigneeId: 'agent-001', // 负责人
      estimatedHours: 16,      // 预估工时
      // ...
    },
    // 添加更多子任务...
  ],
  
  // 工作详情
  workDetails: {
    objectives: ['目标 1', '目标 2'],     // 工作目标
    deliverables: ['交付物 1', '交付物 2'], // 交付物
    estimatedHours: 160,     // 总预估工时
    progress: 60,            // 进度百分比
  },
},
```

### 步骤 4: 提交并推送

```bash
cd ~/task-board
git add src/data/realTeam.ts
git commit -m "Update real team and task data"
git push
```

### 步骤 5: 等待自动部署

Cloudflare Pages 会自动重新部署（约 1-2 分钟）

访问：https://task-board.pages.dev 查看更新后的数据

---

## 📋 数据字段说明

### 员工字段 (Agent)

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | string | 唯一标识 | 'agent-001' |
| name | string | 姓名 | '李明' |
| role | string | 职位 | '技术架构师' |
| avatar | string | Emoji 头像 | '🏗️' |
| status | string | 状态 | 'online' / 'busy' / 'offline' |
| skills | string[] | 技能标签 | ['Java', 'Spring'] |
| workload | number | 当前工作量 | 4 |
| maxWorkload | number | 最大工作量 | 5 |
| completedTasks | number | 历史完成任务 | 156 |
| successRate | number | 成功率 | 98.2 |

### 任务字段 (WorkItem)

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | string | 唯一标识 | 'task-2024-001' |
| title | string | 任务标题 | '电商平台重构' |
| priority | string | 优先级 | 'urgent' / 'high' / 'medium' / 'low' |
| status | string | 状态 | 'in-progress' / 'todo' / 'done' |
| assigneeId | string | 负责人 ID | 'agent-001' |
| dueDate | string | 截止时间 | ISO 日期格式 |

### 子任务字段 (SubTask)

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| type | string | 任务类型 | 'development' / 'design' / 'test' / 'deploy' / 'review' / 'research' |
| estimatedHours | number | 预估工时 | 16 |
| actualHours | number | 实际工时 | 18 |
| status | string | 状态 | 'done' / 'in-progress' / 'todo' |

---

## 🎨 Emoji 头像推荐

**技术角色**:
- 🏗️ 架构师
- 👨‍💻 开发工程师
- 🎨 设计师
- 🧪 测试工程师
- 🚀 运维工程师
- 📊 产品经理

**其他角色**:
- 📱 移动端开发
- 🌐 前端开发
- ⚙️ 后端开发
- 🔒 安全工程师
- 📈 数据分析师
- 🤖 AI 工程师

---

## ✅ 最佳实践

### 1. 任务拆解原则

- ✅ 每个子任务 8-40 工时
- ✅ 每个子任务有明确交付物
- ✅ 每个子任务有明确负责人
- ✅ 子任务之间有依赖关系

### 2. 工作量分配

- ✅ 员工负载不超过 maxWorkload
- ✅ 根据技能分配任务
- ✅ 平衡团队成员工作量

### 3. 进度跟踪

- ✅ 每日更新子任务状态
- ✅ 记录实际工时
- ✅ 定期更新进度百分比

---

## 🔄 自动更新流程

```
修改 realTeam.ts
    ↓
git commit & push
    ↓
Cloudflare 自动构建
    ↓
1-2 分钟后生效
    ↓
访问网站查看新数据
```

---

## 📞 需要帮助？

查看示例文件：`src/data/realTeam.ts`

或访问：https://task-board.pages.dev 查看效果
