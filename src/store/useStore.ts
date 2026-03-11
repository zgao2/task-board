import { create } from 'zustand';
import { Task, Agent, TaskStatus, Comment, WorkItem, SubTask, TaskAssignment, TaskTemplate } from '../types';
import { mockTasks, mockAgents, simulateRealTimeUpdates, getTaskTemplates } from '../utils/mockData';
import { realWorkItems } from '../data/realTeam';
import { workItems } from '../utils/mockData';

interface AppState {
  // 数据
  tasks: Task[];
  agents: Agent[];
  workItems: Record<string, WorkItem>;
  templates: TaskTemplate[];
  
  // 任务操作
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'> & { subTasks?: SubTask[] }) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskAssignee: (taskId: string, assigneeId: string | null, assigneeName: string | null) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  
  // 子任务操作
  addSubTask: (taskId: string, subTask: Omit<SubTask, 'id' | 'parentId'>) => void;
  updateSubTaskStatus: (taskId: string, subTaskId: string, status: TaskStatus) => void;
  updateSubTaskAssignee: (taskId: string, subTaskId: string, assigneeId: string | null, assigneeName: string | null) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  
  // 任务分配
  assignTaskToAgent: (taskId: string, agentId: string, workload: number) => void;
  unassignTask: (taskId: string, agentId: string) => void;
  
  // 评论操作
  addComment: (taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  
  // 查询
  getTaskById: (taskId: string) => Task | undefined;
  getAgentById: (agentId: string) => Agent | undefined;
  getWorkItemByTaskId: (taskId: string) => WorkItem | undefined;
  getAllWorkItems: () => WorkItem[];
  getTemplates: () => TaskTemplate[];
  
  // 实时连接
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
}

// 生成唯一 ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 计算任务进度
const calculateProgress = (subTasks: SubTask[]): number => {
  if (subTasks.length === 0) return 0;
  const doneCount = subTasks.filter(st => st.status === 'done').length;
  return Math.round((doneCount / subTasks.length) * 100);
};

// 更新员工工作量
const updateAgentWorkload = (agents: Agent[], agentId: string, delta: number): Agent[] => {
  return agents.map(agent => {
    if (agent.id === agentId) {
      const newWorkload = Math.max(0, agent.workload + delta);
      const newStatus = newWorkload >= agent.maxWorkload ? 'busy' : newWorkload === 0 ? 'online' : agent.status;
      return {
        ...agent,
        workload: newWorkload,
        status: newStatus,
      };
    }
    return agent;
  });
};

export const useStore = create<AppState>((set, get) => ({
  tasks: mockTasks,
  agents: mockAgents,
  workItems: {
    ...workItems,  // 旧项目
    ...realWorkItems,  // 营销助手项目
  },
  templates: getTaskTemplates(),
  
  // 添加任务
  addTask: (taskData) => {
    const { id, ...restTaskData } = taskData as any;
    const newTask: Task = {
      ...restTaskData,
      id: id || generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    
    // 如果有子任务，创建工作项
    if (taskData.subTasks && taskData.subTasks.length > 0) {
      const workItem: WorkItem = {
        ...newTask,
        subTasks: taskData.subTasks.map(st => ({
          ...st,
          id: generateId(),
          parentId: newTask.id,
        })),
        dependencies: [],
        blockedTasks: [],
        workDetails: {
          objectives: [],
          deliverables: [],
          requirements: [],
          estimatedHours: taskData.subTasks.reduce((sum, st) => sum + st.estimatedHours, 0),
          progress: 0,
        },
        collaborators: [],
        assignments: [],
      };
      
      set((state) => ({
        tasks: [...state.tasks, newTask],
        workItems: {
          ...state.workItems,
          [newTask.id]: workItem,
        },
      }));
    } else {
      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));
    }
  },
  
  // 更新任务状态
  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
    
    // 如果任务完成，更新员工工作量
    if (status === 'done') {
      const workItem = get().workItems[taskId];
      if (workItem && workItem.assignments) {
        workItem.assignments.forEach(assignment => {
          set((state) => ({
            agents: updateAgentWorkload(state.agents, assignment.agentId, -assignment.workload),
          }));
        });
      }
    }
  },
  
  // 更新任务负责人
  updateTaskAssignee: (taskId, assigneeId, assigneeName) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, assigneeId, assigneeName, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },
  
