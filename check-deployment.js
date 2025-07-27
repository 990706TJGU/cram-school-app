import axios from 'axios'

const RAILWAY_URL = 'https://cram-school-app-production.up.railway.app'
const VERCEL_URL = 'https://cram-school-app-ashy.vercel.app'

console.log('🔍 檢查部署狀態...\n')

// 檢查 Railway 後端
async function checkRailwayBackend() {
  try {
    console.log('🚂 檢查 Railway 後端...')
    const response = await axios.get(`${RAILWAY_URL}/api/health`, {
      timeout: 5000
    })
    console.log('✅ Railway 後端正常:', response.data)
    return true
  } catch (error) {
    console.log('❌ Railway 後端錯誤:', error.message)
    return false
  }
}

// 檢查 Vercel 前端
async function checkVercelFrontend() {
  try {
    console.log('\n🌐 檢查 Vercel 前端...')
    const response = await axios.get(VERCEL_URL, {
      timeout: 5000
    })
    console.log('✅ Vercel 前端正常:', response.status)
    return true
  } catch (error) {
    console.log('❌ Vercel 前端錯誤:', error.message)
    return false
  }
}

// 檢查基本 API 端點
async function checkBasicAPI() {
  try {
    console.log('\n🔗 檢查基本 API 端點...')
    const response = await axios.get(`${RAILWAY_URL}/api/test`, {
      timeout: 5000
    })
    console.log('✅ 基本 API 正常:', response.data)
    return true
  } catch (error) {
    console.log('❌ 基本 API 錯誤:', error.message)
    return false
  }
}

// 主函數
async function main() {
  console.log('📋 部署狀態檢查報告')
  console.log('=' * 50)
  
  const backendOk = await checkRailwayBackend()
  const frontendOk = await checkVercelFrontend()
  const apiOk = await checkBasicAPI()
  
  console.log('\n📊 檢查結果:')
  console.log(`🚂 Railway 後端: ${backendOk ? '✅ 正常' : '❌ 異常'}`)
  console.log(`🌐 Vercel 前端: ${frontendOk ? '✅ 正常' : '❌ 異常'}`)
  console.log(`🔗 基本 API: ${apiOk ? '✅ 正常' : '❌ 異常'}`)
  
  if (backendOk && frontendOk && apiOk) {
    console.log('\n🎉 所有服務正常運行！')
    console.log('\n📝 部署資訊:')
    console.log(`🚂 Railway 後端: ${RAILWAY_URL}`)
    console.log(`🌐 Vercel 前端: ${VERCEL_URL}`)
    console.log('\n🔗 前端現在應該可以正常連接後端了！')
  } else {
    console.log('\n⚠️ 發現問題，請檢查相關服務。')
  }
}

main().catch(console.error) 