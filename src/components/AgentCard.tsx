import React from 'react';
import { Card, Avatar, Progress, Typography, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Agent } from '../types';

const { Text, Title } = Typography;

// 状态配置 - 增强视觉
const statusConfig = {
  online: { 
    color: 'emerald', 
    label: '在线', 
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-emerald-400',
    shadow: 'shadow-emerald-200',
    icon: <CheckCircleOutlined />,
  },
  offline: { 
    color: 'gray', 
    label: '离线', 
    dot: 'bg-slate-400',
    gradient: 'from-slate-400 to-slate-300',
    shadow: 'shadow-slate-200',
    icon: <ThunderboltOutlined />,
  },
  busy: { 
    color: 'amber', 
    label: '忙碌', 
    dot: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-400',
    shadow: 'shadow-amber-200',
    icon: <ClockCircleOutlined />,
  },
};

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
  onViewWork?: (agentId: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, onViewWork }) => {
  const status = statusConfig[agent.status];

  return (
    <Card
      hoverable
      onClick={onClick}
      className="agent-card group cursor-pointer"
      styles={{
        body: { padding: '0' },
      }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* 顶部装饰条 */}
      <div className={`h-2 bg-gradient-to-r ${status.gradient}`}></div>
      
      <div className="p-5 flex flex-col gap-4">
        {/* 头部：头像 + 状态 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar 
                size={52} 
                style={{ 
                  fontSize: '24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }}
                className="ring-2 ring-white"
              >
                {agent.avatar}
              </Avatar>
              {/* 状态指示器 */}
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${status.dot} animate-pulse-slow`}></span>
            </div>
            <div>
              <Title level={5} className="!mb-1 !text-slate-800 !font-bold !tracking-tight">
                {agent.name}
              </Title>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-medium">
                  {agent.role}
                </span>
              </div>
            </div>
          </div>
          
          <Tooltip title={status.label}>
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r ${status.gradient} text-white text-xs font-bold shadow-md ${status.shadow}`}>
              {status.icon}
              <span>{status.label}</span>
            </div>
          </Tooltip>
        </div>

        {/* 统计数据 - 增强卡片 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="premium-card p-3 text-center bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrophyOutlined className="!text-blue-500 !text-xs" />
              <Text className="text-[10px] text-slate-500 font-medium">完成任务</Text>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {agent.completedTasks}
            </div>
          </div>
          
          <div className="premium-card p-3 text-center bg-gradient-to-br from-emerald-50 to-white hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircleOutlined className="!text-emerald-500 !text-xs" />
              <Text className="text-[10px] text-slate-500 font-medium">成功率</Text>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {agent.successRate}%
            </div>
          </div>
        </div>

        {/* 成功率进度条 - 增强设计 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <ThunderboltOutlined className="!text-xs !text-slate-400" />
              <Text className="text-xs text-slate-500 font-medium">绩效评分</Text>
            </div>
            <Text strong className="text-sm !text-slate-700">{agent.successRate}%</Text>
          </div>
          <Progress
            percent={agent.successRate}
            strokeColor={{
              '0%': '#3b82f6',
              '100%': '#10b981',
            }}
            trailColor="#e2e8f0"
            showInfo={false}
            style={{ height: '8px', borderRadius: '4px' }}
          />
        </div>

        {/* 当前任务 - 增强提示 */}
        {agent.currentTaskId && (
          <div className="premium-card p-3 bg-gradient-to-br from-amber-50 to-white border-amber-200">
            <div className="flex items-start gap-2">
              <ClockCircleOutlined className="!text-amber-500 !text-sm mt-0.5" />
              <div className="flex-1 min-w-0">
                <Text className="text-[10px] text-amber-600 font-bold uppercase block mb-0.5">
                  当前任务
                </Text>
                <Text strong className="text-xs text-slate-700 block truncate">
                  {agent.currentTaskId}
                </Text>
              </div>
            </div>
          </div>
        )}
        
        {/* 查看工作详情按钮 */}
        {agent.currentWork && (
          <div className="px-5 pb-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewWork?.(agent.id);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FileTextOutlined />
              查看工作详情
            </button>
          </div>
        )}
        
        {/* Hover 效果提示 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </Card>
  );
};
