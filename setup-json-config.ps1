# JSON 配置檔案設定腳本
# 使用方法: .\setup-json-config.ps1

Write-Host "🔧 設定 JSON 配置檔案..." -ForegroundColor Green

# 檢查是否已存在 config.json
if (Test-Path "config.json") {
    Write-Host "⚠️  config.json 已存在，是否要覆蓋？ (y/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "❌ 操作已取消" -ForegroundColor Red
        exit
    }
}

# 建立 JSON 配置檔案內容
$configContent = @"
{
  "kintone": {
    "domain": "yqconstruction.cybozu.com",
    "username": "yqconstruction",
    "password": "yqconstruction123",
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
"@

# 寫入 config.json 檔案
$configContent | Out-File -FilePath "config.json" -Encoding UTF8 -NoNewline

Write-Host "✅ config.json 檔案已建立！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 檔案內容:" -ForegroundColor Yellow
Get-Content config.json | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
Write-Host ""
Write-Host "⚠️  請記得修改 username 和 password 為你的實際 Kintone 帳號密碼！" -ForegroundColor Red
Write-Host ""
Write-Host "🚀 現在可以執行: node server-config.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 詳細說明請參考: JSON_CONFIG_GUIDE.md" -ForegroundColor Blue 