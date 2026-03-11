import { Task, Agent, Comment, AgentStatus, WorkItem, AgentDependency } from '../types';
// 导入真实数据（取消注释以使用真实数据）
// import { realAgents, realTasks, realWorkItems, realComments, getWorkItem, getAllWorkItems } from './realData';

// 生成唯一 ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 生成日期
const daysFromNow = (days: number) => new Date(Date.now() + days * 86400000).toISOString();
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

// Mock 评论数据
const mockComments: Comment[] = [
  {
    id: generateId(),
    taskId: 'task-1',
    authorId: 'agent-1',
    authorName: 'ArchitectBot',
    content: '这个任务需要仔细设计架构，我会先输出技术方案。',
    createdAt: daysAgo(2),
  },
  {
    id: generateId(),
    taskId: 'task-1',
    authorId: 'agent-2',
    authorName: 'DevBot',
    content: '技术方案已 reviewed，可以开始开发了。',
    createdAt: daysAgo(1),
  },
  {
    id: generateId(),
    taskId: 'task-2',
    authorId: 'agent-3',
    authorName: 'TestBot',
    content: '测试用例已编写完成，等待代码提交。',
    createdAt: daysAgo(1.5),
  },
  {
    id: generateId(),
    taskId: 'task-3',
    authorId: 'agent-1',
    authorName: 'ArchitectBot',
    content: '数据库设计文档已更新，请参考最新版 schema。',
    createdAt: daysAgo(0.5),
  },
];

