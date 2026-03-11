import React from 'react';
import { Layout as AntLayout, Menu, Avatar, Typography } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  BellOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = AntLayout;
const { Title, Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '看板主页',
    },
    {
      key: '/agents',
      icon: <TeamOutlined />,
      label: '数字员工',
    },
  ];

  return (
    <AntLayout className="min-h-screen bg-[#f8fafc]">
      {/* 侧边栏 - 玻璃态设计 */}
      <Sider
        theme="light"
        className="!bg-white/90 backdrop-blur-md border-r border-slate-200"
        width={240}
        style={{
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Logo 区域 */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <CheckSquareOutlined style={{ fontSize: 20 }} />
            </div>
            <div>
              <Title level={4} className="!mb-0 !text-slate-800 !font-bold !tracking-tight">任务看板</Title>
              <Text className="!text-[10px] !text-slate-400 !font-medium">TASK BOARD</Text>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-r-0 !mt-4"
          theme="light"
          style={{
            borderRight: 'none',
            marginTop: '16px',
          }}
        />

        {/* 底部用户信息 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Avatar 
              size={40} 
              style={{ 
                backgroundColor: '#10b981',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              }}
              className="ring-2 ring-white"
            >
              🤖
            </Avatar>
            <div className="flex-1 min-w-0">
              <Text className="!text-sm !font-semibold !text-slate-800 !block">Admin</Text>
              <Text className="!text-[11px] !text-slate-400 !block">系统管理员</Text>
            </div>
          </div>
        </div>
      </Sider>

      {/* 主内容区 */}
      <AntLayout>
        {/* 顶部状态栏 - 玻璃态 */}
        <Header 
          className="!bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between h-20"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* 搜索框 */}
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2.5 w-96">
            <SearchOutlined className="!text-slate-400 !text-sm" />
            <input 
              type="text" 
              placeholder="搜索任务、员工..." 
              className="bg-transparent border-none text-sm ml-2 w-full focus:outline-none !text-slate-600 placeholder-slate-400"
            />
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-4">
            {/* 通知按钮 */}
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all duration-200">
              <BellOutlined className="!text-lg" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse-slow"></span>
            </button>
            
            <div className="h-6 w-px bg-slate-200"></div>
            
            {/* 用户头像 */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <Text className="!text-sm !font-bold !text-slate-800 !block">张经理</Text>
                <Text className="!text-[10px] !text-slate-400 !block">高级任务分析师</Text>
              </div>
              <Avatar 
                size={40} 
                style={{ 
                  backgroundColor: '#3b82f6',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                }}
                className="ring-2 ring-slate-100 cursor-pointer"
              >
                张
              </Avatar>
            </div>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
