import React from 'react';
import { Tag, Avatar, Typography } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import { Task } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Text } = Typography;

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

// 优先级配置 - 增强视觉
const priorityConfig = {
  low: { 
    color: 'default', 
    label: '低',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    gradient: 'from-slate-50 to-white',
  },
  medium: { 
    color: 'blue', 
    label: '中',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    gradient: 'from-blue-50 to-white',
  },
  high: { 
    color: 'orange', 
    label: '高',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
    gradient: 'from-orange-50 to-white',
  },
  urgent: { 
    color: 'red', 
    label: '紧急',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
    gradient: 'from-red-50 to-white',
  },
};

// 格式化日期 - 增强显示
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) {
    return (
      <span className="flex items-center gap-1 text-red-600 font-semibold text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-slow"></span>
        已过期
      </span>
    );
  }
  if (days === 0) {
    return (
      <span className="flex items-center gap-1 text-red-500 font-semibold text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
        今天截止
      </span>
    );
  }
  if (days === 1) {
    return (
      <span className="flex items-center gap-1 text-orange-500 font-semibold text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
        明天截止
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-slate-500 text-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
      {days}天后
    </span>
  );
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  const priority = priorityConfig[task.priority];

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`task-card task-card-priority-${task.priority} group animate-fade-in`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        {/* 标题区域 */}
        <div className="flex items-start justify-between gap-2">
          <Text 
            strong 
            className="text-sm text-slate-800 font-semibold leading-snug line-clamp-2 flex-1"
          >
            {task.title}
          </Text>
        </div>

        {/* 优先级标签 - 增强设计 */}
        <div className="flex items-center gap-2">
          <Tag 
            className={`!m-0 !py-1 !px-2.5 !text-xs !font-semibold !rounded-md !border ${priority.bg} ${priority.text} ${priority.border}`}
          >
            {priority.label}
          </Tag>
          
          {/* 评论数 */}
          {task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-slate-400 text-xs">
              <MessageOutlined className="!text-[10px]" />
              {task.comments.length}
            </span>
          )}
        </div>

        {/* 负责人和截止时间 */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {task.assigneeName ? (
              <>
                <Avatar 
                  size={20} 
                  style={{ 
                    backgroundColor: '#3b82f6',
                    fontSize: '10px',
                    fontWeight: '600',
                  }}
                  className="ring-2 ring-white"
                >
                  {task.assigneeName[0].toUpperCase()}
                </Avatar>
                <Text className="text-xs text-slate-600 font-medium truncate max-w-[100px]">
                  {task.assigneeName}
                </Text>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                  <UserOutlined className="!text-[10px] !text-slate-400" />
                </div>
                <Text className="text-xs text-slate-400">未分配</Text>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            {formatDate(task.dueDate)}
          </div>
        </div>
      </div>
      
      {/* Hover 效果增强 */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};
