import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Tag,
  Button,
  Select,
  Input,
  Avatar,
  List,
  message,
  Space,
} from 'antd';
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SendOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useStore } from '../store/useStore';
import { TaskStatus } from '../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 优先级配置
const priorityConfig = {
  low: { color: 'default', label: '低' },
  medium: { color: 'blue', label: '中' },
  high: { color: 'orange', label: '高' },
  urgent: { color: 'red', label: '紧急' },
};

// 状态配置
const statusConfig = {
  'todo': { label: '待办', color: 'default' },
  'in-progress': { label: '进行中', color: 'processing' },
  'done': { label: '已完成', color: 'success' },
};

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, getAgentById, agents, updateTaskStatus, updateTaskAssignee, addComment } = useStore();
  const [newComment, setNewComment] = useState('');

  const task = id ? getTaskById(id) : undefined;
  const assignee = task?.assigneeId ? getAgentById(task.assigneeId) : null;

  if (!task) {
    return (
      <div className="text-center py-12">
        <Title level={4}>任务不存在</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          返回看板
        </Button>
      </div>
    );
  }

  // 处理状态变更
  const handleStatusChange = (status: TaskStatus) => {
    if (task.id) {
      updateTaskStatus(task.id, status);
      message.success('状态已更新');
    }
  };

  // 处理负责人变更
  const handleAssigneeChange = (assigneeId: string | null) => {
    if (task.id) {
      const agent = assigneeId ? agents.find(a => a.id === assigneeId) : null;
      updateTaskAssignee(task.id, assigneeId, agent?.name || null);
      message.success('负责人已更新');
    }
  };

  // 添加评论
  const handleAddComment = () => {
    if (!newComment.trim() || !task.id) return;

    addComment(task.id, {
      taskId: task.id,
      authorId: 'current-user',
      authorName: 'Admin',
      content: newComment,
    });

    setNewComment('');
    message.success('评论已添加');
  };

  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];

  return (
    <div className="max-w-4xl mx-auto">
      {/* 返回按钮 */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        className="mb-4"
      >
        返回看板
      </Button>

      {/* 任务标题和基本信息 */}
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Title level={3} className="!mb-2">{task.title}</Title>
            <Space size="middle">
              <Tag color={priority.color}>{priority.label}</Tag>
              <Tag color={status.color}>{status.label}</Tag>
            </Space>
          </div>
        </div>

        {/* 元信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <Text type="secondary" className="flex items-center gap-1">
              <ClockCircleOutlined /> 截止时间
            </Text>
            <div className="mt-1">
              {dayjs(task.dueDate).format('YYYY-MM-DD')}
            </div>
          </div>
          <div>
            <Text type="secondary" className="flex items-center gap-1">
              <UserOutlined /> 负责人
            </Text>
            <div className="mt-1">
              {assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar size={20} style={{ backgroundColor: '#1890ff' }}>
                    {assignee.name[0].toUpperCase()}
                  </Avatar>
                  {assignee.name}
                </div>
              ) : (
                '未分配'
              )}
            </div>
          </div>
          <div>
            <Text type="secondary">创建时间</Text>
            <div className="mt-1">
              {dayjs(task.createdAt).format('YYYY-MM-DD')}
            </div>
          </div>
          <div>
            <Text type="secondary">更新时间</Text>
            <div className="mt-1">
              {dayjs(task.updatedAt).format('YYYY-MM-DD HH:mm')}
            </div>
          </div>
        </div>
      </Card>

      {/* 操作栏 */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 状态选择 */}
          <div>
            <Text className="block mb-2">任务状态</Text>
            <Select
              value={task.status}
              onChange={handleStatusChange}
              style={{ width: '100%' }}
            >
              <Option value="todo">待办</Option>
              <Option value="in-progress">进行中</Option>
              <Option value="done">已完成</Option>
            </Select>
          </div>

          {/* 负责人选择 */}
          <div>
            <Text className="block mb-2">负责人</Text>
            <Select
              value={task.assigneeId || undefined}
              onChange={handleAssigneeChange}
              style={{ width: '100%' }}
              allowClear
              placeholder="选择负责人"
            >
              {agents.map((agent) => (
                <Option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.role}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* 任务描述 */}
      <Card title="任务描述" className="mb-6">
        <Paragraph className="whitespace-pre-wrap">{task.description}</Paragraph>
      </Card>

      {/* 评论区 */}
      <Card title={`评论 (${task.comments.length})`}>
        {/* 评论列表 */}
        {task.comments.length > 0 && (
          <List
            dataSource={task.comments}
            className="mb-4"
            renderItem={(comment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: '#1890ff' }}>
                      {comment.authorName[0].toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <div className="flex justify-between">
                      <Text strong>{comment.authorName}</Text>
                      <Text type="secondary" className="text-xs">
                        {dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
                      </Text>
                    </div>
                  }
                  description={comment.content}
                />
              </List.Item>
            )}
          />
        )}

        {/* 添加评论 */}
        <div className="flex gap-2">
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            rows={3}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  );
};
