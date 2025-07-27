# 簡化配置檔案驗證腳本
# 使用方法: .\validate-config-simple.ps1

Write-Host "🔍 驗證配置檔案..." -ForegroundColor Green

# 檢查 config.json 是否存在
if (-not (Test-Path "config.json")) {
    Write-Host "❌ config.json 檔案不存在！" -ForegroundColor Red
    Write-Host "請先執行 .\setup-json-config.ps1 建立配置檔案" -ForegroundColor Yellow
    exit 1
}

# 讀取並解析 JSON
try {
    $configContent = Get-Content "config.json" -Raw
    $config = $configContent | ConvertFrom-Json
    Write-Host "✅ JSON 語法正確" -ForegroundColor Green
} catch {
    Write-Host "❌ JSON 語法錯誤: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 顯示配置摘要
Write-Host ""
Write-Host "📋 配置摘要:" -ForegroundColor Yellow
Write-Host "   Domain: $($config.kintone.domain)" -ForegroundColor Gray
Write-Host "   Username: $($config.kintone.username)" -ForegroundColor Gray
Write-Host "   Apps:" -ForegroundColor Gray
Write-Host "     Student Auth: $($config.kintone.apps.studentAuth)" -ForegroundColor Gray
Write-Host "     Teacher Auth: $($config.kintone.apps.teacherAuth)" -ForegroundColor Gray
Write-Host "     Line Binding: $($config.kintone.apps.lineBinding)" -ForegroundColor Gray
Write-Host "   Port: $($config.server.port)" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 配置驗證完成！" -ForegroundColor Green
Write-Host "現在可以執行: node server-config.js" -ForegroundColor Cyan 