// 完整的工作项数据（包含依赖关系和详情）
const workItems: Record<string, WorkItem> = {
  'task-1': {
    id: 'task-1',
    title: '设计微服务架构',
    description: '为新的电商平台设计微服务架构，包括服务拆分、API 网关、服务发现等核心组件。需要考虑高可用性和可扩展性。',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'agent-1',
    assigneeName: 'ArchitectBot',
    dueDate: daysFromNow(3),
    createdAt: daysAgo(5),
    updatedAt: new Date().toISOString(),
    comments: mockComments.filter(c => c.taskId === 'task-1'),
    dependencies: [],
    blockedTasks: ['task-2', 'task-3', 'task-7'],
    workDetails: {
      objectives: [
        '完成服务拆分方案设计',
        '设计 API 网关架构',
        '选定服务发现方案',
        '输出技术文档',
      ],
      deliverables: [
        '微服务架构设计文档',
        '服务拆分方案',
        'API 网关技术方案',
      ],
      requirements: [
        '了解业务需求',
        '评估现有技术栈',
      ],
      estimatedHours: 40,
      actualHours: 28,
      progress: 70,
    },
    collaborators: ['agent-2', 'agent-4'],
  },
  'task-2': {
    id: 'task-2',
    title: '实现用户认证模块',
    description: '实现基于 JWT 的用户认证系统，支持登录、注册、刷新令牌等功能。需要集成 OAuth2.0 支持第三方登录。',
    status: 'todo',
    priority: 'urgent',
    assigneeId: 'agent-2',
    assigneeName: 'DevBot',
    dueDate: daysFromNow(2),
    createdAt: daysAgo(3),
    updatedAt: new Date().toISOString(),
    comments: mockComments.filter(c => c.taskId === 'task-2'),
    dependencies: [
      { taskId: 'task-1', type: 'blocked_by', description: '需要架构设计完成后才能开始' },
    ],
    blockedTasks: ['task-9'],
    workDetails: {
      objectives: [
        '实现 JWT 认证系统',
        '支持 OAuth2.0 第三方登录',
        '实现令牌刷新机制',
      ],
      deliverables: [
        '认证模块代码',
        'API 接口文档',
        '单元测试用例',
      ],
      requirements: [
        '微服务架构设计完成',
        '数据库 schema 确定',
      ],
      estimatedHours: 24,
      progress: 0,
    },
    collaborators: ['agent-1', 'agent-3'],
  },
  'task-3': {
    id: 'task-3',
    title: '数据库性能优化',
    description: '分析现有数据库查询性能，优化慢查询，添加必要的索引。目标是将平均响应时间降低 50%。',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'agent-2',
    assigneeName: 'DevBot',
    dueDate: daysFromNow(5),
    createdAt: daysAgo(4),
    updatedAt: new Date().toISOString(),
    comments: mockComments.filter(c => c.taskId === 'task-3'),
    dependencies: [
      { taskId: 'task-1', type: 'blocked_by', description: '需要架构设计确定数据库选型' },
    ],
    blockedTasks: [],
    workDetails: {
      objectives: [
        '分析慢查询日志',
        '优化 Top 10 慢查询',
        '添加必要索引',
        '性能基准测试',
      ],
      deliverables: [
        '性能分析报告',
        '优化方案文档',
        '索引设计文档',
      ],
      requirements: [
        '生产环境查询日志',
        '性能监控数据',
      ],
      estimatedHours: 16,
      actualHours: 10,
      progress: 60,
    },
    collaborators: ['agent-1'],
  },
  'task-5': {
    id: 'task-5',
    title: '设计 UI 组件库',
    description: '基于 Ant Design 设计并实现一套业务组件库，包括表格、表单、图表等常用组件。',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: 'agent-5',
    assigneeName: 'DesignBot',
    dueDate: daysFromNow(10),
    createdAt: daysAgo(6),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-1', type: 'related', description: '参考架构设计中的前端规范' },
    ],
    blockedTasks: ['task-4'],
    workDetails: {
      objectives: [
        '设计组件库架构',
        '实现核心业务组件',
        '编写组件文档',
        '建立组件测试体系',
      ],
      deliverables: [
        'UI 组件库代码',
        '组件使用文档',
        'Storybook 示例',
      ],
      requirements: [
        'Ant Design 基础',
        '业务需求分析',
      ],
      estimatedHours: 60,
      actualHours: 35,
      progress: 55,
    },
    collaborators: ['agent-2'],
  },
  'task-4': {
    id: 'task-4',
    title: '编写 API 文档',
    description: '使用 OpenAPI 3.0 规范编写完整的 API 文档，包括所有端点的请求/响应示例和错误码说明。',
    status: 'todo',
    priority: 'medium',
    assigneeId: null,
    assigneeName: null,
    dueDate: daysFromNow(7),
    createdAt: daysAgo(2),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-5', type: 'blocked_by', description: '需要 UI 组件库完成后编写前端 API 文档' },
      { taskId: 'task-1', type: 'blocked_by', description: '需要架构设计确定 API 规范' },
    ],
    blockedTasks: [],
    workDetails: {
      objectives: [
        '定义 OpenAPI 3.0 规范',
        '编写所有端点文档',
        '添加请求/响应示例',
        '整理错误码说明',
      ],
      deliverables: [
        'OpenAPI 规范文件',
        'API 文档网站',
      ],
      requirements: [
        'API 端点清单',
        '数据结构定义',
      ],
      estimatedHours: 20,
      progress: 0,
    },
    collaborators: ['agent-1', 'agent-2'],
  },
  'task-7': {
    id: 'task-7',
    title: '实现消息队列系统',
    description: '基于 RabbitMQ 实现异步消息队列系统，支持任务调度、延迟队列、死信队列等功能。',
    status: 'todo',
    priority: 'medium',
    assigneeId: null,
    assigneeName: null,
    dueDate: daysFromNow(14),
    createdAt: daysAgo(1),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-1', type: 'blocked_by', description: '需要架构设计确定消息队列选型' },
    ],
    blockedTasks: [],
    workDetails: {
      objectives: [
        '搭建 RabbitMQ 集群',
        '实现消息生产者/消费者',
        '实现延迟队列',
        '实现死信队列处理',
      ],
      deliverables: [
        '消息队列服务代码',
        '使用文档',
        '监控告警配置',
      ],
      requirements: [
        '架构设计方案',
        '业务场景分析',
      ],
      estimatedHours: 32,
      progress: 0,
    },
    collaborators: ['agent-1', 'agent-4'],
  },
  'task-9': {
    id: 'task-9',
    title: '安全漏洞扫描',
    description: '对系统进行全方位的安全漏洞扫描，修复发现的中高危漏洞，确保系统安全性。',
    status: 'todo',
    priority: 'urgent',
    assigneeId: 'agent-3',
    assigneeName: 'TestBot',
    dueDate: daysFromNow(1),
    createdAt: daysAgo(1),
    updatedAt: new Date().toISOString(),
    comments: [],
    dependencies: [
      { taskId: 'task-2', type: 'blocked_by', description: '需要认证模块完成后进行安全测试' },
    ],
    blockedTasks: [],
    workDetails: {
      objectives: [
        '执行安全漏洞扫描',
        '修复中高危漏洞',
        '输出安全报告',
        '建立安全基线',
      ],
      deliverables: [
        '安全扫描报告',
        '漏洞修复记录',
        '安全基线文档',
      ],
      requirements: [
        '认证模块完成',
        '测试环境部署',
      ],
      estimatedHours: 12,
      progress: 0,
    },
    collaborators: ['agent-2'],
  },
};

