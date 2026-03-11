import { Task, Agent, Comment, AgentStatus, WorkItem, AgentDependency, TaskAssignment, TaskTemplate } from '../types';
import { realAgents, realWorkItems } from '../data/realTeam';

// 生成唯一 ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 生成日期
const daysFromNow = (days: number) => new Date(Date.now() + days * 86400000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

// ============================================
// 任务模板库（用于快速拆解任务）
// ============================================

export const taskTemplates: TaskTemplate[] = [
  {
    id: 'template-feature',
    name: '功能开发',
    description: '标准功能开发流程',
    defaultSubTasks: [
      { title: '需求分析', description: '分析业务需求，输出需求文档', type: 'research', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 4, dueDate: '', order: 0 },
      { title: '技术方案设计', description: '设计技术实现方案', type: 'design', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 8, dueDate: '', order: 1 },
      { title: '编码实现', description: '完成功能代码开发', type: 'development', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 24, dueDate: '', order: 2 },
      { title: '单元测试', description: '编写并执行单元测试', type: 'test', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 8, dueDate: '', order: 3 },
      { title: '代码审查', description: '进行代码 Review', type: 'review', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 4, dueDate: '', order: 4 },
      { title: '部署上线', description: '部署到生产环境', type: 'deploy', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 2, dueDate: '', order: 5 },
    ],
    defaultWorkload: 50,
  },
  {
    id: 'template-bugfix',
    name: 'Bug 修复',
    description: '标准 Bug 修复流程',
    defaultSubTasks: [
      { title: '问题定位', description: '分析 Bug 原因', type: 'research', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 2, dueDate: '', order: 0 },
      { title: '修复方案', description: '制定修复方案', type: 'design', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 2, dueDate: '', order: 1 },
      { title: '代码修复', description: '实现 Bug 修复', type: 'development', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 4, dueDate: '', order: 2 },
      { title: '回归测试', description: '验证修复效果', type: 'test', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 2, dueDate: '', order: 3 },
    ],
    defaultWorkload: 10,
  },
  {
    id: 'template-release',
    name: '版本发布',
    description: '标准版本发布流程',
    defaultSubTasks: [
      { title: '版本规划', description: '确定发布内容和时间', type: 'research', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 4, dueDate: '', order: 0 },
      { title: '代码冻结', description: '合并代码并冻结', type: 'deploy', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 2, dueDate: '', order: 1 },
      { title: '集成测试', description: '执行集成测试', type: 'test', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 8, dueDate: '', order: 2 },
      { title: '发布部署', description: '部署到生产环境', type: 'deploy', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 4, dueDate: '', order: 3 },
      { title: '验证发布', description: '验证发布结果', type: 'test', status: 'todo', assigneeId: null, assigneeName: null, estimatedHours: 2, dueDate: '', order: 4 },
    ],
    defaultWorkload: 20,
  },
];

// ============================================
// Mock 评论数据
// ============================================

const mockComments: Comment[] = [
  {
    id: generateId(),
    taskId: 'task-001',
    authorId: 'agent-001',
    authorName: '李明',
    content: '微服务架构设计已完成初稿，本周四组织评审会议，请大家提前准备意见。',
    createdAt: daysAgo(2),
  },
  {
    id: generateId(),
    taskId: 'task-001',
    authorId: 'agent-003',
    authorName: '张伟',
    content: '已阅读架构设计文档，有几个问题需要在评审会上讨论：1. 服务间通信协议选择 2. 数据一致性方案',
    createdAt: daysAgo(1),
  },
  {
    id: generateId(),
    taskId: 'task-002',
    authorId: 'agent-002',
    authorName: '王芳',
    content: '双 11 活动页面 UI 已开发完成 60%，秒杀功能的后端接口需要尽快提供。',
    createdAt: daysAgo(0.5),
  },
  {
    id: generateId(),
    taskId: 'task-003',
    authorId: 'agent-003',
    authorName: '张伟',
    content: 'Redis 缓存预热方案已实现，初步压测结果显示 QPS 从 1000 提升到 8000，继续优化中。',
    createdAt: new Date().toISOString(),
  },
];

// ============================================
// 完整的工作项数据（包含任务拆解和员工映射）
// ============================================

const workItems: Record<string, WorkItem> = {
  'task-001': {
    id: 'task-001',
    title: '电商平台微服务重构',
    description: '将现有单体应用拆分为用户、订单、支付、库存等微服务模块，提升系统可扩展性和维护性',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'agent-001',
    assigneeName: '李明',
    dueDate: daysFromNow(15),
    createdAt: daysAgo(10),
    updatedAt: new Date().toISOString(),
    comments: mockComments.filter(c => c.taskId === 'task-001'),
    
    // 任务拆解
    subTasks: [
      {
        id: 'subtask-001-1',
        title: '微服务架构设计',
        description: '设计微服务拆分方案，包括服务边界、通信协议、数据一致性等',
        type: 'design',
        status: 'done',
        assigneeId: 'agent-001',
        assigneeName: '李明',
        estimatedHours: 16,
        actualHours: 18,
        dueDate: daysAgo(3),
        parentId: 'task-001',
        order: 0,
      },
      {
        id: 'subtask-001-2',
        title: '用户服务开发',
        description: '实现用户微服务，包括用户管理、认证授权等功能',
        type: 'development',
        status: 'in-progress',
        assigneeId: 'agent-003',
        assigneeName: '张伟',
        estimatedHours: 40,
        actualHours: 25,
        dueDate: daysFromNow(5),
        parentId: 'task-001',
        order: 1,
      },
      {
        id: 'subtask-001-3',
        title: '订单服务开发',
        description: '实现订单微服务，包括订单创建、查询、状态流转等功能',
        type: 'development',
        status: 'todo',
        assigneeId: 'agent-003',
        assigneeName: '张伟',
        estimatedHours: 48,
        dueDate: daysFromNow(12),
        parentId: 'task-001',
        order: 2,
      },
      {
        id: 'subtask-001-4',
        title: '服务集成测试',
        description: '对微服务进行集成测试，确保服务间协作正常',
        type: 'test',
        status: 'todo',
        assigneeId: 'agent-004',
        assigneeName: '刘洋',
        estimatedHours: 24,
        dueDate: daysFromNow(18),
        parentId: 'task-001',
        order: 3,
      },
      {
        id: 'subtask-001-5',
        title: '部署上线',
        description: '将微服务部署到生产环境',
        type: 'deploy',
        status: 'todo',
        assigneeId: 'agent-005',
        assigneeName: '陈静',
        estimatedHours: 8,
        dueDate: daysFromNow(20),
        parentId: 'task-001',
        order: 4,
      },
    ],
    
    dependencies: [],
    blockedTasks: ['task-002', 'task-003'],
    
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
        '部署架构图',
      ],
      requirements: [
        '现有系统架构图',
        '业务需求文档',
      ],
      estimatedHours: 160,
      actualHours: 95,
      progress: 60,
    },
    
    collaborators: ['agent-002', 'agent-003', 'agent-005'],
    
    assignments: [
      {
        agentId: 'agent-001',
        agentName: '李明',
        role: '技术架构师',
        assignedAt: daysAgo(10),
        workload: 40,
        status: 'in-progress',
      },
      {
        agentId: 'agent-003',
        agentName: '张伟',
        role: '后端工程师',
        assignedAt: daysAgo(5),
        workload: 88,
        status: 'in-progress',
      },
    ] as TaskAssignment[],
  },

  'task-002': {
    id: 'task-002',
    title: '双 11 活动页面开发',
    description: '开发双 11 促销活动页面，包含秒杀、优惠券、拼团、满减等功能模块',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'agent-002',
    assigneeName: '王芳',
    dueDate: daysFromNow(20),
    createdAt: daysAgo(7),
    updatedAt: new Date().toISOString(),
    comments: mockComments.filter(c => c.taskId === 'task-002'),
    
    subTasks: [
      {
        id: 'subtask-002-1',
        title: 'UI 设计稿评审',
        description: '评审活动页面 UI 设计稿',
        type: 'review',
        status: 'done',
        assigneeId: 'agent-002',
        assigneeName: '王芳',
        estimatedHours: 4,
        actualHours: 4,
        dueDate: daysAgo(5),
        parentId: 'task-002',
        order: 0,
      },
      {
        id: 'subtask-002-2',
        title: '活动页面前端开发',
        description: '实现活动页面前端交互和样式',
        type: 'development',
        status: 'in-progress',
        assigneeId: 'agent-002',
        assigneeName: '王芳',
        estimatedHours: 40,
        actualHours: 24,
        dueDate: daysFromNow(10),
        parentId: 'task-002',
        order: 1,
      },
      {
        id: 'subtask-002-3',
        title: '秒杀接口开发',
        description: '实现秒杀功能后端接口',
        type: 'development',
        status: 'in-progress',
        assigneeId: 'agent-003',
        assigneeName: '张伟',
        estimatedHours: 24,
        actualHours: 16,
        dueDate: daysFromNow(8),
        parentId: 'task-002',
        order: 2,
      },
      {
        id: 'subtask-002-4',
        title: '性能压测',
        description: '对秒杀系统进行压力测试',
        type: 'test',
        status: 'todo',
        assigneeId: 'agent-004',
        assigneeName: '刘洋',
        estimatedHours: 16,
        dueDate: daysFromNow(15),
        parentId: 'task-002',
        order: 3,
      },
    ],
    
    dependencies: [
      { taskId: 'task-001', type: 'blocked_by', description: '等待微服务架构设计完成' },
    ],
    blockedTasks: ['task-005'],
    
    workDetails: {
      objectives: [
        '完成活动页 UI 开发',
        '实现秒杀功能',
        '实现优惠券系统',
        '性能优化（支持 10 万 QPS）',
      ],
      deliverables: [
        '活动页面',
        '后台管理系统',
        '性能测试报告',
      ],
      requirements: [
        '产品需求文档',
        'UI 设计稿',
      ],
      estimatedHours: 200,
      actualHours: 120,
      progress: 60,
    },
    
    collaborators: ['agent-003', 'agent-004'],
    
    assignments: [
      {
        agentId: 'agent-002',
        agentName: '王芳',
        role: '前端负责人',
        assignedAt: daysAgo(7),
        workload: 44,
        status: 'in-progress',
      },
      {
        agentId: 'agent-003',
        agentName: '张伟',
        role: '后端工程师',
        assignedAt: daysAgo(3),
        workload: 24,
        status: 'in-progress',
      },
    ] as TaskAssignment[],
  },

  'task-003': {
    id: 'task-003',
    title: '秒杀系统性能优化',
    description: '优化秒杀系统性能，包括 Redis 缓存、消息队列、限流降级等策略',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'agent-003',
    assigneeName: '张伟',
    dueDate: daysFromNow(12),
    createdAt: daysAgo(5),
    updatedAt: new Date().toISOString(),
    comments: mockComments.filter(c => c.taskId === 'task-003'),
    
    subTasks: [
      {
        id: 'subtask-003-1',
        title: 'Redis 缓存预热',
        description: '实现 Redis 缓存预热方案',
        type: 'development',
        status: 'done',
        assigneeId: 'agent-003',
        assigneeName: '张伟',
        estimatedHours: 8,
        actualHours: 10,
        dueDate: daysAgo(2),
        parentId: 'task-003',
        order: 0,
      },
      {
        id: 'subtask-003-2',
        title: '消息队列接入',
        description: '接入消息队列进行削峰填谷',
        type: 'development',
        status: 'in-progress',
        assigneeId: 'agent-003',
        assigneeName: '张伟',
        estimatedHours: 16,
        actualHours: 8,
        dueDate: daysFromNow(5),
        parentId: 'task-003',
        order: 1,
      },
      {
        id: 'subtask-003-3',
        title: '限流降级实现',
        description: '实现限流和降级策略',
        type: 'development',
        status: 'todo',
        assigneeId: 'agent-003',
        assigneeName: '张伟',
        estimatedHours: 12,
        dueDate: daysFromNow(8),
        parentId: 'task-003',
        order: 2,
      },
      {
        id: 'subtask-003-4',
        title: '全链路压测',
        description: '执行全链路压力测试',
        type: 'test',
        status: 'todo',
        assigneeId: 'agent-004',
        assigneeName: '刘洋',
        estimatedHours: 16,
        dueDate: daysFromNow(12),
        parentId: 'task-003',
        order: 3,
      },
    ],
    
    dependencies: [
      { taskId: 'task-001', type: 'blocked_by', description: '等待微服务架构完成' },
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
    
    assignments: [
      {
        agentId: 'agent-003',
        agentName: '张伟',
        role: '后端工程师',
        assignedAt: daysAgo(5),
        workload: 36,
        status: 'in-progress',
      },
    ] as TaskAssignment[],
  },
};

