# 🚀 部署指南 - 補習班管理系統

## 📋 部署方案總覽

### 🎯 推薦方案：Vercel + Railway (免費/低成本)
- **前端**: Vercel (免費)
- **後端**: Railway ($5/月免費額度)
- **總成本**: $0-20/月
- **適合**: 中小型補習班，100-1000用戶

### 🏢 企業方案：AWS/GCP/Azure
- **成本**: $20-80/月
- **適合**: 大型補習班，1000+用戶

---

## 🚀 快速部署 (Vercel + Railway)

### 步驟 1: 準備 GitHub 倉庫

1. **建立 GitHub 倉庫**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/cram-school-app.git
git push -u origin main
```

2. **更新 .gitignore**
```gitignore
# 環境變數
.env
config.json

# Node.js
node_modules/

# 構建檔案
dist/
build/

# 日誌檔案
*.log
```

### 步驟 2: 部署後端 (Railway)

1. **註冊 Railway 帳號**
   - 前往 [railway.app](https://railway.app)
   - 使用 GitHub 登入

2. **建立新專案**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇你的倉庫

3. **設定環境變數**
   - 在 Railway 專案設定中新增環境變數：
   ```
   NODE_ENV=production
   PORT=3000
   ```

4. **部署後端**
   - Railway 會自動檢測 `railway.json`
   - 自動部署 `server-config.js`

5. **取得後端 URL**
   - 部署完成後，複製 Railway 提供的 URL
   - 例如：`https://your-app.railway.app`

### 步驟 3: 部署前端 (Vercel)

1. **註冊 Vercel 帳號**
   - 前往 [vercel.com](https://vercel.com)
   - 使用 GitHub 登入

2. **匯入專案**
   - 點擊 "New Project"
   - 選擇你的 GitHub 倉庫

3. **設定環境變數**
   - 在 Vercel 專案設定中新增：
   ```
   VITE_API_URL=https://your-app.railway.app
   ```

4. **更新 vercel.json**
   - 將 `your-backend-url.railway.app` 替換為實際的 Railway URL

5. **部署前端**
   - Vercel 會自動構建和部署
   - 獲得前端 URL，例如：`https://your-app.vercel.app`

### 步驟 4: 設定自定義域名 (可選)

1. **購買域名**
   - 推薦：Namecheap, GoDaddy, Google Domains
   - 成本：$10-15/年

2. **設定 DNS**
   - 前端：CNAME 指向 Vercel
   - 後端：CNAME 指向 Railway

---

## 💰 成本分析

### 免費方案 (推薦)
| 服務 | 成本 | 限制 |
|------|------|------|
| Vercel (前端) | $0 | 100GB 頻寬/月 |
| Railway (後端) | $0 | $5 免費額度/月 |
| 域名 | $10-15/年 | 可選 |
| **總計** | **$0-15/年** | 適合小型補習班 |

### 付費方案
| 服務 | 成本 | 功能 |
|------|------|------|
| Vercel Pro | $20/月 | 無限頻寬 |
| Railway Pro | $20/月 | 更多資源 |
| 域名 | $10-15/年 | 自定義域名 |
| **總計** | **$250-255/年** | 適合中型補習班 |

### 企業方案
| 服務 | 成本 | 功能 |
|------|------|------|
| AWS/GCP/Azure | $50-100/月 | 企業級服務 |
| 域名 | $10-15/年 | 自定義域名 |
| SSL 證書 | $0-100/年 | 免費 Let's Encrypt |
| **總計** | **$610-1215/年** | 適合大型補習班 |

---

## 🔧 部署後配置

### 1. 更新 Kintone 配置
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

### 2. 設定 CORS
在 `server-config.js` 中更新 CORS 設定：
```javascript
cors: {
  origins: [
    "https://your-app.vercel.app",
    "https://your-domain.com"
  ]
}
```

### 3. 環境變數管理
- **開發環境**: 使用 `config.json`
- **生產環境**: 使用 Railway 環境變數

---

## 📊 性能優化

### 前端優化
1. **程式碼分割**
2. **圖片壓縮**
3. **CDN 快取**
4. **Gzip 壓縮**

### 後端優化
1. **資料庫索引**
2. **API 快取**
3. **負載平衡**
4. **監控日誌**

---

## 🔒 安全性考量

### 1. HTTPS 強制
- Vercel 和 Railway 自動提供 HTTPS
- 設定 HSTS 標頭

### 2. 環境變數保護
- 不要將敏感資訊提交到 Git
- 使用環境變數管理密碼

### 3. API 限制
- 實作 Rate Limiting
- 設定 API 金鑰

### 4. 資料備份
- 定期備份 Kintone 資料
- 設定自動備份策略

---

## 📈 監控與維護

### 1. 性能監控
- Vercel Analytics (免費)
- Railway Metrics
- 自定義監控

### 2. 錯誤追蹤
- Sentry (免費方案)
- 自定義錯誤日誌

### 3. 定期維護
- 更新依賴套件
- 檢查安全漏洞
- 備份資料

---

## 🎯 推薦部署流程

1. **選擇方案**: Vercel + Railway (免費開始)
2. **準備程式碼**: 確保所有功能正常
3. **部署後端**: Railway 自動部署
4. **部署前端**: Vercel 自動部署
5. **設定域名**: 購買自定義域名 (可選)
6. **測試功能**: 確保所有功能正常運作
7. **監控維護**: 定期檢查和更新

**總成本**: $0-15/年 (免費方案) 或 $250-255/年 (付費方案) 