  // 更新任务进度
  updateTaskProgress: (taskId, progress) => {
    set((state) => {
      const workItem = state.workItems[taskId];
      if (!workItem) return state;
      
      return {
        workItems: {
          ...state.workItems,
          [taskId]: {
            ...workItem,
            workDetails: {
              ...workItem.workDetails,
              progress,
            },
          },
        },
      };
    });
  },
  
  // 添加子任务
  addSubTask: (taskId, subTaskData) => {
    const subTask: SubTask = {
      ...subTaskData,
      id: generateId(),
      parentId: taskId,
    };
    
    set((state) => {
      const workItem = state.workItems[taskId];
      if (!workItem) return state;
      
      const updatedWorkItem = {
        ...workItem,
        subTasks: [...workItem.subTasks, subTask],
        workDetails: {
          ...workItem.workDetails,
          estimatedHours: workItem.workDetails.estimatedHours + subTask.estimatedHours,
          progress: calculateProgress([...workItem.subTasks, subTask]),
        },
      };
      
      // 更新员工工作量
      let updatedAgents = state.agents;
      if (subTask.assigneeId) {
        updatedAgents = updateAgentWorkload(state.agents, subTask.assigneeId, subTask.estimatedHours);
      }
      
      return {
        workItems: {
          ...state.workItems,
          [taskId]: updatedWorkItem,
        },
        agents: updatedAgents,
      };
    });
  },
  
  // 更新子任务状态
  updateSubTaskStatus: (taskId, subTaskId, status) => {
    set((state) => {
      const workItem = state.workItems[taskId];
      if (!workItem) return state;
      
      const updatedSubTasks = workItem.subTasks.map(st =>
        st.id === subTaskId ? { ...st, status } : st
      );
      
      const oldSubTask = workItem.subTasks.find(st => st.id === subTaskId);
      const newSubTask = updatedSubTasks.find(st => st.id === subTaskId);
      
      // 计算工作量变化
      let workloadDelta = 0;
      if (oldSubTask && newSubTask) {
        if (oldSubTask.status !== 'done' && newSubTask.status === 'done') {
          // 任务完成，释放工作量
          workloadDelta = -newSubTask.estimatedHours;
        } else if (oldSubTask.status === 'done' && newSubTask.status !== 'done') {
          // 任务重新打开，增加工作量
          workloadDelta = newSubTask.estimatedHours;
        }
      }
      
      // 更新员工工作量
      let updatedAgents = state.agents;
      if (newSubTask?.assigneeId && workloadDelta !== 0) {
        updatedAgents = updateAgentWorkload(state.agents, newSubTask.assigneeId, workloadDelta);
      }
      
      const progress = calculateProgress(updatedSubTasks);
      
      // 检查是否所有子任务完成
      const allDone = updatedSubTasks.every(st => st.status === 'done');
      let updatedTasks = state.tasks;
      if (allDone && workItem.status !== 'done') {
        updatedTasks = state.tasks.map(t =>
          t.id === taskId ? { ...t, status: 'done' as TaskStatus, updatedAt: new Date().toISOString() } : t
        );
      }
      
      return {
        workItems: {
          ...state.workItems,
          [taskId]: {
            ...workItem,
            subTasks: updatedSubTasks,
            workDetails: {
              ...workItem.workDetails,
              progress,
              actualHours: (workItem.workDetails.actualHours || 0) + (newSubTask?.actualHours || 0),
            },
          },
        },
        agents: updatedAgents,
        tasks: updatedTasks,
      };
    });
  },
  
  // 更新子任务负责人
  updateSubTaskAssignee: (taskId, subTaskId, assigneeId, assigneeName) => {
    set((state) => {
      const workItem = state.workItems[taskId];
      if (!workItem) return state;
      
      const oldSubTask = workItem.subTasks.find(st => st.id === subTaskId);
      
      const updatedSubTasks = workItem.subTasks.map(st =>
        st.id === subTaskId ? { ...st, assigneeId, assigneeName } : st
      );
      
      // 更新工作量
      let updatedAgents = state.agents;
      if (oldSubTask?.assigneeId) {
        // 移除旧负责人的工作量
        updatedAgents = updateAgentWorkload(updatedAgents, oldSubTask.assigneeId, -oldSubTask.estimatedHours);
      }
      if (assigneeId) {
        // 添加新负责人的工作量
        const newSubTask = updatedSubTasks.find(st => st.id === subTaskId);
        if (newSubTask) {
          updatedAgents = updateAgentWorkload(updatedAgents, assigneeId, newSubTask.estimatedHours);
        }
      }
      
      return {
        workItems: {
          ...state.workItems,
          [taskId]: {
            ...workItem,
            subTasks: updatedSubTasks,
          },
        },
        agents: updatedAgents,
      };
    });
  },
  
