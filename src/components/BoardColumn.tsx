import React from 'react';
import { Typography, Button, Empty } from 'antd';
import { PlusOutlined, DragOutlined } from '@ant-design/icons';
import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

const { Title } = Typography;

interface BoardColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  onAddTask?: () => void;
}

// 列颜色配置 - 增强视觉
const columnConfig = {
  'todo': { 
    gradient: 'from-slate-50 to-white',
    border: 'border-slate-200',
    header: 'bg-slate-100',
    accent: 'bg-slate-400',
    icon: '📋',
  },
  'in-progress': { 
    gradient: 'from-blue-50 to-white',
    border: 'border-blue-200',
    header: 'bg-blue-100',
    accent: 'bg-blue-500',
    icon: '⚡',
  },
  'done': { 
    gradient: 'from-emerald-50 to-white',
    border: 'border-emerald-200',
    header: 'bg-emerald-100',
    accent: 'bg-emerald-500',
    icon: '✅',
  },
};

export const BoardColumn: React.FC<BoardColumnProps> = ({
  id,
  title,
  tasks,
  onTaskClick,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const config = columnConfig[id];

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[300px] max-w-[380px] rounded-2xl border-2 p-4 bg-gradient-to-b ${config.gradient} ${config.border} transition-all duration-300 ${
        isOver ? 'border-blue-400 shadow-lg shadow-blue-100 scale-[1.02]' : ''
      }`}
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* 列标题 - 增强设计 */}
      <div className={`flex items-center justify-between mb-4 p-3 rounded-xl ${config.header}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <Title level={5} className="!mb-0 !text-slate-800 !font-bold !tracking-tight">
            {title}
          </Title>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border ${config.border}`}>
          <span className={`w-2 h-2 rounded-full ${config.accent}`}></span>
          <span className="text-sm font-bold text-slate-700">{tasks.length}</span>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="flex flex-col gap-3 min-h-[300px]">
        {tasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-slate-400 text-sm font-medium">暂无任务</span>
              }
              className="!my-0"
            />
          </div>
        ) : (
          tasks.map((task, index) => (
            <div 
              key={task.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard
                task={task}
                onClick={() => onTaskClick?.(task.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* 添加任务按钮 - 增强设计 */}
      {onAddTask && (
        <Button
          type="dashed"
          block
          icon={<PlusOutlined />}
          onClick={onAddTask}
          className="mt-4 !h-10 !rounded-xl !font-semibold !text-sm !border-dashed hover:!border-solid hover:!shadow-md transition-all duration-300"
        >
          添加任务
        </Button>
      )}
      
      {/* 拖拽提示 */}
      {isOver && (
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/50 flex items-center justify-center pointer-events-none animate-pulse-slow">
          <div className="flex items-center gap-2 text-blue-500 font-semibold">
            <DragOutlined className="!text-xl" />
            <span>释放以放置任务</span>
          </div>
        </div>
      )}
    </div>
  );
};
