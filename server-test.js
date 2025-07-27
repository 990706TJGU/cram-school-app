import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

console.log('🚀 啟動測試伺服器...')
console.log(`🌍 環境: ${process.env.NODE_ENV || 'development'}`)
console.log(`🔧 Railway PORT: ${process.env.PORT || '未設定'}`)
console.log(`📡 使用端口: ${PORT}`)

// 基本 CORS 配置
app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json())

// 健康檢查端點
app.get('/api/health', (req, res) => {
  console.log('✅ 健康檢查請求收到')
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: '測試伺服器正常運行',
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  })
})

// 測試端點
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '測試端點正常',
    timestamp: new Date().toISOString()
  })
})

// 根路徑
app.get('/', (req, res) => {
  res.json({ 
    message: 'Railway 測試伺服器',
    status: 'running',
    port: PORT
  })
})

// 錯誤處理
app.use((err, req, res, next) => {
  console.error('❌ 伺服器錯誤:', err)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ 測試伺服器啟動成功`)
  console.log(`🚀 服務運行在 http://0.0.0.0:${PORT}`)
  console.log(`🔍 健康檢查: http://0.0.0.0:${PORT}/api/health`)
  console.log(`🧪 測試端點: http://0.0.0.0:${PORT}/api/test`)
}) 