/**
 * 真实数据示例 - 典型互联网软件开发团队
 * 
 * 使用说明：
 * 1. 复制此文件为 realData.ts
 * 2. 根据实际情况修改数据
 * 3. 在 mockData.ts 中导入使用
 */

import { Task, Agent, Comment, AgentStatus, WorkItem, AgentDependency } from '../types';

// 生成唯一 ID（实际使用时可以用 UUID）
const generateId = () => Math.random().toString(36).substr(2, 9);

// 日期辅助函数
const daysFromNow = (days: number) => new Date(Date.now() + days * 86400000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

// ============================================
// 1. 定义你的数字员工（真实团队成员）
// ============================================

export const realAgents: Agent[] = [
  {
    id: 'agent-001',
    name: '李明',
    role: '技术架构师',
    avatar: '🏗️',
    status: 'busy',
    completedTasks: 156,
    successRate: 98.2,
    currentTaskId: 'task-2024-001',
    currentWork: null, // 会在 workItems 中设置
    workload: 4,
    dependencies: [],
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
    currentWork: null,
    workload: 5,
    dependencies: [],
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
    currentWork: null,
    workload: 3,
    dependencies: [],
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
    currentWork: null,
    workload: 6,
    dependencies: [],
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
    currentWork: null,
    workload: 0,
    dependencies: [],
  },
  {
    id: 'agent-006',
    name: '赵强',
    role: '产品经理',
    avatar: '📊',
    status: 'online',
    completedTasks: 78,
    successRate: 95.5,
    currentTaskId: 'task-2024-015',
    currentWork: null,
    workload: 4,
    dependencies: [],
  },
];

// ============================================
// 2. 定义真实任务（工作项）
// ============================================

export const realWorkItems: Record<string, WorkItem> = {
  // ===== 项目 1: 电商平台重构 =====
  'task-2024-001': {
    id: 'task-2024-001',
    title: '电商平台微服务重构',
    description: '将现有单体应用拆分为用户、订单、支付、库存等微服务模块，提升系统可扩展性和维护性',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'agent-001',
    assigneeName: '李明',
    dueDate: daysFromNow(15),
    createdAt: daysAgo(10),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [],
    blockedTasks: ['task-2024-002', 'task-2024-003', 'task-2024-008'],
    workDetails: {
      objectives: [
        '完成微服务架构设计',
        '搭建服务基础设施（服务发现、配置中心）',
        '拆分用户服务',
        '拆分订单服务',
        '制定数据迁移方案',
      ],
      deliverables: [
        '微服务架构设计文档',
        '技术选型报告',
        '服务拆分方案',
        '部署架构图',
      ],
      requirements: [
        '现有系统架构图',
        '业务需求文档',
        '性能指标要求',
      ],
      estimatedHours: 160,
      actualHours: 95,
      progress: 60,
    },
    collaborators: ['agent-002', 'agent-003', 'agent-005'],
  },

  'task-2024-002': {
    id: 'task-2024-002',
    title: '用户中心前端重构',
    description: '基于新的微服务架构，重构用户中心前端页面，支持多租户和 SSO 单点登录',
    status: 'todo',
    priority: 'high',
    assigneeId: 'agent-002',
    assigneeName: '王芳',
    dueDate: daysFromNow(25),
    createdAt: daysAgo(5),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-2024-001', type: 'blocked_by', description: '等待微服务架构设计完成' },
    ],
    blockedTasks: ['task-2024-010'],
    workDetails: {
      objectives: [
        '实现多租户 UI 框架',
        '集成 OAuth2.0 SSO',
        '开发用户管理页面',
        '适配移动端',
      ],
      deliverables: [
        '用户中心前端代码',
        '组件文档',
        '使用手册',
      ],
      requirements: [
        '微服务 API 文档',
        'UI 设计稿',
        '多租户需求说明',
      ],
      estimatedHours: 120,
      progress: 0,
    },
    collaborators: ['agent-001', 'agent-003'],
  },

  'task-2024-003': {
    id: 'task-2024-003',
    title: '订单服务开发',
    description: '开发订单微服务，支持订单创建、查询、取消、退款等核心功能',
    status: 'todo',
    priority: 'high',
    assigneeId: 'agent-003',
    assigneeName: '张伟',
    dueDate: daysFromNow(30),
    createdAt: daysAgo(3),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-2024-001', type: 'blocked_by', description: '等待微服务架构确定' },
    ],
    blockedTasks: ['task-2024-012'],
    workDetails: {
      objectives: [
        '设计订单数据模型',
        '实现订单 CRUD 接口',
        '集成支付服务',
        '实现订单状态机',
      ],
      deliverables: [
        '订单服务代码',
        'API 文档',
        '单元测试',
      ],
      requirements: [
        '订单业务流程',
        '数据库设计文档',
      ],
      estimatedHours: 100,
      progress: 0,
    },
    collaborators: ['agent-001', 'agent-004'],
  },

  // ===== 项目 2: 双 11 活动准备 =====
  'task-2024-005': {
    id: 'task-2024-005',
    title: '双 11 活动页面开发',
    description: '开发双 11 促销活动页面，包含秒杀、优惠券、拼团、满减等功能模块',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'agent-002',
    assigneeName: '王芳',
    dueDate: daysFromNow(20),
    createdAt: daysAgo(7),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [],
    blockedTasks: ['task-2024-011'],
    workDetails: {
      objectives: [
        '完成活动页 UI 开发',
        '实现秒杀功能',
        '实现优惠券系统',
        '实现拼团功能',
        '性能优化（支持 10 万 QPS）',
      ],
      deliverables: [
        '活动页面',
        '后台管理系统',
        '监控大盘',
        '性能测试报告',
      ],
      requirements: [
        '产品需求文档',
        'UI 设计稿',
        '流量预估',
      ],
      estimatedHours: 200,
      actualHours: 120,
      progress: 60,
    },
    collaborators: ['agent-003', 'agent-004', 'agent-005'],
  },

  'task-2024-008': {
    id: 'task-2024-008',
    title: '秒杀系统性能优化',
    description: '优化秒杀系统性能，包括 Redis 缓存、消息队列、限流降级等策略',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'agent-003',
    assigneeName: '张伟',
    dueDate: daysFromNow(12),
    createdAt: daysAgo(5),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-2024-001', type: 'blocked_by', description: '等待微服务架构完成' },
    ],
    blockedTasks: [],
    workDetails: {
      objectives: [
        '实现 Redis 缓存预热',
        '接入消息队列削峰',
        '实现限流降级',
        '压力测试',
      ],
      deliverables: [
        '性能优化方案',
        '压测报告',
        '监控告警配置',
      ],
      requirements: [
        '秒杀业务流程',
        '预期 QPS 指标',
      ],
      estimatedHours: 80,
      actualHours: 50,
      progress: 65,
    },
    collaborators: ['agent-001', 'agent-005'],
  },

  // ===== 项目 3: 质量保障 =====
  'task-2024-010': {
    id: 'task-2024-010',
    title: '自动化测试覆盖率提升',
    description: '提升核心业务模块的自动化测试覆盖率到 80% 以上，接入 CI/CD 流水线',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: 'agent-004',
    assigneeName: '刘洋',
    dueDate: daysFromNow(18),
    createdAt: daysAgo(8),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-2024-002', type: 'blocked_by', description: '等待用户中心前端完成' },
    ],
    blockedTasks: [],
    workDetails: {
      objectives: [
        '分析现有测试覆盖率',
        '编写单元测试（目标 80%）',
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
      estimatedHours: 80,
      actualHours: 45,
      progress: 55,
    },
    collaborators: ['agent-002', 'agent-003'],
  },

  'task-2024-011': {
    id: 'task-2024-011',
    title: '全链路压测',
    description: '对电商平台进行全链路压力测试，发现性能瓶颈并优化',
    status: 'todo',
    priority: 'high',
    assigneeId: 'agent-004',
    assigneeName: '刘洋',
    dueDate: daysFromNow(25),
    createdAt: daysAgo(2),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-2024-005', type: 'blocked_by', description: '等待活动页面完成' },
    ],
    blockedTasks: [],
    workDetails: {
      objectives: [
        '制定压测方案',
        '准备压测数据',
        '执行压测',
        '性能瓶颈分析与优化',
      ],
      deliverables: [
        '压测方案',
        '压测报告',
        '优化建议',
      ],
      requirements: [
        '生产环境配置',
        '压测工具',
      ],
      estimatedHours: 60,
      progress: 0,
    },
    collaborators: ['agent-001', 'agent-003', 'agent-005'],
  },

  // ===== 项目 4: 基础设施 =====
  'task-2024-012': {
    id: 'task-2024-012',
    title: 'Kubernetes 集群迁移',
    description: '将现有服务从 ECS 迁移到 Kubernetes 集群，提升运维效率和系统稳定性',
    status: 'todo',
    priority: 'medium',
    assigneeId: 'agent-005',
    assigneeName: '陈静',
    dueDate: daysFromNow(35),
    createdAt: daysAgo(1),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-2024-003', type: 'blocked_by', description: '等待订单服务完成' },
    ],
    blockedTasks: [],
    workDetails: {
      objectives: [
        '搭建 K8s 集群',
        '编写 Dockerfile 和 Helm Chart',
        '迁移服务',
        '配置监控告警',
      ],
      deliverables: [
        'K8s 集群',
        '部署文档',
        '监控大盘',
      ],
      requirements: [
        '服务清单',
        '资源配置要求',
      ],
      estimatedHours: 120,
      progress: 0,
    },
    collaborators: ['agent-001', 'agent-003'],
  },

  'task-2024-015': {
    id: 'task-2024-015',
    title: '产品需求评审 - Q2 版本',
    description: '评审 Q2 版本的产品需求，确定优先级和排期',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'agent-006',
    assigneeName: '赵强',
    dueDate: daysFromNow(7),
    createdAt: daysAgo(3),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [],
    blockedTasks: ['task-2024-016', 'task-2024-017'],
    workDetails: {
      objectives: [
        '收集业务需求',
        '编写 PRD 文档',
        '组织评审会议',
        '确定开发排期',
      ],
      deliverables: [
        '产品需求文档',
        '原型图',
        '评审纪要',
      ],
      requirements: [
        '业务方需求',
        '竞品分析',
      ],
      estimatedHours: 40,
      actualHours: 25,
      progress: 65,
    },
    collaborators: ['agent-001', 'agent-002'],
  },
};

