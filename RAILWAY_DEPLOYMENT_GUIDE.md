# 🚂 Railway 後端部署指南

## 📋 部署狀態

### ✅ 已修復的問題
- **健康檢查失敗**: 配置檔案載入問題
- **環境變數支援**: 添加 Railway 環境變數支援
- **備用配置**: 創建 `config.railway.json` 備用配置檔案

## 🔧 修復內容

### 1. 配置檔案載入邏輯
```javascript
// 優先順序：
// 1. 環境變數（Railway 部署）
// 2. config.json（本地開發）
// 3. config.railway.json（備用配置）
// 4. 預設配置（最後備用）
```

### 2. 環境變數支援
Railway 可以設定以下環境變數：
```
KINTONE_DOMAIN=yqconstruction.cybozu.com
KINTONE_USERNAME=Administrator
KINTONE_PASSWORD=Yqconstruction@2024
KINTONE_STUDENT_AUTH=222
KINTONE_TEACHER_AUTH=224
KINTONE_LINE_BINDING=225
CORS_ORIGINS=https://cram-school-app.vercel.app,https://cram-school-app-git-main-990706tjgu.vercel.app
```

### 3. Railway 配置檔案
- `railway.json`: Railway 部署配置
- `config.railway.json`: 備用配置檔案
- `package-backend.json`: 後端依賴配置

## 🚀 部署步驟

### 1. Railway 控制台設定
1. 前往 Railway 專案控制台
2. 在 "Variables" 標籤中設定環境變數（可選）
3. 如果沒有設定環境變數，會自動使用 `config.railway.json`

### 2. 自動部署
- Railway 會自動監控 GitHub 倉庫
- 推送代碼後會自動觸發部署
- 構建時間約 105 秒

### 3. 健康檢查
- 路徑: `/api/health`
- 超時: 100 秒
- 重試: 最多 10 次

## 📊 部署狀態檢查

### 成功指標
- ✅ 構建成功: "Successfully Built!"
- ✅ 健康檢查通過: 1/1 replicas healthy
- ✅ 服務可用: 可以訪問 `/api/health`

### 失敗指標
- ❌ 健康檢查失敗: "1/1 replicas never became healthy"
- ❌ 服務不可用: "service unavailable"

## 🔍 故障排除

### 1. 健康檢查失敗
**原因**: 配置檔案載入失敗或服務啟動失敗
**解決方案**: 
- 檢查 Railway 日誌
- 確認 `config.railway.json` 存在
- 設定環境變數

### 2. 構建失敗
**原因**: 依賴安裝失敗或配置錯誤
**解決方案**:
- 檢查 `package-backend.json`
- 確認 Node.js 版本 >= 18.0.0
- 檢查 Railway 構建日誌

### 3. 服務不可用
**原因**: 端口配置錯誤或 CORS 問題
**解決方案**:
- 確認使用 `process.env.PORT`
- 檢查 CORS 配置
- 確認 Vercel 域名在允許列表中

## 📝 配置檔案說明

### config.railway.json
```json
{
  "kintone": {
    "domain": "yqconstruction.cybozu.com",
    "username": "Administrator",
    "password": "Yqconstruction@2024",
    "apps": {
      "studentAuth": "222",
      "teacherAuth": "224",
      "lineBinding": "225"
    }
  },
  "server": {
    "port": 3000,
    "cors": {
      "origins": [
        "https://cram-school-app.vercel.app",
        "https://cram-school-app-git-main-990706tjgu.vercel.app",
        "https://cram-school-app-990706tjgu.vercel.app"
      ]
    }
  }
}
```

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install --prefix . && npm install --prefix . --package-lock-only"
  },
  "deploy": {
    "startCommand": "node server-config.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## 🎯 下一步

1. **等待自動部署**: Railway 會自動重新部署
2. **檢查健康狀態**: 監控健康檢查結果
3. **測試 API 端點**: 確認後端服務正常運行
4. **更新前端配置**: 將 Vercel 前端指向 Railway 後端

## 📞 支援

如果部署仍然失敗，請：
1. 檢查 Railway 控制台的詳細日誌
2. 確認所有配置檔案正確
3. 驗證環境變數設定
4. 聯繫技術支援 