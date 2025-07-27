import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { ApiResponse } from '@/types'

// 建立 axios 實例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 回應攔截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // 未授權，清除認證狀態
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API 方法
export const authAPI = {
  // 學生/家長登入
  studentLogin: (data: { username: string; password: string }) =>
    api.post<ApiResponse>('/auth/student-login', data),

  // 驗證碼登入
  verificationLogin: (data: { studentName: string; verificationCode: string }) =>
    api.post<ApiResponse>('/auth/verification-login', data),

  // 老師登入
  teacherLogin: (data: { username: string; password: string }) =>
    api.post<ApiResponse>('/auth/teacher-login', data),

  // LINE 綁定驗證
  lineBinding: (data: { lineId: string; studentId: string }) =>
    api.post<ApiResponse>('/auth/line-binding', data),
}

export const courseAPI = {
  // 取得課表
  getCalendar: (params?: { startDate?: string; endDate?: string }) =>
    api.get<ApiResponse>('/courses/calendar', { params }),

  // 取得課程詳情
  getCourse: (id: string) =>
    api.get<ApiResponse>(`/courses/${id}`),

  // 更新課程狀態
  updateCourseStatus: (id: string, status: string) =>
    api.put<ApiResponse>(`/courses/${id}/status`, { status }),
}

export const leaveRequestAPI = {
  // 提交請假申請
  submitLeaveRequest: (data: any) =>
    api.post<ApiResponse>('/leave-requests', data),

  // 取得請假紀錄
  getLeaveRecords: (params?: any) =>
    api.get<ApiResponse>('/leave-requests', { params }),

  // 審核請假申請
  approveLeaveRequest: (id: string, data: { status: string; notes?: string }) =>
    api.put<ApiResponse>(`/leave-requests/${id}/approve`, data),
}

export const examRequestAPI = {
  // 提交小考/自習申請
  submitExamRequest: (data: any) =>
    api.post<ApiResponse>('/exam-requests', data),

  // 取得申請紀錄
  getExamRequests: (params?: any) =>
    api.get<ApiResponse>('/exam-requests', { params }),

  // 審核申請
  approveExamRequest: (id: string, data: { status: string; notes?: string }) =>
    api.put<ApiResponse>(`/exam-requests/${id}/approve`, data),
}

export const learningRecordAPI = {
  // 取得學習紀錄
  getLearningRecords: (params?: any) =>
    api.get<ApiResponse>('/learning-records', { params }),

  // 建立學習紀錄
  createLearningRecord: (data: any) =>
    api.post<ApiResponse>('/learning-records', data),

  // 更新學習紀錄
  updateLearningRecord: (id: string, data: any) =>
    api.put<ApiResponse>(`/learning-records/${id}`, data),

  // 上傳檔案
  uploadFile: (file: File, type: 'photo' | 'document') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return api.post<ApiResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export const gradeAPI = {
  // 取得成績紀錄
  getGrades: (params?: any) =>
    api.get<ApiResponse>('/grades', { params }),

  // 提交成績
  submitGrade: (data: any) =>
    api.post<ApiResponse>('/grades', data),

  // 更新成績
  updateGrade: (id: string, data: any) =>
    api.put<ApiResponse>(`/grades/${id}`, data),
}

export const reportAPI = {
  // 取得學習報告
  getReports: (params?: any) =>
    api.get<ApiResponse>('/reports', { params }),

  // 下載報告
  downloadReport: (id: string) =>
    api.get(`/reports/${id}/download`, { responseType: 'blob' }),

  // 產生報告
  generateReport: (data: { studentId: string; reportType: string; period: string }) =>
    api.post<ApiResponse>('/reports/generate', data),
}

export const teacherAPI = {
  // 取得老師薪資
  getSalary: (params?: any) =>
    api.get<ApiResponse>('/teacher/salary', { params }),

  // 取得學生歷程
  getStudentHistory: (studentId: string, params?: any) =>
    api.get<ApiResponse>(`/teacher/students/${studentId}/history`, { params }),
}

export const lineAPI = {
  // 發送 LINE 通知
  sendNotification: (data: { userId: string; message: string }) =>
    api.post<ApiResponse>('/line/send-notification', data),

  // 處理 LINE 請假
  processLeaveRequest: (data: { lineId: string; message: string }) =>
    api.post<ApiResponse>('/line/process-leave', data),
}

export default api 