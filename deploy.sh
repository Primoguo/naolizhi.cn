#!/bin/bash
# 部署脚本 - naolizhi.cn
# 用法: ./deploy.sh

set -e

echo "🔨 构建项目..."
npm run build

echo "📦 上传文件..."
scp -r dist/* root@47.93.160.137:/var/www/naolizhi.cn/

echo "✅ 部署完成！"
echo "🌐 https://naolizhi.cn"
