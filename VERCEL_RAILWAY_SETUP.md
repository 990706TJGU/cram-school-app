# 🔗 Vercel + Railway 整合設置指南

## 📋 當前問題

**症狀**: Vercel 前端部署成功，但頁面顯示空白
- ✅ Vercel 部署: https://cram-school-app-ashy.vercel.app/
- ❌ 頁面內容: 空白或無法載入

## 🔍 問題診斷

### 1. 檢查 Vercel 部署日誌
1. 前往 Vercel 控制台
2. 點擊專案 "cram-school-app"
3. 查看 "Deployments" 標籤
4. 檢查最新部署的日誌

### 2. 檢查瀏覽器開發者工具
1. 打開 https://cram-school-app-ashy.vercel.app/
2. 按 F12 打開開發者工具
3. 查看 "Console" 標籤的錯誤信息
4. 查看 "Network" 標籤的請求狀態

## 🔧 修復步驟

### 步驟 1: 獲取 Railway 後端 URL
1. 前往 Railway 控制台
2. 點擊您的後端專案
3. 在 "Settings" 標籤中找到 "Domains"
4. 複製生成的 URL（例如：https://your-app-name.railway.app）

### 步驟 2: 更新 vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-actual-railway-url.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 步驟 3: 更新前端 API 配置
檢查 `src/services/api.ts` 中的 `baseURL` 配置：
```typescript
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 步驟 4: 設定 Vercel 環境變數
在 Vercel 控制台設定環境變數：
```
VITE_API_URL=https://your-actual-railway-url.railway.app
```

## 📊 常見錯誤

### 1. CORS 錯誤
```
Access to XMLHttpRequest at 'https://railway-url.railway.app/api/auth/login' 
from origin 'https://cram-school-app-ashy.vercel.app' 
has been blocked by CORS policy
```
**解決方案**: 更新 Railway 的 CORS 配置

### 2. 404 錯誤
```
GET https://your-backend-url.railway.app/api/health 404
```
**解決方案**: 更新 vercel.json 中的後端 URL

### 3. 空白頁面
```
Uncaught TypeError: Cannot read property 'xxx' of undefined
```
**解決方案**: 檢查前端代碼中的 API 調用

## 🚀 快速修復

### 方法 1: 使用環境變數
1. 在 Vercel 控制台設定環境變數：
   ```
   VITE_API_URL=https://your-railway-url.railway.app
   ```

2. 更新 `vercel.json`：
   ```json
   {
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "https://your-railway-url.railway.app/api/$1"
       }
     ]
   }
   ```

### 方法 2: 直接硬編碼（臨時）
更新 `vercel.json` 中的後端 URL：
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-actual-railway-url.railway.app/api/$1"
    }
  ]
}
```

## 📝 檢查清單

- [ ] 獲取 Railway 後端 URL
- [ ] 更新 vercel.json 中的後端 URL
- [ ] 更新 Railway CORS 配置
- [ ] 設定 Vercel 環境變數
- [ ] 重新部署前端
- [ ] 測試 API 連接

## 🎯 下一步

1. **獲取 Railway URL**: 從 Railway 控制台複製後端 URL
2. **更新配置**: 修改 vercel.json 和環境變數
3. **重新部署**: 推送代碼觸發 Vercel 重新部署
4. **測試功能**: 確認前端可以正常連接後端

## 📞 支援

如果仍然有問題，請提供：
1. Railway 後端 URL
2. Vercel 部署日誌
3. 瀏覽器開發者工具的錯誤信息 