// Mock 数字员工数据（扩展）
export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'ArchitectBot',
    role: '架构师',
    avatar: '🏗️',
    status: 'online',
    completedTasks: 128,
    successRate: 98.5,
    currentTaskId: 'task-1',
    currentWork: workItems['task-1'],
    workload: 3,
    dependencies: [
      {
        agentId: 'agent-2',
        agentName: 'DevBot',
        type: 'collaborating',
        taskId: 'task-1',
        taskTitle: '设计微服务架构',
        description: '共同完成架构设计',
      },
      {
        agentId: 'agent-2',
        agentName: 'DevBot',
        type: 'blocking',
        taskId: 'task-2',
        taskTitle: '实现用户认证模块',
        description: '等待架构设计完成后开始',
      },
    ] as AgentDependency[],
  },
  {
    id: 'agent-2',
    name: 'DevBot',
    role: '工程师',
    avatar: '👨‍💻',
    status: 'busy',
    completedTasks: 256,
    successRate: 96.2,
    currentTaskId: 'task-3',
    currentWork: workItems['task-3'],
    workload: 4,
    dependencies: [
      {
        agentId: 'agent-1',
        agentName: 'ArchitectBot',
        type: 'waiting_for',
        taskId: 'task-2',
        taskTitle: '实现用户认证模块',
        description: '等待架构设计完成',
      },
      {
        agentId: 'agent-1',
        agentName: 'ArchitectBot',
        type: 'waiting_for',
        taskId: 'task-3',
        taskTitle: '数据库性能优化',
        description: '等待架构设计确定数据库选型',
      },
      {
        agentId: 'agent-5',
        agentName: 'DesignBot',
        type: 'collaborating',
        taskId: 'task-5',
        taskTitle: '设计 UI 组件库',
        description: '协助实现组件库',
      },
    ] as AgentDependency[],
  },
  {
    id: 'agent-3',
    name: 'TestBot',
    role: '测试工程师',
    avatar: '🧪',
    status: 'online',
    completedTasks: 189,
    successRate: 99.1,
    currentTaskId: 'task-9',
    currentWork: workItems['task-9'],
    workload: 2,
    dependencies: [
      {
        agentId: 'agent-2',
        agentName: 'DevBot',
        type: 'waiting_for',
        taskId: 'task-9',
        taskTitle: '安全漏洞扫描',
        description: '等待认证模块完成后测试',
      },
    ] as AgentDependency[],
  },
  {
    id: 'agent-4',
    name: 'DeployBot',
    role: '运维工程师',
    avatar: '🚀',
    status: 'offline',
    completedTasks: 95,
    successRate: 94.7,
    currentTaskId: null,
    currentWork: null,
    workload: 0,
    dependencies: [] as AgentDependency[],
  },
  {
    id: 'agent-5',
    name: 'DesignBot',
    role: '设计师',
    avatar: '🎨',
    status: 'busy',
    completedTasks: 167,
    successRate: 97.8,
    currentTaskId: 'task-5',
    currentWork: workItems['task-5'],
    workload: 2,
    dependencies: [
      {
        agentId: 'agent-1',
        agentName: 'ArchitectBot',
        type: 'waiting_for',
        taskId: 'task-5',
        taskTitle: '设计 UI 组件库',
        description: '参考架构设计中的前端规范',
      },
      {
        agentId: 'agent-2',
        agentName: 'DevBot',
        type: 'collaborating',
        taskId: 'task-5',
        taskTitle: '设计 UI 组件库',
        description: '协作实现组件库',
      },
    ] as AgentDependency[],
  },
];

// Mock 任务数据（保持向后兼容，从 workItems 提取）
export const mockTasks: Task[] = Object.values(workItems).map(item => ({
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
}));

// 获取完整工作项
export const getWorkItem = (taskId: string): WorkItem | undefined => {
  return workItems[taskId];
};

// 获取所有工作项
export const getAllWorkItems = (): WorkItem[] => {
  return Object.values(workItems);
};

// 模拟 Socket.IO 实时更新
export const simulateRealTimeUpdates = (
  callback: (agents: Agent[], tasks: Task[]) => void
) => {
  const agents = [...mockAgents];
  const tasks = [...mockTasks];

  const interval = setInterval(() => {
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const statuses: AgentStatus[] = ['online', 'offline', 'busy'];
    randomAgent.status = statuses[Math.floor(Math.random() * statuses.length)];

    if (Math.random() > 0.7) {
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      const statusMap = {
        'todo': 'in-progress' as const,
        'in-progress': 'done' as const,
        'done': 'todo' as const,
      };
      randomTask.status = statusMap[randomTask.status];
      randomTask.updatedAt = new Date().toISOString();
    }

    callback(agents, tasks);
  }, 10000);

  return () => clearInterval(interval);
};
