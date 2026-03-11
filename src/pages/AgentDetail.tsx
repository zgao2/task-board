import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Avatar, Tag, Card, Empty } from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useStore } from '../store/useStore';
import { AgentWorkDetail } from '../components/AgentWorkDetail';

const { Title, Text } = Typography;

export const AgentDetail: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { agents } = useStore();

  // 查找员工
  const agent = agents.find(a => a.id === agentId);

  if (!agent) {
    return (
      <div className="animate-fade-in">
        <Empty
          description="员工不存在"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className="text-center mt-6">
          <Button type="primary" onClick={() => navigate('/agents')}>
            返回员工列表
          </Button>
        </div>
      </div>
    );
  }

  // 获取依赖关系
  const dependencies = agent.dependencies || [];

  // 状态配置
  const statusConfig = {
    online: { 
      color: 'emerald', 
      label: '在线', 
      gradient: 'from-emerald-500 to-emerald-400',
    },
    offline: { 
      color: 'gray', 
      label: '离线', 
      gradient: 'from-slate-400 to-slate-300',
    },
    busy: { 
      color: 'amber', 
      label: '忙碌', 
      gradient: 'from-amber-500 to-amber-400',
    },
  };

  const status = statusConfig[agent.status];

  return (
    <div className="animate-fade-in space-y-6">
      {/* 返回按钮 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/agents')}
        className="!mb-4"
      >
        返回
      </Button>

      {/* 员工信息头部 */}
      <Card className="premium-card border-0 shadow-lg bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar
              size={80}
              style={{
                fontSize: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              }}
              className="ring-4 ring-white"
            >
              {agent.avatar}
            </Avatar>
            <span
              className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${status.gradient.replace('from-', 'bg-').split(' ')[0]}`}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Title level={3} className="!mb-0 !text-slate-800 !font-bold">
                {agent.name}
              </Title>
              <Tag
                className={`!text-xs !font-bold !px-3 !py-1 !border bg-gradient-to-r ${status.gradient} text-white border-0`}
              >
                {status.label}
              </Tag>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="font-semibold">{agent.role}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center gap-1">
                <CheckCircleOutlined className="!text-emerald-500" />
                完成 {agent.completedTasks} 个任务
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center gap-1">
                <ThunderboltOutlined className="!text-blue-500" />
                成功率 {agent.successRate}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">当前工作量</div>
            <div className="text-3xl font-bold text-blue-600">{agent.workload}</div>
            <div className="text-xs text-slate-400">个任务</div>
          </div>
        </div>
      </Card>

      {/* 当前工作详情 */}
      {agent.currentWork ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full" />
            <Title level={4} className="!mb-0 !text-slate-800 !font-bold">
              当前工作
            </Title>
          </div>
          <AgentWorkDetail
            workItem={agent.currentWork}
            dependencies={dependencies}
            onViewTask={(taskId) => navigate(`/tasks/${taskId}`)}
          />
        </div>
      ) : (
        <Card className="premium-card border-0 shadow-md">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <Text className="!text-slate-500 !font-medium">当前无工作进行中</Text>
                <div className="mt-2 text-xs text-slate-400">
                  该员工目前空闲，可以分配新任务
                </div>
              </div>
            }
          />
        </Card>
      )}

      {/* 依赖关系概览 */}
      {dependencies.length > 0 && (
        <Card className="premium-card border-0 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center text-white shadow-md">
              <UsergroupAddOutlined className="!text-xl" />
            </div>
            <div>
              <Title level={5} className="!mb-0 !text-slate-800 !font-bold">
                协作关系网络
              </Title>
              <Text className="!text-xs !text-slate-400">
                共 {dependencies.length} 个依赖关系
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dependencies.map((dep, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer ${
                  dep.type === 'waiting_for'
                    ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                    : dep.type === 'blocking'
                    ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
                    : 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                }`}
                onClick={() => navigate(`/tasks/${dep.taskId}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Avatar
                      size={40}
                      style={{
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4],
                        fontSize: '16px',
                      }}
                    >
                      {dep.agentName[0]}
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Text strong className="!text-sm !font-bold !text-slate-800 truncate">
                        {dep.taskTitle}
                      </Text>
                      <Tag
                        className={`!text-[10px] !font-bold !px-2 !py-0.5 !m-0 ${
                          dep.type === 'waiting_for'
                            ? 'bg-amber-100 text-amber-700'
                            : dep.type === 'blocking'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {dep.type === 'waiting_for' ? '等待中' : dep.type === 'blocking' ? '阻塞' : '协作'}
                      </Tag>
                    </div>
                    <Text className="!text-xs !text-slate-600 block mb-2 truncate">
                      {dep.description}
                    </Text>
                    <div className="flex items-center gap-2">
                      <Text className="!text-xs !text-slate-500 font-medium">
                        {dep.agentName}
                      </Text>
                      <span className="text-xs text-slate-400">•</span>
                      <Text className="!text-xs !text-slate-400">
                        {dep.agentId}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
