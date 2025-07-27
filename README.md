# Kintone 補習班應用程式

## 概述
這是一個使用 React + Vite 前端和 Node.js + Express 後端的補習班管理系統，整合 Kintone 平台進行資料管理。

## 配置管理
本專案使用 **JSON 配置檔案** 來管理 Kintone 設定，完全移除了 `.env` 環境變數的使用，這是一個更穩定且易於管理的解決方案。

## 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 設定配置檔案
```bash
# 使用 PowerShell 腳本建立配置檔案
.\setup-json-config.ps1

# 或手動複製範本
cp config.example.json config.json
```

### 3. 編輯配置
編輯 `config.json` 檔案，更新你的 Kintone 帳號密碼：
```json
{
  "kintone": {
    "domain": "your-domain.cybozu.com",
    "username": "your-username",
    "password": "your-password",
    "apps": {
      "studentAuth": "222",
      "teacherAuth": "224",
      "lineBinding": "225"
    }
  }
}
```

### 4. 驗證配置
```bash
node test-config.js
```

### 5. 啟動後端服務器
```bash
node server-config.js
```

### 6. 啟動前端開發服務器
```bash
npm run dev
```

## 檔案結構

### 核心檔案
- `config.json` - 主要配置檔案 (已加入 .gitignore)
- `config.example.json` - 配置範本
- `server-config.js` - 後端服務器 (使用 JSON 配置)
- `test-config.js` - 配置驗證腳本

### 管理腳本
- `setup-json-config.ps1` - 配置檔案建立腳本
- `validate-config-simple.ps1` - 配置驗證腳本

### 文檔
- `JSON_CONFIG_GUIDE.md` - 詳細使用指南
- `JSON_CONFIG_SUMMARY.md` - 方案總結

## API 端點

### 健康檢查
- `GET /api/health` - 服務器健康檢查

### 認證
- `POST /api/auth/student-login` - 學生登入
- `POST /api/auth/teacher-login` - 老師登入
- `POST /api/auth/change-password` - 改密碼

### 測試
- `GET /api/test-kintone` - Kintone 連線測試

## 配置說明

### Kintone 配置
| 項目 | 說明 |
|------|------|
| `domain` | Kintone 網域 |
| `username` | Kintone 登入帳號 |
| `password` | Kintone 登入密碼 |
| `apps.studentAuth` | 學生認證應用程式 ID |
| `apps.teacherAuth` | 老師認證應用程式 ID |
| `apps.lineBinding` | LINE 綁定應用程式 ID |

### 服務器配置
| 項目 | 說明 |
|------|------|
| `port` | 後端服務器埠號 |
| `cors.origins` | 允許的前端來源 |

## 安全性

- ✅ `config.json` 已加入 `.gitignore`
- ✅ 提供 `config.example.json` 作為範本
- ✅ 配置驗證機制
- ✅ 支援環境變數覆蓋

## 故障排除

### 常見問題

1. **配置檔案載入失敗**
   - 檢查 `config.json` 檔案是否存在
   - 確認 JSON 語法正確

2. **Kintone 認證失敗**
   - 確認帳號密碼正確
   - 檢查 Kintone 帳號權限

3. **埠號被佔用**
   ```bash
   # 查看佔用埠號的進程
   netstat -ano | findstr :8000
   
   # 終止進程
   taskkill /PID <PID> /F
   ```

## 開發工具

### 配置驗證
```bash
# 驗證配置檔案
node test-config.js

# 使用 PowerShell 腳本驗證
.\validate-config-simple.ps1
```

### 服務器管理
```bash
# 啟動服務器
node server-config.js

# 測試 API
curl http://localhost:8000/api/health
```

## 技術棧

- **前端**: React, Vite, TypeScript, Ant Design
- **後端**: Node.js, Express.js
- **資料庫**: Kintone REST API
- **配置管理**: JSON 配置檔案

## 授權
MIT License 