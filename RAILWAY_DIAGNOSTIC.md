# 🔍 Railway 部署診斷指南

## 📋 當前問題

**症狀**: Railway 構建成功，但健康檢查失敗
```
=== Successfully Built! ===
1/1 replicas never became healthy!
Healthcheck failed!
```

## 🔧 診斷步驟

### 1. 測試伺服器部署
- 使用 `server-test.js` 進行基本功能測試
- 簡化配置，排除 Kintone 相關問題
- 專注於基本的 Express 伺服器啟動

### 2. 端口配置檢查
```javascript
const PORT = process.env.PORT || 3000
console.log(`🚀 使用端口: ${PORT}`)
console.log(`🔧 Railway PORT: ${process.env.PORT || '未設定'}`)
```

### 3. 監聽配置
```javascript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ 測試伺服器啟動成功`)
  console.log(`🚀 服務運行在 http://0.0.0.0:${PORT}`)
})
```

## 📊 預期結果

### 成功指標
- ✅ 構建成功: "Successfully Built!"
- ✅ 健康檢查通過: 1/1 replicas healthy
- ✅ 服務響應: `/api/health` 返回 200 OK

### 失敗指標
- ❌ 健康檢查失敗: "service unavailable"
- ❌ 服務啟動失敗: 端口綁定錯誤
- ❌ 配置載入失敗: 檔案不存在

## 🔍 故障排除

### 1. 檢查 Railway 日誌
1. 前往 Railway 控制台
2. 查看 "Deployments" 標籤
3. 點擊最新的部署
4. 查看 "Logs" 標籤

### 2. 常見錯誤
```
Error: listen EADDRINUSE
- 原因: 端口已被佔用
- 解決: 使用 process.env.PORT

Error: Cannot find module
- 原因: 依賴未安裝
- 解決: 檢查 package.json

Error: ENOENT: no such file or directory
- 原因: 配置檔案不存在
- 解決: 檢查檔案路徑
```

### 3. 環境變數檢查
Railway 應該自動提供：
- `PORT`: Railway 分配的端口
- `NODE_ENV`: 環境變數

## 🚀 測試流程

### 階段 1: 基本伺服器測試
```bash
# 使用 server-test.js
startCommand: "node server-test.js"
```

### 階段 2: 配置載入測試
```bash
# 使用 server-config.js
startCommand: "node server-config.js"
```

### 階段 3: 完整功能測試
```bash
# 使用完整的 Kintone 整合
startCommand: "node server-config.js"
```

## 📝 日誌分析

### 成功日誌
```
🚀 啟動測試伺服器...
🌍 環境: production
🔧 Railway PORT: 12345
📡 使用端口: 12345
✅ 測試伺服器啟動成功
🚀 服務運行在 http://0.0.0.0:12345
✅ 健康檢查請求收到
```

### 失敗日誌
```
❌ 載入配置失敗: ENOENT: no such file or directory
❌ 伺服器錯誤: listen EADDRINUSE
❌ 模組未找到: Cannot find module 'express'
```

## 🎯 下一步行動

1. **等待測試部署**: Railway 會自動重新部署測試伺服器
2. **檢查日誌**: 查看 Railway 控制台的詳細日誌
3. **分析結果**: 根據日誌確定問題根源
4. **修復問題**: 根據診斷結果進行修復

## 📞 支援

如果測試伺服器仍然失敗，請：
1. 分享 Railway 控制台的完整日誌
2. 確認所有檔案都已正確推送
3. 檢查 Railway 專案設定
4. 聯繫技術支援 