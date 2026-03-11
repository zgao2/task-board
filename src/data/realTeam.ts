/**
 * 真实团队数据配置
 * 
 * 使用说明：
 * 1. 修改这个文件中的真实数据
 * 2. 提交并推送到 GitHub
 * 3. Cloudflare Pages 会自动重新部署（1-2 分钟）
 * 4. 访问网站查看更新后的数据
 */

import { Agent, WorkItem, SubTask, TaskAssignment } from '../types';

// ============================================
// 1. 配置你的真实团队成员
// ============================================

export const realAgents: Agent[] = [
  {
    id: 'agent-001',
    name: '李明',              // 真实姓名
    role: '技术架构师',         // 职位/角色
    avatar: '🏗️',              // Emoji 头像
    status: 'busy',            // online | busy | offline
    completedTasks: 156,       // 历史完成任务数
    successRate: 98.2,         // 成功率（百分比）
    currentTaskId: 'task-2024-001',
    currentWork: null,
    workload: 4,               // 当前工作量（任务数）
    maxWorkload: 5,            // 最大工作量
    skills: ['架构设计', '微服务', '系统规划', '技术评审'],
    dependencies: [],
  },
  {
    id: 'agent-002',
    name: '王芳',
    role: '前端负责人',
    avatar: '🎨',
    status: 'busy',
    completedTasks: 203,
    successRate: 99.1,
    currentTaskId: 'task-2024-002',
    currentWork: null,
    workload: 5,
    maxWorkload: 5,
    skills: ['React', 'Vue', 'TypeScript', 'UI 设计', '性能优化'],
    dependencies: [],
  },
  {
    id: 'agent-003',
    name: '张伟',
    role: '后端工程师',
    avatar: '⚙️',
    status: 'busy',
    completedTasks: 128,
    successRate: 96.8,
    currentTaskId: 'task-2024-003',
    currentWork: null,
    workload: 5,
    maxWorkload: 5,
    skills: ['Java', 'Spring Cloud', 'Redis', 'MySQL', '消息队列'],
    dependencies: [],
  },
  {
    id: 'agent-004',
    name: '刘洋',
    role: '测试工程师',
    avatar: '🧪',
    status: 'online',
    completedTasks: 189,
    successRate: 99.5,
    currentTaskId: null,
    currentWork: null,
    workload: 2,
    maxWorkload: 5,
    skills: ['自动化测试', '性能测试', '测试框架', 'CI/CD'],
    dependencies: [],
  },
  {
    id: 'agent-005',
    name: '陈静',
    role: '运维工程师',
    avatar: '🚀',
    status: 'online',
    completedTasks: 95,
    successRate: 97.3,
    currentTaskId: null,
    currentWork: null,
    workload: 1,
    maxWorkload: 5,
    skills: ['Docker', 'Kubernetes', 'CI/CD', '监控告警', '云服务'],
    dependencies: [],
  },
];

// ============================================
// 2. 配置真实的任务数据
// ============================================

