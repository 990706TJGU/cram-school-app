# 🚀 Vercel 部署修復指南

## 🔧 修復的問題

### 1. 移除舊版環境變數語法
- **問題**: `vercel.json` 中使用了舊版的 `env` 字段
- **修復**: 移除 `env` 字段，環境變數應在 Vercel 控制台設定

### 2. 添加 Node.js 版本指定
- **問題**: 缺少 Node.js 版本指定，可能導致版本不兼容
- **修復**: 在 `package.json` 中添加 `"engines": { "node": ">=18.0.0" }`

### 3. 修復路徑別名配置
- **問題**: `vite.config.ts` 中使用絕對路徑 `'@': '/src'`
- **修復**: 改為相對路徑 `'@': resolve(__dirname, 'src')`

### 4. 分離前後端依賴
- **問題**: 前端 `package.json` 包含後端依賴（express、cors、dotenv）
- **修復**: 
  - 從前端 `package.json` 移除後端依賴
  - 創建 `package-backend.json` 專門給後端使用

### 5. 優化構建配置
- **問題**: 構建配置不夠穩定
- **修復**: 
  - 添加 `build:vercel` 腳本
  - 在 `vite.config.ts` 中添加生產構建配置
  - 更新 `vercel.json` 使用新的構建腳本

## 📋 部署步驟

### 1. 提交修復
```bash
git add .
git commit -m "🔧 修復 Vercel 部署問題"
git push origin main
```

### 2. Vercel 環境變數設定
在 Vercel 控制台中設定以下環境變數：
```
VITE_API_URL=https://your-backend-url.railway.app
```

### 3. 重新部署
- 前往 Vercel 控制台
- 點擊 "Redeploy" 按鈕
- 或推送新的 commit 觸發自動部署

## 🔍 故障排除

### 如果仍然失敗：
1. **檢查 Vercel 日誌**: 查看詳細的構建日誌
2. **本地測試**: 執行 `npm run build:vercel` 確保本地構建成功
3. **清除快取**: 在 Vercel 控制台清除構建快取
4. **檢查依賴**: 確保所有依賴都正確安裝

### 常見錯誤：
- **Exit code 126**: 通常是構建命令失敗
- **Module not found**: 檢查路徑別名配置
- **TypeScript errors**: 檢查 `tsconfig.json` 配置

## 📁 文件結構
```
├── package.json          # 前端依賴
├── package-backend.json  # 後端依賴
├── vercel.json          # Vercel 配置
├── railway.json         # Railway 配置
├── vite.config.ts       # Vite 配置
└── tsconfig.json        # TypeScript 配置
```

## ✅ 驗證清單
- [ ] 本地構建成功: `npm run build:vercel`
- [ ] 所有依賴正確分離
- [ ] 環境變數在 Vercel 控制台設定
- [ ] 路徑別名配置正確
- [ ] Node.js 版本指定正確 