import axios from 'axios'
import { KINTONE_CONFIG, KINTONE_FIELDS, ROLES, STATUS } from '@/config/kintone'
import { KINTONE_TEST_CONFIG, IS_TEST_MODE } from '@/config/kintoneTest'

// 選擇配置
const CONFIG = IS_TEST_MODE ? KINTONE_TEST_CONFIG : KINTONE_CONFIG

// 建立後端代理 API 實例
const proxyAPI = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 響應攔截器：處理錯誤
proxyAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Proxy API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// 代理 API 方法
export const kintoneService = {
  // 查詢記錄
  async getRecords(appId: string, query?: string) {
    const params: any = { app: appId }
    if (query) {
      params.query = query
    }
    
    const response = await proxyAPI.get('/kintone/records', { params })
    return response.data
  },

  // 取得單筆記錄
  async getRecord(appId: string, recordId: string) {
    const response = await proxyAPI.get(`/kintone/record`, {
      params: { app: appId, id: recordId }
    })
    return response.data
  },

  // 新增記錄
  async createRecord(appId: string, record: any) {
    const response = await proxyAPI.post('/kintone/record', {
      app: appId,
      record
    })
    return response.data
  },

  // 更新記錄
  async updateRecord(appId: string, recordId: string, record: any) {
    const response = await proxyAPI.put('/kintone/record', {
      app: appId,
      id: recordId,
      record
    })
    return response.data
  },

  // 刪除記錄
  async deleteRecord(appId: string, recordId: string) {
    const response = await proxyAPI.delete('/kintone/record', {
      params: { app: appId, id: recordId }
    })
    return response.data
  },

  // 批量操作
  async bulkRequest(requests: any[]) {
    const response = await proxyAPI.post('/kintone/bulkRequest', { requests })
    return response.data
  },
}

// 認證相關 API
export const authAPI = {
  // 學生/家長登入
  async studentLogin(username: string, password: string) {
    try {
      const response = await proxyAPI.post('/auth/student-login', {
        username,
        password
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '登入失敗'
      }
    }
  },

  // 老師登入
  async teacherLogin(username: string, password: string) {
    try {
      const response = await proxyAPI.post('/auth/teacher-login', {
        username,
        password
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '登入失敗'
      }
    }
  },

  // 改密碼
  async changePassword(userId: string, appId: string, oldPassword: string, newPassword: string, userRole?: string) {
    try {
      const response = await proxyAPI.post('/auth/change-password', {
        userId,
        appId,
        oldPassword,
        newPassword,
        userRole
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '改密碼失敗'
      }
    }
  },

  // 驗證碼登入（學生姓名 + 驗證碼）
  async verificationLogin(studentName: string, verificationCode: string) {
    // 先查詢學生是否存在
    const studentQuery = `${KINTONE_FIELDS.STUDENT_AUTH.STUDENT_NAME} = "${studentName}"`
    
    try {
      const studentResponse = await kintoneService.getRecords(
        CONFIG.APPS.STUDENT_AUTH,
        studentQuery
      )
      
      if (studentResponse.records && studentResponse.records.length > 0) {
        // 過濾出狀態為 active 的記錄
        const activeRecords = studentResponse.records.filter((record: any) => 
          record[KINTONE_FIELDS.STUDENT_AUTH.STATUS]?.value === STATUS.ACTIVE
        )
        
        if (activeRecords.length === 0) {
          return {
            success: false,
            message: '帳號已被停用'
          }
        }
        
        const studentRecord = activeRecords[0]
        
        // 這裡可以加入驗證碼驗證邏輯
        // 暫時使用簡單的驗證碼檢查
        if (verificationCode === '123456') { // 預設驗證碼
          return {
            success: true,
            data: {
              user: {
                id: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.ID].value,
                username: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.USERNAME].value,
                name: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.STUDENT_NAME].value,
                email: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.EMAIL]?.value || '',
                phone: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.PHONE]?.value || '',
                role: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.ROLE]?.value || ROLES.STUDENT,
                status: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.STATUS]?.value || STATUS.ACTIVE,
                lineId: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.LINE_ID]?.value || '',
                createdAt: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.CREATED_AT]?.value || '',
                updatedAt: studentRecord[KINTONE_FIELDS.STUDENT_AUTH.UPDATED_AT]?.value || '',
              },
              token: `kintone-token-${Date.now()}`, // 模擬 token
            }
          }
        } else {
          return {
            success: false,
            message: '驗證碼錯誤'
          }
        }
      } else {
        return {
          success: false,
          message: '找不到該學生'
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '登入失敗'
      }
    }
  },
} 