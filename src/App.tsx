import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Agents } from './pages/Agents';
import { AgentDetail } from './pages/AgentDetail';
import { TaskDetail } from './pages/TaskDetail';
import { useStore } from './store/useStore';

function App() {
  // 启动实时状态更新
  const { startRealTimeUpdates, stopRealTimeUpdates } = useStore();

  useEffect(() => {
    startRealTimeUpdates();
    return () => stopRealTimeUpdates();
  }, [startRealTimeUpdates, stopRealTimeUpdates]);

  return (
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorPrimary: '#1890ff',
        borderRadius: 6,
      },
    }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:agentId" element={<AgentDetail />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
