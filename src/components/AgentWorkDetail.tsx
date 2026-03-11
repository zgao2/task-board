import React from 'react';
import { Card, Progress, Tag, Typography, Timeline, Avatar, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  LinkOutlined,
  BlockOutlined,
  UsergroupAddOutlined,
  FileTextOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { WorkItem, AgentDependency } from '../types';

const { Title, Text, Paragraph } = Typography;

interface AgentWorkDetailProps {
  workItem: WorkItem;
  dependencies: AgentDependency[];
  onViewTask?: (taskId: string) => void;
}

export const AgentWorkDetail: React.FC<AgentWorkDetailProps> = ({
  workItem,
  dependencies,
  onViewTask,
}) => {
  // 获取依赖类型图标和颜色
  const getDependencyIcon = (type: string) => {
    switch (type) {
      case 'blocked_by':
        return <BlockOutlined className="!text-amber-500" />;
      case 'blocks':
        return <LinkOutlined className="!text-blue-500" />;
      case 'collaborating':
        return <UsergroupAddOutlined className="!text-emerald-500" />;
      default:
        return <LinkOutlined className="!text-slate-400" />;
    }
  };

  const getDependencyColor = (type: string) => {
    switch (type) {
      case 'blocked_by':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'blocks':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'collaborating':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getDependencyLabel = (type: string) => {
    switch (type) {
      case 'blocked_by':
        return '等待中';
      case 'blocks':
        return '阻塞';
      case 'collaborating':
        return '协作';
      case 'requires':
        return '需要';
      default:
        return '关联';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '🔥 紧急';
      case 'high':
        return '📌 高';
      case 'medium':
        return '📋 中';
      case 'low':
        return '📝 低';
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 任务概览卡片 */}
      <Card className="premium-card border-0 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Tag className={`${getPriorityColor(workItem.priority)} !text-xs !font-bold !px-3 !py-1 !border`}>
                {getPriorityLabel(workItem.priority)}
              </Tag>
              <Tag className={`!text-xs !font-medium !px-3 !py-1 !border ${
                workItem.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                workItem.status === 'todo' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                'bg-emerald-100 text-emerald-700 border-emerald-200'
              }`}>
                {workItem.status === 'in-progress' ? '🚀 进行中' :
                 workItem.status === 'todo' ? '📋 待办' : '✅ 已完成'}
              </Tag>
            </div>
            <Title level={4} className="!mb-2 !text-slate-800 !font-bold">
              {workItem.title}
            </Title>
            <Paragraph className="!text-slate-600 !text-sm" ellipsis={{ rows: 2 }}>
              {workItem.description}
            </Paragraph>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">截止日期</div>
            <div className="text-sm font-bold text-slate-800 flex items-center justify-end gap-1">
              <ClockCircleOutlined className="!text-slate-400" />
              {new Date(workItem.dueDate).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <ThunderboltOutlined className="!text-xs !text-blue-500" />
              <Text className="text-xs text-slate-500 font-medium">整体进度</Text>
            </div>
            <Text strong className="text-sm !text-slate-700">{workItem.workDetails.progress}%</Text>
          </div>
          <Progress
            percent={workItem.workDetails.progress}
            strokeColor={{
              '0%': '#3b82f6',
              '100%': '#10b981',
            }}
            trailColor="#e2e8f0"
            showInfo={false}
            style={{ height: '10px', borderRadius: '5px' }}
          />
        </div>
      </Card>

      {/* 工作目标与交付物 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 工作目标 */}
        <Card className="premium-card border-0 shadow-md bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <RocketOutlined className="!text-blue-600" />
            </div>
            <Title level={5} className="!mb-0 !text-slate-800 !font-bold">工作目标</Title>
          </div>
          <Timeline
            items={workItem.workDetails.objectives.map((obj) => ({
              children: (
                <Text className="text-sm text-slate-700">{obj}</Text>
              ),
              color: 'blue',
              dot: <div className="w-2 h-2 rounded-full bg-blue-500" />,
            }))}
          />
        </Card>

        {/* 交付物 */}
        <Card className="premium-card border-0 shadow-md bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileTextOutlined className="!text-emerald-600" />
            </div>
            <Title level={5} className="!mb-0 !text-slate-800 !font-bold">交付物</Title>
          </div>
          <Timeline
            items={workItem.workDetails.deliverables.map((item) => ({
              children: (
                <Text className="text-sm text-slate-700">{item}</Text>
              ),
              color: 'green',
              dot: <div className="w-2 h-2 rounded-full bg-emerald-500" />,
            }))}
          />
        </Card>
      </div>

      {/* 前置要求 */}
      <Card className="premium-card border-0 shadow-md bg-gradient-to-br from-amber-50 to-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <CheckCircleOutlined className="!text-amber-600" />
          </div>
          <Title level={5} className="!mb-0 !text-slate-800 !font-bold">前置要求</Title>
        </div>
        <div className="flex flex-wrap gap-2">
          {workItem.workDetails.requirements.map((req, index) => (
            <Tag key={index} className="!text-xs !font-medium !px-3 !py-1.5 bg-white border-amber-200 text-amber-700">
              {req}
            </Tag>
          ))}
        </div>
      </Card>

      {/* 工时估算 */}
      <Card className="premium-card border-0 shadow-md">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-500 mb-1">预估工时</div>
            <div className="text-2xl font-bold text-blue-600">
              {workItem.workDetails.estimatedHours}h
            </div>
          </div>
          <div className="text-center border-l border-slate-200">
            <div className="text-xs text-slate-500 mb-1">实际工时</div>
            <div className="text-2xl font-bold text-emerald-600">
              {workItem.workDetails.actualHours || '-'}h
            </div>
          </div>
          <div className="text-center border-l border-slate-200">
            <div className="text-xs text-slate-500 mb-1">剩余工时</div>
            <div className="text-2xl font-bold text-amber-600">
              {workItem.workDetails.estimatedHours - (workItem.workDetails.actualHours || 0)}h
            </div>
          </div>
        </div>
      </Card>

      {/* 依赖关系 */}
      {dependencies.length > 0 && (
        <Card className="premium-card border-0 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center text-white shadow-md">
              <LinkOutlined className="!text-lg" />
            </div>
            <div>
              <Title level={5} className="!mb-0 !text-slate-800 !font-bold">工作依赖关系</Title>
              <Text className="!text-xs !text-slate-400">当前任务与其他员工的协作关系</Text>
            </div>
          </div>

          <div className="space-y-3">
            {dependencies.map((dep, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${getDependencyColor(dep.type)}`}
                onClick={() => onViewTask?.(dep.taskId)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getDependencyIcon(dep.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Text strong className="!text-sm !font-bold">{dep.taskTitle}</Text>
                      <Tag className="!text-[10px] !font-bold !px-2 !py-0.5 !m-0 bg-white/50 border-0">
                        {getDependencyLabel(dep.type)}
                      </Tag>
                    </div>
                    <Text className="!text-xs !text-slate-600 block mb-2">
                      {dep.description}
                    </Text>
                    <div className="flex items-center gap-2">
                      <Avatar size={20} style={{ backgroundColor: '#8b5cf6', fontSize: '10px' }}>
                        {dep.agentName[0]}
                      </Avatar>
                      <Text className="!text-xs !text-slate-500 font-medium">{dep.agentName}</Text>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <LinkOutlined className="!text-slate-400 hover:!text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 协作者 */}
      {workItem.collaborators.length > 0 && (
        <Card className="premium-card border-0 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <UsergroupAddOutlined className="!text-emerald-600" />
            </div>
            <Title level={5} className="!mb-0 !text-slate-800 !font-bold">协作者</Title>
          </div>
          <div className="flex items-center gap-3">
            {workItem.collaborators.map((_, index) => {
              return (
                <Tooltip key={index} title={`协作者 ${index + 1}`}>
                  <Avatar
                    size={40}
                    style={{
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4],
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                    className="ring-2 ring-white hover:scale-110 transition-transform"
                  >
                    {`C${index + 1}`}
                  </Avatar>
                </Tooltip>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
