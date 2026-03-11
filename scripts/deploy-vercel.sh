#!/bin/bash

# ============================================
# Vercel 一键部署脚本
# ============================================
# 使用方法：
# ./scripts/deploy-vercel.sh
# ============================================

set -e

echo "🚀 任务看板系统 - Vercel 部署脚本"
echo "=================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到 Node.js"
    echo "   请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本：$(node -v)"

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm 未安装，正在安装..."
    npm i -g pnpm
fi

echo "✅ pnpm 版本：$(pnpm -v)"

# 构建项目
echo ""
echo "📦 正在构建项目..."
pnpm build

# 检查构建产物
if [ ! -d "dist" ]; then
    echo "❌ 错误：构建失败，未找到 dist 目录"
    exit 1
fi

echo "✅ 构建成功！"

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo ""
    echo "⚠️  Vercel CLI 未安装，正在安装..."
    npm i -g vercel
fi

echo "✅ Vercel CLI 版本：$(vercel -v)"

# 登录检查
echo ""
echo "🔐 检查 Vercel 登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  未登录 Vercel，正在引导登录..."
    vercel login
fi

echo "✅ 已登录为：$(vercel whoami)"

# 部署
echo ""
echo "🚀 开始部署到 Vercel..."
echo ""

# 判断是否为生产部署
if [ "$1" = "--prod" ]; then
    echo "📊 部署到生产环境..."
    vercel --prod
else
    echo "📊 部署到预览环境..."
    echo "   提示：使用 --prod 参数部署到生产环境"
    echo ""
    vercel
fi

echo ""
echo "✅ 部署完成！"
echo ""
echo "📋 下一步："
echo "   1. 访问部署链接查看效果"
echo "   2. 如需部署到生产环境，运行：./scripts/deploy-vercel.sh --prod"
echo "   3. 配置自定义域名：vercel.com/dashboard → Project → Settings → Domains"
echo ""
