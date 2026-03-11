import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { PlusOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useStore } from '../store/useStore';
import { BoardColumn } from '../components/BoardColumn';
import { TaskStatus } from '../types';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

// 列配置
const columns = [
  { id: 'todo' as TaskStatus, title: '待办' },
  { id: 'in-progress' as TaskStatus, title: '进行中' },
  { id: 'done' as TaskStatus, title: '已完成' },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, agents, updateTaskStatus, addTask } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 按状态分组任务
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  // 处理拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as TaskStatus;
      
      if (['todo', 'in-progress', 'done'].includes(newStatus)) {
        updateTaskStatus(taskId, newStatus);
        message.success('✅ 任务状态已更新');
      }
    }
  };

  // 添加任务
  const handleAddTask = () => {
    form.validateFields().then((values) => {
      addTask({
        title: values.title,
        description: values.description || '',
        status: 'todo',
        priority: values.priority,
        assigneeId: values.assigneeId || null,
        assigneeName: values.assigneeId 
          ? agents.find(a => a.id === values.assigneeId)?.name || null 
          : null,
        dueDate: values.dueDate.toISOString(),
      });
      
      message.success('✅ 任务创建成功');
      setIsModalOpen(false);
      form.resetFields();
    }).catch((error) => {
      console.error('验证失败:', error);
    });
  };

  // 跳转到任务详情
  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  // 获取当前日期
  const currentDate = dayjs().format('YYYY 年 M 月 D 日 dddd');

  return (
    <div className="animate-fade-in">
      {/* 页面头部 - 增强设计 */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              任务看板
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <CalendarOutlined />
              <span>{currentDate}</span>
              <span className="mx-2">•</span>
              <ClockCircleOutlined />
              <span>最后更新：刚刚</span>
            </div>
          </div>
          
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            size="large"
            className="!h-11 !px-6 !text-sm !font-semibold !shadow-lg !shadow-blue-100"
          >
            新建任务
          </Button>
        </div>

        {/* 快速统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="premium-card p-5 bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">待办任务</p>
                <h3 className="text-2xl font-bold text-slate-900">{getTasksByStatus('todo').length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>
          
          <div className="premium-card p-5 bg-gradient-to-br from-amber-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">进行中</p>
                <h3 className="text-2xl font-bold text-slate-900">{getTasksByStatus('in-progress').length}</h3>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
          
          <div className="premium-card p-5 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">已完成</p>
                <h3 className="text-2xl font-bold text-slate-900">{getTasksByStatus('done').length}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 看板列 */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column, index) => (
            <div key={column.id} className="animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
              <BoardColumn
                id={column.id}
                title={column.title}
                tasks={getTasksByStatus(column.id)}
                onTaskClick={handleTaskClick}
                onAddTask={() => setIsModalOpen(true)}
              />
            </div>
          ))}
        </div>
      </DndContext>

      {/* 新建任务模态框 - 增强设计 */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white">
              <PlusOutlined />
            </div>
            <span className="text-lg font-bold text-slate-800">新建任务</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleAddTask}
        onCancel={() => setIsModalOpen(false)}
        width={640}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)} className="!mr-2">
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddTask} className="!px-6">
            创建任务
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label={<span className="!text-sm !font-semibold !text-slate-700">任务标题</span>}
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input 
              placeholder="请输入任务标题" 
              size="large"
              className="!h-11"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="!text-sm !font-semibold !text-slate-700">任务描述</span>}
          >
            <TextArea
              rows={4}
              placeholder="详细描述任务内容、目标和预期结果..."
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="priority"
              label={<span className="!text-sm !font-semibold !text-slate-700">优先级</span>}
              rules={[{ required: true, message: '请选择优先级' }]}
              initialValue="medium"
            >
              <Select size="large">
                <Option value="low">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span> 低优先级
                  </span>
                </Option>
                <Option value="medium">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> 中优先级
                  </span>
                </Option>
                <Option value="high">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span> 高优先级
                  </span>
                </Option>
                <Option value="urgent">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-slow"></span> 紧急
                  </span>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="assigneeId"
              label={<span className="!text-sm !font-semibold !text-slate-700">负责人</span>}
            >
              <Select 
                size="large" 
                allowClear 
                placeholder="选择负责人"
                showSearch
              >
                {agents.map((agent) => (
                  <Option key={agent.id} value={agent.id}>
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        agent.status === 'online' ? 'bg-emerald-500' :
                        agent.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></span>
                      {agent.name} - {agent.role}
                    </span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="dueDate"
            label={<span className="!text-sm !font-semibold !text-slate-700">截止时间</span>}
            rules={[{ required: true, message: '请选择截止时间' }]}
            initialValue={dayjs().add(7, 'day')}
          >
            <DatePicker
              size="large"
              style={{ width: '100%' }}
              minDate={dayjs()}
              format="YYYY 年 M 月 D 日"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
