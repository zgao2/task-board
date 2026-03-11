import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Tag, Avatar, Button, Timeline, Input, Space, Divider, Empty, Tooltip } from 'antd';
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useStore } from '../store/useStore';
import { SubTaskList } from '../components/SubTaskList';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, getWorkItemByTaskId, getAgentById, agents, addComment } = useStore();
  const [commentText, setCommentText] = useState('');

  const task = id ? getTaskById(id) : undefined;
  const workItem = id ? getWorkItemByTaskId(id) : undefined;

  // 优先级配置
  const priorityConfig = {
    low: { color: 'default', label: '低', icon: '📝' },
    medium: { color: 'blue', label: '中', icon: '📌' },
    high: { color: 'orange', label: '高', icon: '🔥' },
    urgent: { color: 'red', label: '紧急', icon: '🚨' },
  };

  // 状态配置
  const statusConfig = {
    'todo': { color: 'default', label: '待办', icon: '⏳' },
    'in-progress': { color: 'processing', label: '进行中', icon: '🔄' },
    'done': { color: 'success', label: '已完成', icon: '✅' },
  };

  if (!task) {
    return (
      <div className="animate-fade-in">
        <Empty
          description="任务不存在"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className="text-center mt-6">
          <Button type="primary" onClick={() => navigate('/')}>
            返回看板
          </Button>
        </div>
      </div>
    );
  }

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const assignee = task.assigneeId ? getAgentById(task.assigneeId) : null;

  // 发送评论
  const handleSendComment = () => {
    if (commentText.trim() && id) {
      addComment(id, {
        taskId: id,
        authorId: 'current-user',
        authorName: '当前用户',
        content: commentText,
      });
      setCommentText('');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* 返回按钮 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        className="!mb-4"
      >
        返回
      </Button>

      {/* 任务概览 */}
      <Card className="premium-card border-0 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Tag color={priority.color} className="!text-sm !px-3 !py-1">
                {priority.icon} {priority.label}
              </Tag>
              <Tag color={status.color} className="!text-sm !px-3 !py-1">
                {status.icon} {status.label}
              </Tag>
            </div>
            <Title level={3} className="!mb-2 !text-slate-800">
              {task.title}
            </Title>
            <Paragraph className="!text-slate-600 !text-base">
              {task.description}
            </Paragraph>
          </div>
        </div>

        {/* 任务元信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500 mb-1">负责人</div>
            {assignee ? (
              <div className="flex items-center gap-2">
                <Avatar
                  size={24}
                  style={{ backgroundColor: '#3b82f6', fontSize: '12px' }}
                >
                  {assignee.name[0]}
                </Avatar>
                <Text className="!text-slate-700 !font-medium">{assignee.name}</Text>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-400">
                <UserOutlined />
                <Text>未分配</Text>
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-1">截止时间</div>
            <div className="flex items-center gap-1 text-slate-700">
              <ClockCircleOutlined className="!text-slate-400" />
              <Text>{new Date(task.dueDate).toLocaleDateString('zh-CN')}</Text>
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-1">创建时间</div>
            <div className="text-slate-700">
              {new Date(task.createdAt).toLocaleDateString('zh-CN')}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500 mb-1">更新时间</div>
            <div className="text-slate-700">
              {new Date(task.updatedAt).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>
      </Card>

      {/* 工作详情和子任务 */}
      {workItem && (
        <>
          {/* 工作详情 */}
          <Card className="premium-card border-0 shadow-md bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-2 mb-4">
              <ThunderboltOutlined className="!text-blue-500 !text-xl" />
              <Title level={5} className="!mb-0 !text-slate-800">工作详情</Title>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 工作目标 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleOutlined className="!text-emerald-500" />
                  <Text strong className="!text-slate-700">工作目标</Text>
                </div>
                <Timeline
                  items={workItem.workDetails.objectives.map((obj, index) => ({
                    children: <Text className="!text-sm !text-slate-600">{obj}</Text>,
                    color: 'green',
                    dot: <div className="w-2 h-2 rounded-full bg-emerald-500" />,
                  }))}
                />
              </div>

              {/* 交付物 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ThunderboltOutlined className="!text-blue-500" />
                  <Text strong className="!text-slate-700">交付物</Text>
                </div>
                <Timeline
                  items={workItem.workDetails.deliverables.map((item, index) => ({
                    children: <Text className="!text-sm !text-slate-600">{item}</Text>,
                    color: 'blue',
                    dot: <div className="w-2 h-2 rounded-full bg-blue-500" />,
                  }))}
                />
              </div>
            </div>

            {/* 进度和工时 */}
            <Divider />

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-500 mb-1">整体进度</div>
                <div className="text-2xl font-bold text-blue-600">
                  {workItem.workDetails.progress}%
                </div>
              </div>
              <div className="text-center border-l border-slate-200">
                <div className="text-xs text-slate-500 mb-1">预估工时</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {workItem.workDetails.estimatedHours}h
                </div>
              </div>
              <div className="text-center border-l border-slate-200">
                <div className="text-xs text-slate-500 mb-1">实际工时</div>
                <div className="text-2xl font-bold text-amber-600">
                  {workItem.workDetails.actualHours || 0}h
                </div>
              </div>
            </div>
          </Card>

          {/* 子任务列表 */}
          <Card className="premium-card border-0 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="!text-emerald-500 !text-xl" />
                <Title level={5} className="!mb-0 !text-slate-800">任务拆解</Title>
              </div>
              <Tooltip title="点击子任务可快速切换状态">
                <Text className="!text-xs !text-slate-400">
                  💡 点击子任务可快速切换状态
                </Text>
              </Tooltip>
            </div>

            <SubTaskList
              taskId={id!}
              subTasks={workItem.subTasks}
              agents={agents}
              onUpdate={() => {
                // 刷新数据
              }}
            />
          </Card>
        </>
      )}

      {/* 评论区 */}
      <Card className="premium-card border-0 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <MessageOutlined className="!text-blue-500 !text-xl" />
          <Title level={5} className="!mb-0 !text-slate-800">评论</Title>
        </div>

        {/* 评论列表 */}
        <div className="space-y-4 mb-6">
          {task.comments.length === 0 ? (
            <Empty description="暂无评论" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            task.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar
                  size={40}
                  style={{ backgroundColor: '#8b5cf6', fontSize: '16px' }}
                >
                  {comment.authorName[0]}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Text strong className="!text-slate-800">{comment.authorName}</Text>
                    <Text className="!text-xs !text-slate-400">
                      {new Date(comment.createdAt).toLocaleString('zh-CN')}
                    </Text>
                  </div>
                  <Text className="!text-slate-600">{comment.content}</Text>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 发送评论 */}
        <div className="flex gap-2">
          <TextArea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="写下你的评论..."
            rows={3}
            className="!resize-none"
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendComment}
            disabled={!commentText.trim()}
          >
            发送评论
          </Button>
        </div>
      </Card>
    </div>
  );
};
