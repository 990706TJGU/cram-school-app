import express from 'express'
import { KintoneRestAPIClient } from '@kintone/rest-api-client'
import cors from 'cors'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// 獲取當前檔案的路徑
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 載入配置檔案
const loadConfig = () => {
  try {
    // 優先使用環境變數（Railway 部署）
    if (process.env.KINTONE_DOMAIN) {
      console.log('✅ 使用環境變數配置')
      return {
        kintone: {
          domain: process.env.KINTONE_DOMAIN,
          username: process.env.KINTONE_USERNAME,
          password: process.env.KINTONE_PASSWORD,
          apps: {
            studentAuth: process.env.KINTONE_STUDENT_AUTH,
            teacherAuth: process.env.KINTONE_TEACHER_AUTH,
            lineBinding: process.env.KINTONE_LINE_BINDING
          }
        },
        server: {
          port: process.env.PORT || 3000,
          cors: {
            origins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
              "https://cram-school-app.vercel.app",
              "https://cram-school-app-git-main-990706tjgu.vercel.app",
              "https://cram-school-app-990706tjgu.vercel.app"
            ]
          }
        }
      }
    }

    // 嘗試載入 config.json
    try {
      const configPath = join(__dirname, 'config.json')
      const configData = readFileSync(configPath, 'utf8')
      const config = JSON.parse(configData)
      
      console.log('✅ 配置檔案載入成功')
      console.log('📋 Kintone 配置:')
      console.log(`   Domain: ${config.kintone.domain}`)
      console.log(`   Username: ${config.kintone.username}`)
      console.log(`   Apps: ${JSON.stringify(config.kintone.apps)}`)
      
      return config
    } catch (error) {
      console.log('⚠️ config.json 載入失敗，嘗試 config.railway.json')
    }

    // 嘗試載入 config.railway.json
    try {
      const configPath = join(__dirname, 'config.railway.json')
      const configData = readFileSync(configPath, 'utf8')
      const config = JSON.parse(configData)
      
      console.log('✅ Railway 配置檔案載入成功')
      console.log('📋 Kintone 配置:')
      console.log(`   Domain: ${config.kintone.domain}`)
      console.log(`   Username: ${config.kintone.username}`)
      console.log(`   Apps: ${JSON.stringify(config.kintone.apps)}`)
      
      return config
    } catch (error) {
      console.log('⚠️ config.railway.json 載入失敗')
    }

    // 使用預設配置
    console.log('⚠️ 使用預設配置')
    return {
      kintone: {
        domain: "yqconstruction.cybozu.com",
        username: "Administrator",
        password: "HskX3z5yxKnA",
        apps: {
          studentAuth: "222",
          teacherAuth: "224",
          lineBinding: "225"
        }
      },
      server: {
        port: process.env.PORT || 3000,
        cors: {
          origins: [
            "https://cram-school-app.vercel.app",
            "https://cram-school-app-git-main-990706tjgu.vercel.app",
            "https://cram-school-app-990706tjgu.vercel.app"
          ]
        }
      }
    }
  } catch (error) {
    console.error('❌ 載入配置失敗:', error.message)
    process.exit(1)
  }
}

const CONFIG = loadConfig()
const app = express()
const PORT = process.env.PORT || CONFIG.server.port || 3000

console.log(`🚀 使用端口: ${PORT}`)
console.log(`🌍 環境: ${process.env.NODE_ENV || 'development'}`)
console.log(`🔧 Railway PORT: ${process.env.PORT || '未設定'}`)

// 中間件
app.use(cors({
  origin: CONFIG.server.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// 建立查詢條件
const buildLoginQuery = (username, password) => {
  return `username = "${username}" and password = "${password}"`
}

// 建立 Kintone 客戶端 - 使用帳號密碼認證
const createKintoneClient = () => {
  return new KintoneRestAPIClient({
    baseUrl: `https://${CONFIG.kintone.domain}`,
    auth: {
      username: CONFIG.kintone.username,
      password: CONFIG.kintone.password
    }
  })
}

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: '後端服務正常運行',
    config: {
      domain: CONFIG.kintone.domain,
      apps: CONFIG.kintone.apps
    }
  })
})

// 測試端點
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '測試端點正常',
    timestamp: new Date().toISOString()
  })
})

// Kintone 測試端點
app.get('/api/test-kintone', async (req, res) => {
  try {
    console.log('測試 Kintone 連線...')
    
    const client = createKintoneClient()
    
    const response = await client.record.getAllRecords({
      app: CONFIG.kintone.apps.studentAuth,
      limit: 1
    })
    
    console.log('Kintone 測試成功:', response)
    res.json({
      success: true,
      message: 'Kintone 連線正常',
      data: response
    })
  } catch (error) {
    console.error('Kintone 測試失敗:', error.message)
    res.status(500).json({
      success: false,
      message: 'Kintone 連線失敗',
      error: error.message
    })
  }
})

