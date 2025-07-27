#!/bin/bash

# 🚀 補習班管理系統部署腳本
# 使用方法: ./deploy.sh

echo "🚀 開始部署補習班管理系統..."

# 檢查是否在正確的目錄
if [ ! -f "package.json" ]; then
    echo "❌ 錯誤：請在專案根目錄執行此腳本"
    exit 1
fi

# 檢查 Git 狀態
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ Git 工作目錄乾淨"
else
    echo "⚠️  警告：Git 工作目錄有未提交的變更"
    read -p "是否繼續部署？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 部署已取消"
        exit 1
    fi
fi

# 檢查必要的檔案
echo "📋 檢查必要檔案..."
required_files=("package.json" "server-config.js" "config.json" "vercel.json" "railway.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 缺少必要檔案: $file"
        exit 1
    fi
done
echo "✅ 所有必要檔案都存在"

# 檢查 Node.js 版本
echo "📦 檢查 Node.js 版本..."
node_version=$(node --version)
echo "✅ Node.js 版本: $node_version"

# 安裝依賴
echo "📦 安裝依賴..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ 依賴安裝失敗"
    exit 1
fi
echo "✅ 依賴安裝完成"

# 構建前端
echo "🔨 構建前端..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 前端構建失敗"
    exit 1
fi
echo "✅ 前端構建完成"

# 檢查 Git 遠端倉庫
echo "🔗 檢查 Git 遠端倉庫..."
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ 未設定 Git 遠端倉庫"
    echo "請先執行以下命令："
    echo "git remote add origin https://github.com/your-username/cram-school-app.git"
    exit 1
fi

# 提交變更
echo "📝 提交變更..."
git add .
git commit -m "🚀 部署準備 - $(date '+%Y-%m-%d %H:%M:%S')"
if [ $? -ne 0 ]; then
    echo "❌ Git 提交失敗"
    exit 1
fi

# 推送到遠端
echo "📤 推送到遠端倉庫..."
git push origin main
if [ $? -ne 0 ]; then
    echo "❌ Git 推送失敗"
    exit 1
fi

echo ""
echo "🎉 部署準備完成！"
echo ""
echo "📋 下一步："
echo "1. 前往 Railway (https://railway.app) 部署後端"
echo "2. 前往 Vercel (https://vercel.com) 部署前端"
echo "3. 設定環境變數"
echo "4. 測試功能"
echo ""
echo "📖 詳細說明請參考 DEPLOYMENT_GUIDE.md"
echo ""
echo "💰 預估成本："
echo "- 免費方案：$0-15/年"
echo "- 付費方案：$250-255/年"
echo ""
echo "✅ 部署腳本執行完成！" 