// ============================================
// 3. 配置员工依赖关系
// ============================================

// 在 realAgents 中设置 dependencies 和 currentWork
realAgents.forEach(agent => {
  if (agent.currentTaskId && realWorkItems[agent.currentTaskId]) {
    agent.currentWork = realWorkItems[agent.currentTaskId];
  }
});

// 设置依赖关系
realAgents[0].dependencies = [
  {
    agentId: 'agent-002',
    agentName: '王芳',
    type: 'collaborating',
    taskId: 'task-2024-001',
    taskTitle: '电商平台微服务重构',
    description: '共同完成架构设计',
  },
  {
    agentId: 'agent-003',
    agentName: '张伟',
    type: 'collaborating',
    taskId: 'task-2024-001',
    taskTitle: '电商平台微服务重构',
    description: '协助服务拆分',
  },
] as AgentDependency[];

realAgents[1].dependencies = [
  {
    agentId: 'agent-001',
    agentName: '李明',
    type: 'waiting_for',
    taskId: 'task-2024-002',
    taskTitle: '用户中心前端重构',
    description: '等待微服务架构设计完成',
  },
  {
    agentId: 'agent-003',
    agentName: '张伟',
    type: 'collaborating',
    taskId: 'task-2024-005',
    taskTitle: '双 11 活动页面开发',
    description: '协作开发后端接口',
  },
] as AgentDependency[];

