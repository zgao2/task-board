import React, { useState } from 'react';
import { Card, Tag, Progress, Avatar, Typography, Button, Modal, Form, Input, Select, DatePicker, Space, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { SubTask, Agent } from '../types';
import { useStore } from '../store/useStore';

const { Text, Title } = Typography;
const { Option } = Select;

interface SubTaskListProps {
  taskId: string;
  subTasks: SubTask[];
  agents: Agent[];
  onUpdate?: () => void;
}

export const SubTaskList: React.FC<SubTaskListProps> = ({
  taskId,
  subTasks,
  agents,
  onUpdate,
}) => {
  const { updateSubTaskStatus, addSubTask, deleteSubTask } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState<SubTask | null>(null);
  const [form] = Form.useForm();

  // 子任务类型配置
  const typeConfig = {
    development: { color: 'blue', label: '开发', icon: '💻' },
    design: { color: 'purple', label: '设计', icon: '🎨' },
    test: { color: 'green', label: '测试', icon: '🧪' },
    deploy: { color: 'orange', label: '部署', icon: '🚀' },
    review: { color: 'cyan', label: '评审', icon: '📋' },
    research: { color: 'geekblue', label: '调研', icon: '🔍' },
  };

  // 状态配置
  const statusConfig = {
    'todo': { color: 'default', label: '待办' },
    'in-progress': { color: 'processing', label: '进行中' },
    'done': { color: 'success', label: '完成' },
  };

  // 计算进度
  const calculateProgress = () => {
    if (subTasks.length === 0) return 0;
    const doneCount = subTasks.filter(st => st.status === 'done').length;
    return Math.round((doneCount / subTasks.length) * 100);
  };

  // 处理子任务状态更新
  const handleStatusChange = (subTaskId: string, newStatus: SubTask['status']) => {
    updateSubTaskStatus(taskId, subTaskId, newStatus);
    onUpdate?.();
  };

  // 删除子任务
  const handleDelete = (subTaskId: string) => {
    deleteSubTask(taskId, subTaskId);
    onUpdate?.();
  };

  // 打开新建/编辑模态框
  const handleOpenModal = (subTask?: SubTask) => {
    if (subTask) {
      setEditingSubTask(subTask);
      form.setFieldsValue({
        title: subTask.title,
        description: subTask.description,
        type: subTask.type,
        assigneeId: subTask.assigneeId,
        estimatedHours: subTask.estimatedHours,
        dueDate: subTask.dueDate ? new Date(subTask.dueDate) : null,
      });
    } else {
      setEditingSubTask(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // 提交子任务
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const agent = agents.find(a => a.id === values.assigneeId);
      
      addSubTask(taskId, {
        title: values.title,
        description: values.description || '',
        type: values.type,
        status: 'todo',
        assigneeId: values.assigneeId || null,
        assigneeName: agent?.name || null,
        estimatedHours: values.estimatedHours,
        dueDate: values.dueDate?.toISOString() || '',
        order: subTasks.length,
      });
      
      setIsModalOpen(false);
      form.resetFields();
      onUpdate?.();
    });
  };

  return (
    <div className="space-y-4">
      {/* 进度概览 */}
      <Card className="premium-card border-0 shadow-md bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ThunderboltOutlined className="!text-blue-500 !text-lg" />
            <Title level={5} className="!mb-0 !text-slate-800">任务拆解进度</Title>
          </div>
          <Text className="!text-slate-600 !font-semibold">
            {subTasks.filter(st => st.status === 'done').length} / {subTasks.length} 已完成
          </Text>
        </div>
        <Progress
          percent={calculateProgress()}
          strokeColor={{
            '0%': '#3b82f6',
            '100%': '#10b981',
          }}
          trailColor="#e2e8f0"
          showInfo={false}
          style={{ height: '10px', borderRadius: '5px' }}
        />
      </Card>

      {/* 子任务列表 */}
      <div className="space-y-3">
        {subTasks.map((subTask) => {
          const type = typeConfig[subTask.type];
          const status = statusConfig[subTask.status];
          const assignee = agents.find(a => a.id === subTask.assigneeId);

          return (
            <Card
              key={subTask.id}
              className={`premium-card border-l-4 hover:shadow-lg transition-all cursor-pointer ${
                subTask.status === 'done' ? 'border-l-emerald-500 bg-emerald-50/30' :
                subTask.status === 'in-progress' ? 'border-l-blue-500 bg-blue-50/30' :
                'border-l-slate-300'
              }`}
              onClick={() => handleStatusChange(
                subTask.id,
                subTask.status === 'done' ? 'todo' : subTask.status === 'in-progress' ? 'done' : 'in-progress'
              )}
            >
              <div className="flex items-start gap-4">
                {/* 状态指示器 */}
                <div className="flex-shrink-0 mt-1">
                  {subTask.status === 'done' ? (
                    <CheckCircleOutlined className="!text-2xl !text-emerald-500" />
                  ) : subTask.status === 'in-progress' ? (
                    <ClockCircleOutlined className="!text-2xl !text-blue-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                  )}
                </div>

                {/* 任务内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Text strong className="!text-slate-800 !text-base">
                          {type.icon} {subTask.title}
                        </Text>
                        <Tag color={type.color} className="!text-xs">
                          {type.label}
                        </Tag>
                        <Tag color={status.color} className="!text-xs">
                          {status.label}
                        </Tag>
                      </div>
                      <Text className="!text-slate-600 !text-sm block">
                        {subTask.description}
                      </Text>
                    </div>

                    {/* 操作按钮 */}
                    <Space size="small">
                      <Tooltip title="编辑">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(subTask);
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="删除">
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(subTask.id);
                          }}
                        />
                      </Tooltip>
                    </Space>
                  </div>

                  {/* 负责人和工时 */}
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {assignee ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar
                          size={20}
                          style={{ backgroundColor: '#3b82f6', fontSize: '10px' }}
                        >
                          {assignee.name[0]}
                        </Avatar>
                        <Text className="!text-slate-600">{assignee.name}</Text>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <UserOutlined className="!text-slate-400" />
                        <Text className="!text-slate-400">未分配</Text>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <ThunderboltOutlined className="!text-amber-500" />
                      <Text>
                        {subTask.actualHours || 0}h / {subTask.estimatedHours}h
                      </Text>
                    </div>

                    {subTask.dueDate && (
                      <div className="flex items-center gap-1">
                        <ClockCircleOutlined className="!text-slate-400" />
                        <Text>
                          {new Date(subTask.dueDate).toLocaleDateString('zh-CN')}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 添加子任务按钮 */}
      <Button
        type="dashed"
        block
        icon={<PlusOutlined />}
        onClick={() => handleOpenModal()}
        className="!h-11 !rounded-xl !font-semibold"
      >
        添加子任务
      </Button>

      {/* 新建/编辑模态框 */}
      <Modal
        title={editingSubTask ? '编辑子任务' : '添加子任务'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="例如：用户服务开发" />
          </Form.Item>

          <Form.Item
            name="description"
            label="任务描述"
          >
            <Input.TextArea
              rows={3}
              placeholder="详细描述任务内容"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="任务类型"
              rules={[{ required: true, message: '请选择任务类型' }]}
            >
              <Select>
                <Option value="development">💻 开发</Option>
                <Option value="design">🎨 设计</Option>
                <Option value="test">🧪 测试</Option>
                <Option value="deploy">🚀 部署</Option>
                <Option value="review">📋 评审</Option>
                <Option value="research">🔍 调研</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="assigneeId"
              label="负责人"
            >
              <Select allowClear placeholder="选择负责人">
                {agents.map((agent) => (
                  <Option key={agent.id} value={agent.id}>
                    {agent.avatar} {agent.name} - {agent.role}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="estimatedHours"
              label="预估工时（小时）"
              rules={[{ required: true, message: '请输入预估工时' }]}
            >
              <Input type="number" min={1} />
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="截止时间"
            >
              <DatePicker
                showTime
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
