# JSON 配置檔案使用指南

## 概述
本專案使用 JSON 配置檔案來管理 Kintone 設定，這是一個比 `.env` 檔案更穩定且易於管理的解決方案。

## 快速開始

### 1. 設定配置檔案

**方法 1: 複製範本**
```bash
# 複製範本檔案
cp config.example.json config.json

# 編輯配置檔案
# 修改 config.json 中的帳號密碼
```

**方法 2: 使用 PowerShell 腳本**
```powershell
# 執行設定腳本
.\setup-json-config.ps1
```

### 2. 啟動服務器
```bash
node server-config.js
```

### 3. 測試功能
```bash
# 健康檢查
curl http://localhost:8000/api/health

# Kintone 連線測試
curl http://localhost:8000/api/test-kintone
```

## 配置檔案結構

### config.json
```json
{
  "kintone": {
    "domain": "yqconstruction.cybozu.com",
    "username": "your-username",
    "password": "your-password",
    "apps": {
      "studentAuth": "222",
      "teacherAuth": "224",
      "lineBinding": "225"
    }
  },
  "server": {
    "port": 8000,
    "cors": {
      "origins": [
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005"
      ]
    }
  }
}
```

## 配置項目說明

### Kintone 配置
| 項目 | 說明 | 範例 |
|------|------|------|
| `domain` | Kintone 網域 | `yqconstruction.cybozu.com` |
| `username` | Kintone 登入帳號 | `admin` |
| `password` | Kintone 登入密碼 | `your-password` |
| `apps.studentAuth` | 學生認證應用程式 ID | `222` |
| `apps.teacherAuth` | 老師認證應用程式 ID | `224` |
| `apps.lineBinding` | LINE 綁定應用程式 ID | `225` |

### 服務器配置
| 項目 | 說明 | 範例 |
|------|------|------|
| `port` | 後端服務器埠號 | `8000` |
| `cors.origins` | 允許的前端來源 | `["http://localhost:3001"]` |

## 更新配置

### 修改 Kintone 帳號密碼
編輯 `config.json` 檔案：
```json
{
  "kintone": {
    "username": "你的實際Kintone帳號",
    "password": "你的實際Kintone密碼"
  }
}
```

### 修改應用程式 ID
```json
{
  "kintone": {
    "apps": {
      "studentAuth": "新的學生應用程式ID",
      "teacherAuth": "新的老師應用程式ID"
    }
  }
}
```

### 修改服務器埠號
```json
{
  "server": {
    "port": 8080
  }
}
```

## 驗證配置

### 檢查配置檔案
```bash
# 檢查 JSON 語法
node -e "JSON.parse(require('fs').readFileSync('config.json', 'utf8')); console.log('✅ JSON 語法正確')"
```

### 測試服務器載入
```bash
node server-config.js
```

成功載入時會看到：
```
✅ 配置檔案載入成功
📋 Kintone 配置:
   Domain: yqconstruction.cybozu.com
   Username: your-username
   Apps: {"studentAuth":"222","teacherAuth":"224","lineBinding":"225"}
```

### 測試 API 端點
```powershell
# 健康檢查
Invoke-RestMethod -Uri "http://localhost:8000/api/health" -Method Get

# Kintone 連線測試
Invoke-RestMethod -Uri "http://localhost:8000/api/test-kintone" -Method Get
```

## 環境管理

### 開發環境
使用 `config.json` 進行開發和測試

### 生產環境
建議使用環境變數覆蓋敏感資訊：
```bash
# 在生產環境中設定環境變數
export KINTONE_USERNAME=production-username
export KINTONE_PASSWORD=production-password
```

## 故障排除

### 問題 1: 配置檔案載入失敗
**症狀**: `❌ 載入配置檔案失敗`
**解決方案**:
1. 檢查 `config.json` 檔案是否存在
2. 確認 JSON 語法正確
3. 檢查檔案權限

### 問題 2: JSON 語法錯誤
**症狀**: `SyntaxError: Unexpected token`
**解決方案**:
1. 使用 JSON 驗證工具檢查語法
2. 確認引號和逗號正確
3. 檢查是否有多餘的逗號

### 問題 3: Kintone 認證失敗
**症狀**: `[401] [CB_WA01] 使用者密碼驗證失敗`
**解決方案**:
1. 確認帳號密碼正確
2. 檢查 Kintone 帳號是否有效
3. 確認帳號有足夠權限

## 安全性最佳實踐

1. **保護配置檔案**
   - `config.json` 已加入 `.gitignore`
   - 只提交 `config.example.json` 作為範本

2. **敏感資訊管理**
   - 不要在程式碼中硬編碼密碼
   - 定期更換 Kintone 密碼
   - 使用強密碼

3. **環境隔離**
   - 開發和生產環境使用不同配置
   - 在生產環境使用環境變數

## 開發工作流程

1. **初始設定**
   ```bash
   cp config.example.json config.json
   # 編輯 config.json
   ```

2. **開發測試**
   ```bash
   node server-config.js
   # 測試 API 端點
   ```

3. **部署**
   ```bash
   # 在生產環境設定環境變數
   # 啟動服務器
   node server-config.js
   ```

## 與 .env 方案的比較

| 特性 | JSON 配置 | .env 檔案 |
|------|-----------|-----------|
| 編碼問題 | ❌ 無 | ⚠️ 可能有 |
| 結構化 | ✅ 支援 | ❌ 不支援 |
| 註解支援 | ❌ 不支援 | ✅ 支援 |
| 工具支援 | ✅ 優秀 | ✅ 良好 |
| 易讀性 | ✅ 優秀 | ✅ 良好 |
| 維護性 | ✅ 優秀 | ⚠️ 一般 |

## 總結

JSON 配置檔案方案提供了：
- ✅ 無編碼問題
- ✅ 結構化配置
- ✅ 易於維護
- ✅ 良好的工具支援
- ✅ 標準格式

這是一個比 `.env` 檔案更穩定且易於管理的解決方案。 