#!/bin/bash

# 推送脚本
# 由于网络限制，需要在可以访问 GitHub 的环境中执行

cd /home/node/.openclaw/workspace/task-board

echo "🚀 推送到 GitHub..."
git push -u origin main

echo ""
echo "✅ 推送完成！"
echo ""
echo "📋 下一步："
echo "1. 访问 https://vercel.com/new"
echo "2. 使用 GitHub 账号登录"
echo "3. 导入 task-board 仓库"
echo "4. 点击 Deploy"
echo ""