realAgents[2].dependencies = [
  {
    agentId: 'agent-001',
    agentName: '李明',
    type: 'waiting_for',
    taskId: 'task-2024-003',
    taskTitle: '订单服务开发',
    description: '等待微服务架构确定',
  },
  {
    agentId: 'agent-004',
    agentName: '刘洋',
    type: 'collaborating',
    taskId: 'task-2024-003',
    taskTitle: '订单服务开发',
    description: '协作进行测试',
  },
] as AgentDependency[];

realAgents[3].dependencies = [
  {
    agentId: 'agent-002',
    agentName: '王芳',
    type: 'waiting_for',
    taskId: 'task-2024-010',
    taskTitle: '自动化测试覆盖率提升',
    description: '等待用户中心前端完成',
  },
] as AgentDependency[];

// ============================================
// 4. 评论数据
// ============================================

export const realComments: Comment[] = [
  {
    id: generateId(),
    taskId: 'task-2024-001',
    authorId: 'agent-001',
    authorName: '李明',
    content: '微服务架构设计已完成初稿，本周四组织评审会议，请大家提前准备意见。',
    createdAt: daysAgo(2),
  },
  {
    id: generateId(),
    taskId: 'task-2024-001',
    authorId: 'agent-003',
    authorName: '张伟',
    content: '已阅读架构设计文档，有几个问题需要在评审会上讨论：1. 服务间通信协议选择 2. 数据一致性方案',
    createdAt: daysAgo(1),
  },
  {
    id: generateId(),
    taskId: 'task-2024-005',
    authorId: 'agent-002',
    authorName: '王芳',
    content: '双 11 活动页面 UI 已开发完成 60%，秒杀功能的后端接口需要尽快提供。',
    createdAt: daysAgo(0.5),
  },
  {
    id: generateId(),
    taskId: 'task-2024-008',
    authorId: 'agent-003',
    authorName: '张伟',
    content: 'Redis 缓存预热方案已实现，初步压测结果显示 QPS 从 1000 提升到 8000，继续优化中。',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    taskId: 'task-2024-015',
    authorId: 'agent-006',
    authorName: '赵强',
    content: 'Q2 版本需求文档已更新，请各负责人查看并评估工作量，明天下午 2 点评审会。',
    createdAt: daysAgo(1),
  },
];