  // 删除子任务
  deleteSubTask: (taskId, subTaskId) => {
    set((state) => {
      const workItem = state.workItems[taskId];
      if (!workItem) return state;
      
      const deletedSubTask = workItem.subTasks.find(st => st.id === subTaskId);
      const updatedSubTasks = workItem.subTasks.filter(st => st.id !== subTaskId);
      
      // 更新工作量
      let updatedAgents = state.agents;
      if (deletedSubTask?.assigneeId) {
        updatedAgents = updateAgentWorkload(state.agents, deletedSubTask.assigneeId, -deletedSubTask.estimatedHours);
      }
      
      return {
        workItems: {
          ...state.workItems,
          [taskId]: {
            ...workItem,
            subTasks: updatedSubTasks,
            workDetails: {
              ...workItem.workDetails,
              estimatedHours: workItem.workDetails.estimatedHours - (deletedSubTask?.estimatedHours || 0),
              progress: calculateProgress(updatedSubTasks),
            },
          },
        },
        agents: updatedAgents,
      };
    });
  },
  
  // 分配任务给员工
  assignTaskToAgent: (taskId, agentId, workload) => {
    set((state) => {
      const agent = state.agents.find(a => a.id === agentId);
      if (!agent) return state;
      
      // 检查工作负载
      if (agent.workload + workload > agent.maxWorkload) {
        console.warn('员工工作量已满');
        return state;
      }
      
      // 更新员工工作量
      const updatedAgents = updateAgentWorkload(state.agents, agentId, workload);
      
      // 添加任务分配记录
      const workItem = state.workItems[taskId];
      if (!workItem) return { agents: updatedAgents };
      
      const newAssignment: TaskAssignment = {
        agentId,
        agentName: agent.name,
        role: agent.role,
        assignedAt: new Date().toISOString(),
        workload,
        status: 'assigned',
      };
      
      return {
        agents: updatedAgents,
        workItems: {
          ...state.workItems,
          [taskId]: {
            ...workItem,
            assignments: [...workItem.assignments, newAssignment],
          },
        },
      };
    });
  },
  
  // 取消任务分配
  unassignTask: (taskId, agentId) => {
    set((state) => {
      const workItem = state.workItems[taskId];
      if (!workItem) return state;
      
      const assignment = workItem.assignments.find(a => a.agentId === agentId);
      if (!assignment) return state;
      
      // 更新员工工作量
      const updatedAgents = updateAgentWorkload(state.agents, agentId, -assignment.workload);
      
      return {
        agents: updatedAgents,
        workItems: {
          ...state.workItems,
          [taskId]: {
            ...workItem,
            assignments: workItem.assignments.filter(a => a.agentId !== agentId),
          },
        },
      };
    });
  },
  
  // 添加评论
  addComment: (taskId, commentData) => {
    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, comments: [...task.comments, newComment], updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },
  
  // 查询方法
  getTaskById: (taskId) => {
    return get().tasks.find((task) => task.id === taskId);
  },
  
  getAgentById: (agentId) => {
    return get().agents.find((agent) => agent.id === agentId);
  },
  
  getWorkItemByTaskId: (taskId) => {
    return get().workItems[taskId];
  },
  
  getAllWorkItems: () => {
    return Object.values(get().workItems);
  },
  
  getTemplates: () => {
    return get().templates;
  },
  
  // 实时连接
  startRealTimeUpdates: () => {
    const cleanup = simulateRealTimeUpdates((agents, tasks) => {
      set({ agents, tasks });
    });
    (get() as any)._cleanupRealTime = cleanup;
  },
  
  stopRealTimeUpdates: () => {
    const cleanup = (get() as any)._cleanupRealTime;
    if (cleanup) {
      cleanup();
    }
  },
}));