// ============================================
// Mock 数字员工数据（使用 realTeam 的真实数据）
// ============================================

export const mockAgents: Agent[] = realAgents;

// ============================================
// Mock 任务数据（合并旧项目和营销助手项目）
// ============================================

export const mockTasks: Task[] = [
  // 旧项目任务
  ...Object.values(workItems).map(item => ({
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
    comments: item.comments,
  })),
  // 营销助手项目任务
  ...Object.values(realWorkItems).filter(item => item.id.startsWith('task-marketing')).map(item => ({
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
    comments: item.comments,
  })),
];

// ============================================
// 辅助函数
// ============================================

export const getWorkItem = (taskId: string): WorkItem | undefined => {
  return workItems[taskId];
};

export const getAllWorkItems = (): WorkItem[] => {
  return Object.values(workItems);
};

export const getTaskTemplates = (): TaskTemplate[] => {
  return taskTemplates;
};

// 模拟实时更新
export const simulateRealTimeUpdates = (
  callback: (agents: Agent[], tasks: Task[]) => void
) => {
  const agents = [...mockAgents];
  const tasks = [...mockTasks];

  const interval = setInterval(() => {
    // 模拟状态变化
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const statuses: AgentStatus[] = ['online', 'offline', 'busy'];
    randomAgent.status = statuses[Math.floor(Math.random() * statuses.length)];

    callback(agents, tasks);
  }, 10000);

  return () => clearInterval(interval);
};