// ============================================
// 5. 导出为 Tasks 格式（兼容现有代码）
// ============================================

export const realTasks: Task[] = Object.values(realWorkItems).map(item => ({
  id: item.id,
  title: item.title,
  description: item.description,
  status: item.status,
  priority: item.priority,
  assigneeId: item.assigneeId,
  assigneeName: item.assigneeName,
  dueDate: item.dueDate,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  comments: realComments.filter(c => c.taskId === item.id),
}));

// ============================================
// 6. 辅助函数
// ============================================

export const getWorkItem = (taskId: string): WorkItem | undefined => {
  return realWorkItems[taskId];
};

export const getAllWorkItems = (): WorkItem[] => {
  return Object.values(realWorkItems);
};

// 模拟实时更新（实际使用时可以对接真实 API）
export const simulateRealTimeUpdates = (
  callback: (agents: Agent[], tasks: Task[]) => void
) => {
  const agents = [...realAgents];
  const tasks = [...realTasks];

  const interval = setInterval(() => {
    // 模拟状态变化
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const statuses: AgentStatus[] = ['online', 'offline', 'busy'];
    randomAgent.status = statuses[Math.floor(Math.random() * statuses.length)];

    // 模拟任务进度更新
    if (Math.random() > 0.7) {
      const randomTask = tasks.find(t => t.status === 'in-progress');
      if (randomTask) {
        const workItem = realWorkItems[randomTask.id];
        if (workItem) {
          workItem.workDetails.progress = Math.min(100, workItem.workDetails.progress + 5);
          randomTask.updatedAt = new Date().toISOString();
        }
      }
    }

    callback(agents, tasks);
  }, 10000); // 每 10 秒更新一次

  return () => clearInterval(interval);
};
