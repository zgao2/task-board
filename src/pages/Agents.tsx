import React, { useEffect } from 'react';
import { Row, Col, Select, Empty } from 'antd';
import { UsergroupAddOutlined, CheckCircleOutlined, ClockCircleOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AgentCard } from '../components/AgentCard';
import { AgentStatus } from '../types';

const { Option } = Select;

export const Agents: React.FC = () => {
  const navigate = useNavigate();
  const { agents, startRealTimeUpdates, stopRealTimeUpdates } = useStore();
  const [filterStatus, setFilterStatus] = React.useState<AgentStatus | 'all'>('all');

  // 启动实时状态更新
  useEffect(() => {
    startRealTimeUpdates();
    return () => stopRealTimeUpdates();
  }, [startRealTimeUpdates, stopRealTimeUpdates]);

  // 查看工作详情
  const handleViewWork = (agentId: string) => {
    navigate(`/agents/${agentId}`);
  };

  // 按状态过滤员工
  const filteredAgents = filterStatus === 'all'
    ? agents
    : agents.filter(agent => agent.status === filterStatus);

  // 统计数据
  const stats = {
    total: agents.length,
    online: agents.filter(a => a.status === 'online').length,
    busy: agents.filter(a => a.status === 'busy').length,
    offline: agents.filter(a => a.status === 'offline').length,
  };

  return (
    <div className="animate-fade-in">
      {/* 页面头部 - 增强设计 */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              数字员工监控
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>实时监控数字员工的工作状态和绩效表现</span>
              <span className="mx-2">•</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow"></span>
                实时更新
              </span>
            </div>
          </div>
          
          {/* 状态过滤器 - 增强设计 */}
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            size="large"
            className="!w-40"
            dropdownStyle={{ borderRadius: '8px' }}
          >
            <Option value="all">
              <span className="flex items-center gap-2">
                <UsergroupAddOutlined /> 全部
              </span>
            </Option>
            <Option value="online">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 在线
              </span>
            </Option>
            <Option value="busy">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> 忙碌
              </span>
            </Option>
            <Option value="offline">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> 离线
              </span>
            </Option>
          </Select>
        </div>

        {/* 统计卡片 - 增强设计 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <div className="premium-card p-5 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">总人数</p>
                  <h3 className="text-3xl font-bold text-slate-900">{stats.total}</h3>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <UsergroupAddOutlined className="!text-2xl !text-blue-600" />
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <div className="premium-card p-5 bg-gradient-to-br from-emerald-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">🟢 在线</p>
                  <h3 className="text-3xl font-bold text-emerald-600">{stats.online}</h3>
                </div>
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <CheckCircleOutlined className="!text-2xl !text-emerald-600" />
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <div className="premium-card p-5 bg-gradient-to-br from-amber-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">🟠 忙碌</p>
                  <h3 className="text-3xl font-bold text-amber-600">{stats.busy}</h3>
                </div>
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <ClockCircleOutlined className="!text-2xl !text-amber-600" />
                </div>
              </div>
            </div>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <div className="premium-card p-5 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">⚫ 离线</p>
                  <h3 className="text-3xl font-bold text-slate-600">{stats.offline}</h3>
                </div>
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <LogoutOutlined className="!text-2xl !text-slate-600" />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 员工列表 - 增强网格 */}
      {filteredAgents.length === 0 ? (
        <div className="premium-card p-12 flex flex-col items-center justify-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-slate-400 font-medium">暂无员工</span>
            }
          />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredAgents.map((agent, index) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={agent.id}>
              <div className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <AgentCard 
                  agent={agent} 
                  onClick={() => navigate(`/agents/${agent.id}`)}
                  onViewWork={handleViewWork}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
