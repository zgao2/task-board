# 🎯 任务拆解与员工映射功能

## ✅ 已完成的数据结构优化

### 1. 新增数据类型（`src/types/index.ts`）

#### SubTask - 子任务
```typescript
interface SubTask {
  id: string;
  title: string;              // 子任务标题
  description: string;         // 详细描述
  type: SubTaskType;          // 类型：开发/设计/测试/部署/评审/调研
  status: TaskStatus;         // 状态
  assigneeId: string | null;  // 负责人 ID
  assigneeName: string | null; // 负责人姓名
  estimatedHours: number;     // 预估工时
  actualHours?: number;       // 实际工时
  dueDate: string;            // 截止时间
  parentId: string;           // 父任务 ID
  order: number;              // 排序
}
```

#### TaskAssignment - 任务分配
```typescript
interface TaskAssignment {
  agentId: string;
  agentName: string;
  role: string;
  assignedAt: string;
  workload: number;           // 工作量（工时）
  status: 'assigned' | 'accepted' | 'in-progress' | 'completed' | 'blocked';
}
```

#### TaskTemplate - 任务模板
```typescript
interface TaskTemplate {
  id: string;
  name: string;               // 模板名称：功能开发/Bug 修复/版本发布
  description: string;
  defaultSubTasks: Omit<SubTask, 'id' | 'parentId'>[];
  defaultWorkload: number;
}
```

### 2. 真实数据示例（`src/utils/mockData.ts`）

#### 任务模板库
- **功能开发模板**: 需求分析 → 技术方案 → 编码实现 → 单元测试 → 代码审查 → 部署上线
- **Bug 修复模板**: 问题定位 → 修复方案 → 代码修复 → 回归测试
- **版本发布模板**: 版本规划 → 代码冻结 → 集成测试 → 发布部署 → 验证发布

#### 真实任务拆解示例

**任务：电商平台微服务重构**
```
├─ 子任务 1: 微服务架构设计 (李明) ✅ 已完成
├─ 子任务 2: 用户服务开发 (张伟) 🔄 进行中
├─ 子任务 3: 订单服务开发 (张伟) ⏳ 待办
├─ 子任务 4: 服务集成测试 (刘洋) ⏳ 待办
└─ 子任务 5: 部署上线 (陈静) ⏳ 待办
```

**任务：双 11 活动页面开发**
```
├─ 子任务 1: UI 设计稿评审 (王芳) ✅ 已完成
├─ 子任务 2: 活动页面前端开发 (王芳) 🔄 进行中
├─ 子任务 3: 秒杀接口开发 (张伟) 🔄 进行中
└─ 子任务 4: 性能压测 (刘洋) ⏳ 待办
```

#### 数字员工真实映射

| 员工 | 角色 | 技能 | 当前工作量 | 最大工作量 |
|------|------|------|-----------|-----------|
| 李明 | 技术架构师 | 架构设计、微服务 | 4/5 | 5 |
| 王芳 | 前端负责人 | React、Vue、UI 设计 | 5/5 | 5 |
| 张伟 | 后端工程师 | Java、Spring Cloud | 5/5 | 5 |
| 刘洋 | 测试工程师 | 自动化测试、性能测试 | 2/5 | 5 |
| 陈静 | 运维工程师 | Docker、K8s | 1/5 | 5 |

---

## 📋 待实现的 UI 组件

### 1. SubTaskList 组件（已创建）

**位置**: `src/components/SubTaskList.tsx`

**功能**:
- ✅ 显示任务拆解列表
- ✅ 显示每个子任务的状态、负责人、工时
- ✅ 点击子任务卡片切换状态
- ✅ 添加/编辑/删除子任务
- ✅ 进度条显示整体完成度

### 2. TaskAssignment 组件（待创建）

**功能**:
- 显示任务分配情况
- 分配子任务给员工
- 显示员工工作负载
- 智能推荐（根据技能和负载）

### 3. TaskTemplateSelector 组件（待创建）

**功能**:
- 选择任务模板
- 一键生成子任务
- 自定义模板

---

## 🔄 状态自动更新逻辑

### 任务完成时自动更新

