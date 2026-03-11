#!/usr/bin/env node

/**
 * 数据切换脚本
 * 用于在 Mock 数据和真实数据之间快速切换
 * 
 * 使用方法：
 * node scripts/switch-data.js mock    - 使用 Mock 数据
 * node scripts/switch-data.js real    - 使用真实数据
 * node scripts/switch-data.js status  - 查看当前状态
 */

const fs = require('fs');
const path = require('path');

const MOCK_DATA_PATH = path.join(__dirname, '..', 'src', 'utils', 'mockData.ts');
const REAL_DATA_EXAMPLE_PATH = path.join(__dirname, '..', 'src', 'utils', 'realData.example.ts');
const REAL_DATA_PATH = path.join(__dirname, '..', 'src', 'utils', 'realData.ts');

function showStatus() {
  console.log('📊 当前数据配置状态\n');
  
  // 检查 mockData.ts 中的导入
  const mockDataContent = fs.readFileSync(MOCK_DATA_PATH, 'utf-8');
  const hasRealImport = mockDataContent.includes("import { realAgents, realTasks") || 
                        mockDataContent.includes("from './realData'");
  
  if (hasRealImport) {
    console.log('✅ 当前使用：真实数据 (realData.ts)');
  } else {
    console.log('✅ 当前使用：Mock 数据 (mockData.ts)');
  }
  
  console.log('\n📁 数据文件状态:');
  
  // 检查真实数据文件
  if (fs.existsSync(REAL_DATA_PATH)) {
    console.log('   ✅ realData.ts - 已创建');
  } else {
    console.log('   ❌ realData.ts - 未创建');
  }
  
  if (fs.existsSync(REAL_DATA_EXAMPLE_PATH)) {
    console.log('   ✅ realData.example.ts - 示例文件存在');
  } else {
    console.log('   ❌ realData.example.ts - 示例文件不存在');
  }
  
  console.log('\n💡 使用提示:');
  console.log('   node scripts/switch-data.js real   - 切换到真实数据');
  console.log('   node scripts/switch-data.js mock   - 切换到 Mock 数据');
}

function switchToReal() {
  console.log('🔄 切换到真实数据...\n');
  
  // 检查真实数据文件是否存在
  if (!fs.existsSync(REAL_DATA_PATH)) {
    console.log('❌ realData.ts 不存在！');
    console.log('   请先复制示例文件:');
    console.log(`   cp ${REAL_DATA_EXAMPLE_PATH} ${REAL_DATA_PATH}\n`);
    console.log('   然后编辑 realData.ts 填入你的真实数据\n');
    return;
  }
  
  // 读取 mockData.ts
  let mockDataContent = fs.readFileSync(MOCK_DATA_PATH, 'utf-8');
  
  // 检查是否已经导入
  if (mockDataContent.includes("import { realAgents, realTasks")) {
    console.log('✅ 已经配置为使用真实数据\n');
    return;
  }
  
  // 添加导入语句
  const importStatement = "import { realAgents, realTasks, realWorkItems, realComments, getWorkItem, getAllWorkItems } from './realData';\n";
  
  // 在第一行添加导入（在现有 import 之后）
  const lines = mockDataContent.split('\n');
  const lastImportIndex = lines.findIndex(line => line.trim().startsWith('import') && line.includes('../types'));
  
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, importStatement);
    mockDataContent = lines.join('\n');
  } else {
    mockDataContent = importStatement + '\n' + mockDataContent;
  }
  
  // 替换导出
  mockDataContent = mockDataContent.replace(
    /export const mockAgents: Agent\[\] = \[/,
    '// 使用真实数据\nexport const mockAgents: Agent[] = realAgents;\n// export const mockAgents: Agent[] = ['
  );
  
  mockDataContent = mockDataContent.replace(
    /export const mockTasks: Task\[\] = Object\.values\(workItems\)/,
    '// 使用真实数据\nexport const mockTasks: Task[] = realTasks;\n// export const mockTasks: Task[] = Object.values(workItems)'
  );
  
  // 写入文件
  fs.writeFileSync(MOCK_DATA_PATH, mockDataContent, 'utf-8');
  
  console.log('✅ 已切换到真实数据模式\n');
  console.log('📝 下一步:');
  console.log('   1. 编辑 src/utils/realData.ts 填入你的真实数据');
  console.log('   2. 运行 pnpm build 重新构建');
  console.log('   3. 运行 pnpm preview 查看效果\n');
}

function switchToMock() {
  console.log('🔄 切换到 Mock 数据...\n');
  
  // 读取 mockData.ts
  let mockDataContent = fs.readFileSync(MOCK_DATA_PATH, 'utf-8');
  
  // 移除真实数据导入
  mockDataContent = mockDataContent.replace(
    /import.*from '\.\/realData';?\n/,
    ''
  );
  
  // 恢复 mockAgents 导出
  mockDataContent = mockDataContent.replace(
    /\/\/ 使用真实数据\nexport const mockAgents: Agent\[\] = realAgents;\n\/\/ export const mockAgents: Agent\[\] = \[/,
    'export const mockAgents: Agent[] = ['
  );
  
  // 恢复 mockTasks 导出
  mockDataContent = mockDataContent.replace(
    /\/\/ 使用真实数据\nexport const mockTasks: Task\[\] = realTasks;\n\/\/ export const mockTasks: Task\[\] = Object\.values\(workItems\)/,
    'export const mockTasks: Task[] = Object.values(workItems)'
  );
  
  // 写入文件
  fs.writeFileSync(MOCK_DATA_PATH, mockDataContent, 'utf-8');
  
  console.log('✅ 已切换到 Mock 数据模式\n');
  console.log('📝 下一步:');
  console.log('   1. 运行 pnpm build 重新构建');
  console.log('   2. 运行 pnpm preview 查看效果\n');
}

function showHelp() {
  console.log('📊 数据切换工具\n');
  console.log('使用方法:');
  console.log('  node scripts/switch-data.js mock    - 使用 Mock 数据');
  console.log('  node scripts/switch-data.js real    - 使用真实数据');
  console.log('  node scripts/switch-data.js status  - 查看当前状态');
  console.log('  node scripts/switch-data.js help    - 显示帮助\n');
  
  console.log('📁 数据文件:');
  console.log('  src/utils/mockData.ts          - Mock 数据（默认）');
  console.log('  src/utils/realData.example.ts  - 真实数据示例');
  console.log('  src/utils/realData.ts          - 你的真实数据（需要创建）\n');
  
  console.log('💡 快速开始:');
  console.log('  1. cp src/utils/realData.example.ts src/utils/realData.ts');
  console.log('  2. 编辑 realData.ts 填入真实数据');
  console.log('  3. node scripts/switch-data.js real');
  console.log('  4. pnpm build && pnpm preview\n');
}

// 主程序
const command = process.argv[2];

switch (command) {
  case 'mock':
    switchToMock();
    break;
  case 'real':
    switchToReal();
    break;
  case 'status':
    showStatus();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    if (command) {
      console.log(`❌ 未知命令：${command}\n`);
    }
    showHelp();
}