// 學生登入
app.post('/api/auth/student-login', async (req, res) => {
  try {
    const { username, password } = req.body
    console.log('收到學生登入請求:', { username })
    
    const query = buildLoginQuery(username, password)
    console.log('查詢條件:', query)
    
    const client = createKintoneClient()
    
    const response = await client.record.getAllRecords({
      app: CONFIG.kintone.apps.studentAuth,
      condition: query
    })
    
    if (response && response.length > 0) {
      // 過濾出狀態為 active 的記錄
      const activeRecords = response.filter(record => record.status?.value === 'active')
      
      if (activeRecords.length > 0) {
        const record = activeRecords[0]
        res.json({
          success: true,
          data: {
            user: {
              id: record.$id.value,
              username: record.username.value,
              name: record.student_name?.value || record.name?.value || '學生',
              role: record.role?.value || 'student',
              email: record.email?.value || '',
              phone: record.phone?.value || ''
            },
            token: `kintone-token-${Date.now()}`
          }
        })
      } else {
        res.json({ success: false, message: '帳號已被停用' })
      }
    } else {
      res.json({ success: false, message: '帳號或密碼錯誤' })
    }
  } catch (error) {
    console.error('登入錯誤:', error.message)
    res.status(500).json({
      success: false,
      message: error.message || '登入失敗'
    })
  }
})

// 老師登入
app.post('/api/auth/teacher-login', async (req, res) => {
  try {
    const { username, password } = req.body
    console.log('收到老師登入請求:', { username })
    
    const query = buildLoginQuery(username, password)
    console.log('查詢條件:', query)
    
    const client = createKintoneClient()
    
    const response = await client.record.getAllRecords({
      app: CONFIG.kintone.apps.teacherAuth,
      condition: query
    })
    
    if (response && response.length > 0) {
      // 過濾出狀態為 active 的記錄
      const activeRecords = response.filter(record => record.status?.value === 'active')
      
      if (activeRecords.length > 0) {
        const record = activeRecords[0]
        res.json({
          success: true,
          data: {
            user: {
              id: record.$id.value,
              username: record.username.value,
              name: record.teacher_name?.value || record.name?.value || '老師',
              role: record.role?.value || 'teacher',
              email: record.email?.value || '',
              phone: record.phone?.value || ''
            },
            token: `kintone-token-${Date.now()}`
          }
        })
      } else {
        res.json({ success: false, message: '帳號已被停用' })
      }
    } else {
      res.json({ success: false, message: '帳號或密碼錯誤' })
    }
  } catch (error) {
    console.error('登入錯誤:', error.message)
    res.status(500).json({
      success: false,
      message: error.message || '登入失敗'
    })
  }
})

// 改密碼 API
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, appId, oldPassword, newPassword, userRole } = req.body
    console.log('收到改密碼請求:', { userId, appId, userRole })
    
    // 根據用戶角色或 appId 決定使用哪個應用程式
    let targetAppId = appId
    
    // 如果 appId 是 '1'，根據 userRole 自動判斷正確的應用程式 ID
    if (appId === '1' || appId === 1) {
      if (userRole === 'student' || userRole === 'parent') {
        targetAppId = CONFIG.kintone.apps.studentAuth
      } else if (userRole === 'teacher') {
        targetAppId = CONFIG.kintone.apps.teacherAuth
      } else {
        // 預設使用學生認證應用程式
        targetAppId = CONFIG.kintone.apps.studentAuth
      }
    }
    
    console.log('使用應用程式 ID:', targetAppId)
    
    // 驗證舊密碼
    const verifyQuery = `$id = "${userId}" and password = "${oldPassword}"`
    const client = createKintoneClient()
    
    const verifyResponse = await client.record.getAllRecords({
      app: targetAppId,
      condition: verifyQuery
    })
    
    if (!verifyResponse || verifyResponse.length === 0) {
      return res.json({
        success: false,
        message: '舊密碼錯誤'
      })
    }
    
    // 更新密碼
    const updateResponse = await client.record.updateRecord({
      app: targetAppId,
      id: userId,
      record: {
        password: {
          value: newPassword
        }
      }
    })
    
    console.log('密碼更新成功:', updateResponse)
    res.json({
      success: true,
      message: '密碼修改成功'
    })
    
  } catch (error) {
    console.error('改密碼錯誤:', error.message)
    res.status(500).json({
      success: false,
      message: error.message || '改密碼失敗'
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Kintone 後端服務運行在 http://localhost:${PORT}`)
  console.log(`🔍 健康檢查: http://localhost:${PORT}/api/health`)
  console.log(`🧪 Kintone 測試: http://localhost:${PORT}/api/test-kintone`)
}) 