```typescript
// 当子任务完成时
function onSubTaskComplete(subTaskId: string) {
  // 1. 更新子任务状态
  updateSubTaskStatus(subTaskId, 'done');
  
  // 2. 更新父任务进度
  const progress = calculateProgress(subTaskId);
  updateTaskProgress(parentTaskId, progress);
  
  // 3. 更新员工工作量
  const agent = getAgentBySubTask(subTaskId);
  updateAgentWorkload(agent.id, -subTask.estimatedHours);
  
  // 4. 检查是否所有子任务完成
  if (allSubTasksDone(parentTaskId)) {
    updateTaskStatus(parentTaskId, 'done');
    notifyTaskCompleted(parentTaskId);
  }
  
  // 5. 检查是否有阻塞的任务可以开始
  checkUnblockDependentTasks(parentTaskId);
}
```

### 员工状态自动更新

```typescript
// 当分配任务给员工时
function assignTaskToAgent(taskId: string, agentId: string) {
  const agent = getAgent(agentId);
  const task = getTask(taskId);
  
  // 1. 检查工作负载
  if (agent.workload + task.workload > agent.maxWorkload) {
    throw new Error('员工工作量已满');
  }
  
  // 2. 更新员工工作量
  agent.workload += task.workload;
  
  // 3. 更新员工状态
  if (agent.workload >= agent.maxWorkload) {
    agent.status = 'busy';
  }
  
  // 4. 创建任务分配记录
  createAssignment({
    agentId,
    taskId,
    workload: task.workload,
    status: 'assigned',
  });
}
```

---

## 📝 使用流程

### 1. 创建主任务

```bash
1. 点击"新建任务"
2. 填写任务信息（标题、描述、优先级、截止时间）
3. 选择任务模板（功能开发/Bug 修复/版本发布）
4. 点击"创建"
```

### 2. 拆解任务

```bash
1. 打开任务详情页
2. 点击"拆解任务"
3. 选择模板自动生成子任务，或手动添加
4. 为每个子任务分配负责人
5. 设置预估工时和截止时间
```

### 3. 分配给员工

```bash
1. 系统根据技能和工作量智能推荐
2. 手动调整分配
3. 确认分配
4. 员工收到通知
```

### 4. 跟踪进度

```bash
1. 查看任务看板
2. 查看子任务进度条
3. 查看员工工作状态
4. 接收完成通知
```

### 5. 完成任务

```bash
1. 员工标记子任务完成
2. 系统自动更新：
   - 父任务进度
   - 员工工作量
   - 依赖任务状态
3. 所有子任务完成后，主任务自动完成
```

---

## 🎯 下一步开发计划

### 阶段 1: 完善 UI 组件
- [x] SubTaskList 组件
- [ ] TaskAssignment 组件
- [ ] TaskTemplateSelector 组件

### 阶段 2: 实现状态更新逻辑
- [ ] 子任务完成自动更新
- [ ] 员工工作量自动计算
- [ ] 依赖任务自动解锁

### 阶段 3: 智能推荐
- [ ] 基于技能推荐员工
- [ ] 基于工作量平衡分配
- [ ] 基于依赖关系优化顺序

### 阶段 4: 通知系统
- [ ] 任务分配通知
- [ ] 任务完成通知
- [ ] 依赖解锁通知

---

## 📊 数据关系图

```
主任务 (Task)
├─ 子任务 1 (SubTask) → 员工 1 (Agent)
├─ 子任务 2 (SubTask) → 员工 2 (Agent)
├─ 子任务 3 (SubTask) → 员工 3 (Agent)
└─ 依赖关系 (Dependencies)
   ├─ 阻塞任务 1
   └─ 阻塞任务 2

员工 (Agent)
├─ 当前任务 (Current Work)
├─ 工作量 (Workload): 4/5
├─ 技能 (Skills): ['Java', 'Spring']
└─ 依赖关系 (Dependencies)
   └─ 等待 员工 2 完成任务
```

---

## ✅ 当前状态

**已完成**:
- ✅ 数据类型定义
- ✅ 真实数据填充
- ✅ 任务模板库
- ✅ SubTaskList 组件

**待完成**:
- ⏳ 集成到 TaskDetail 页面
- ⏳ 实现状态自动更新
- ⏳ 员工分配 UI
- ⏳ 智能推荐算法

---

**继续开发中...** 🚀
