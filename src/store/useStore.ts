import { create } from 'zustand';
import { Task, Agent, TaskStatus, Comment, WorkItem } from '../types';
import { mockTasks, mockAgents, simulateRealTimeUpdates, getWorkItem, getAllWorkItems } from '../utils/mockData';

interface AppState {
  // 数据
  tasks: Task[];
  agents: Agent[];
  
  // 操作
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskAssignee: (taskId: string, assigneeId: string | null, assigneeName: string | null) => void;
  addComment: (taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getAgentById: (agentId: string) => Agent | undefined;
  getWorkItemByTaskId: (taskId: string) => WorkItem | undefined;
  getAllWorkItems: () => WorkItem[];
  
  // 实时连接
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  tasks: mockTasks,
  agents: mockAgents,
  
  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },
  
  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },
  
  updateTaskAssignee: (taskId, assigneeId, assigneeName) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, assigneeId, assigneeName, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },
  
  addComment: (taskId, commentData) => {
    const newComment: Comment = {
      ...commentData,
      id: Math.random().toString(36).substr(2, 9),
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
  
  getTaskById: (taskId) => {
    return get().tasks.find((task) => task.id === taskId);
  },
  
  getAgentById: (agentId) => {
    return get().agents.find((agent) => agent.id === agentId);
  },
  
  getWorkItemByTaskId: (taskId) => {
    return getWorkItem(taskId);
  },
  
  getAllWorkItems: () => {
    return getAllWorkItems();
  },
  
  startRealTimeUpdates: () => {
    const cleanup = simulateRealTimeUpdates((agents, tasks) => {
      set({ agents, tasks });
    });
    // 存储 cleanup 函数以便后续调用
    (get() as any)._cleanupRealTime = cleanup;
  },
  
  stopRealTimeUpdates: () => {
    const cleanup = (get() as any)._cleanupRealTime;
    if (cleanup) {
      cleanup();
    }
  },
}));