export const realWorkItems: Record<string, WorkItem> = {
  'task-2024-001': {
    id: 'task-2024-001',
    title: '电商平台微服务重构',
    description: '将现有单体应用拆分为用户、订单、支付、库存等微服务模块，提升系统可扩展性和维护性',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'agent-001',
    assigneeName: '李明',
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString(), // 15 天后
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), // 10 天前
    updatedAt: new Date().toISOString(),
    comments: [],
    
    // 任务拆解 - 子任务
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
        dueDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        parentId: 'task-2024-001',
        order: 0,
      } as SubTask,
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
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
        parentId: 'task-2024-001',
        order: 1,
      } as SubTask,
      {
        id: 'subtask-001-3',
        title: '订单服务开发',
        description: '实现订单微服务，包括订单创建、查询、状态流转等功能',
        type: 'development',
        status: 'todo',
        assigneeId: 'agent-003',
        assigneeName: '张伟',
        estimatedHours: 48,
        dueDate: new Date(Date.now() + 12 * 86400000).toISOString(),
        parentId: 'task-2024-001',
        order: 2,
      } as SubTask,
      {
        id: 'subtask-001-4',
        title: '服务集成测试',
        description: '对微服务进行集成测试，确保服务间协作正常',
        type: 'test',
        status: 'todo',
        assigneeId: 'agent-004',
        assigneeName: '刘洋',
        estimatedHours: 24,
        dueDate: new Date(Date.now() + 18 * 86400000).toISOString(),
        parentId: 'task-2024-001',
        order: 3,
      } as SubTask,
      {
        id: 'subtask-001-5',
        title: '部署上线',
        description: '将微服务部署到生产环境',
        type: 'deploy',
        status: 'todo',
        assigneeId: 'agent-005',
        assigneeName: '陈静',
        estimatedHours: 8,
        dueDate: new Date(Date.now() + 20 * 86400000).toISOString(),
        parentId: 'task-2024-001',
        order: 4,
      } as SubTask,
    ],
    
    dependencies: [],
    blockedTasks: ['task-2024-002', 'task-2024-003'],
    
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
        assignedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        workload: 40,
        status: 'in-progress',
      } as TaskAssignment,
      {
        agentId: 'agent-003',
        agentName: '张伟',
        role: '后端工程师',
        assignedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        workload: 88,
        status: 'in-progress',
      } as TaskAssignment,
    ],
  },

  'task-2024-002': {
    id: 'task-2024-002',
    title: '双 11 活动页面开发',
    description: '开发双 11 促销活动页面，包含秒杀、优惠券、拼团、满减等功能模块',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'agent-002',
    assigneeName: '王芳',
    dueDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    
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
        dueDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        parentId: 'task-2024-002',
        order: 0,
      } as SubTask,
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
        dueDate: new Date(Date.now() + 10 * 86400000).toISOString(),
        parentId: 'task-2024-002',
        order: 1,
      } as SubTask,
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
        dueDate: new Date(Date.now() + 8 * 86400000).toISOString(),
        parentId: 'task-2024-002',
        order: 2,
      } as SubTask,
      {
        id: 'subtask-002-4',
        title: '性能压测',
        description: '对秒杀系统进行压力测试',
        type: 'test',
        status: 'todo',
        assigneeId: 'agent-004',
        assigneeName: '刘洋',
        estimatedHours: 16,
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
        parentId: 'task-2024-002',
        order: 3,
      } as SubTask,
    ],
    
    dependencies: [
      { taskId: 'task-2024-001', type: 'blocked_by', description: '等待微服务架构设计完成' },
    ],
    blockedTasks: ['task-2024-005'],
    
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
        assignedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        workload: 44,
        status: 'in-progress',
      } as TaskAssignment,
    ],
  },

  'task-2024-003': {
    id: 'task-2024-003',
    title: '秒杀系统性能优化',
    description: '优化秒杀系统性能，包括 Redis 缓存、消息队列、限流降级等策略',
    status: 'in-progress',
    priority: 'urgent',
    assigneeId: 'agent-003',
    assigneeName: '张伟',
    dueDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    
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
        dueDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        parentId: 'task-2024-003',
        order: 0,
      } as SubTask,
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
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
        parentId: 'task-2024-003',
        order: 1,
      } as SubTask,
      {
        id: 'subtask-003-3',
        title: '限流降级实现',
        description: '实现限流和降级策略',
        type: 'development',
        status: 'todo',
        assigneeId: 'agent-003',
        assigneeName: '张伟',
        estimatedHours: 12,
        dueDate: new Date(Date.now() + 8 * 86400000).toISOString(),
        parentId: 'task-2024-003',
        order: 2,
      } as SubTask,
      {
        id: 'subtask-003-4',
        title: '全链路压测',
        description: '执行全链路压力测试',
        type: 'test',
        status: 'todo',
        assigneeId: 'agent-004',
        assigneeName: '刘洋',
        estimatedHours: 16,
        dueDate: new Date(Date.now() + 12 * 86400000).toISOString(),
        parentId: 'task-2024-003',
        order: 3,
      } as SubTask,
    ],
    
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
    assignments: [
      {
        agentId: 'agent-003',
        agentName: '张伟',
        role: '后端工程师',
        assignedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        workload: 36,
        status: 'in-progress',
      } as TaskAssignment,
    ],
  },
};

// ============================================
// 3. 更新员工当前工作引用
// ============================================

realAgents.forEach(agent => {
  if (agent.currentTaskId && realWorkItems[agent.currentTaskId]) {
    agent.currentWork = realWorkItems[agent.currentTaskId];
  }
});

// ============================================
// 4. 添加员工依赖关系
// ============================================

realAgents[0].dependencies = [
  {
    agentId: 'agent-003',
    agentName: '张伟',
    type: 'collaborating',
    taskId: 'task-2024-001',
    taskTitle: '电商平台微服务重构',
    description: '协作完成服务开发',
  },
];

realAgents[1].dependencies = [
  {
    agentId: 'agent-003',
    agentName: '张伟',
    type: 'waiting_for',
    taskId: 'task-2024-002',
    taskTitle: '双 11 活动页面开发',
    description: '等待秒杀接口完成',
  },
];

realAgents[2].dependencies = [
  {
    agentId: 'agent-001',
    agentName: '李明',
    type: 'waiting_for',
    taskId: 'task-2024-001',
    taskTitle: '电商平台微服务重构',
    description: '等待架构设计评审',
  },
];
