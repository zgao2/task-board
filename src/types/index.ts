// 任务优先级类型
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// 任务状态类型
export type TaskStatus = 'todo' | 'in-progress' | 'done';

// 数字员工状态类型
export type AgentStatus = 'online' | 'offline' | 'busy';

// 任务拆解类型
export type SubTaskType = 'development' | 'design' | 'test' | 'deploy' | 'review' | 'research';

// 依赖关系类型
export type DependencyType = 'blocks' | 'blocked_by' | 'related' | 'requires';

// 子任务接口
export interface SubTask {
  id: string;
  title: string;
  description: string;
  type: SubTaskType;
  status: TaskStatus;
  assigneeId: string | null;
  assigneeName: string | null;
  estimatedHours: number;
  actualHours?: number;
  dueDate: string;
  parentId: string;
  order: number;
}

// 依赖关系接口
export interface TaskDependency {
  taskId: string;
  type: DependencyType;
  description?: string;
}

// 任务分配接口
export interface TaskAssignment {
  agentId: string;
  agentName: string;
  role: string;
  assignedAt: string;
  workload: number;
  status: 'assigned' | 'accepted' | 'in-progress' | 'completed' | 'blocked';
}

// 工作项详情接口（扩展任务）
export interface WorkItem extends Task {
  // 任务拆解
  subTasks: SubTask[];
  
  // 依赖关系
  dependencies: TaskDependency[];
  
  // 工作详情
  workDetails: {
    objectives: string[];        // 工作目标
    deliverables: string[];       // 交付物
    requirements: string[];       // 前置要求
    estimatedHours: number;       // 预估工时
    actualHours?: number;         // 实际工时
    progress: number;             // 进度百分比 0-100
  };
  
  // 协作者
  collaborators: string[];        // 协作者 ID 列表
  
  // 依赖此任务的其他任务
  blockedTasks: string[];         // 被此任务阻塞的任务 ID
  
  // 任务分配
  assignments: TaskAssignment[];
}

// 评论接口
export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

// 任务接口（保持向后兼容）
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  assigneeName: string | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

// 数字员工接口（扩展）
export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: AgentStatus;
  completedTasks: number;
  successRate: number;
  currentTaskId: string | null;
  
  // 新增字段
  currentWork?: WorkItem | null;  // 当前工作详情
  workload: number;               // 当前工作量（任务数）
  dependencies: AgentDependency[]; // 与其他员工的依赖关系
  skills: string[];               // 技能标签
  maxWorkload: number;            // 最大工作量
}

// 员工依赖关系接口
export interface AgentDependency {
  agentId: string;
  agentName: string;
  type: 'waiting_for' | 'blocking' | 'collaborating';
  taskId: string;
  taskTitle: string;
  description: string;
}

// 看板列类型
export interface BoardColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

// 任务模板接口
export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  defaultSubTasks: Omit<SubTask, 'id' | 'parentId'>[];
  defaultWorkload: number;
}
